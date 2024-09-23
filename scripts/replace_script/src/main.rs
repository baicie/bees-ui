use colored::*;
use core::str;
use regex::Regex;
use serde_json::json;
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error as StdError;
use std::io;
use std::io::Error;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::{env, fs};

lazy_static::lazy_static! {
  static ref RE: Regex = Regex::new(r"^(@ant-design/|@rc-component/|rc-)(.*)$").unwrap();
  static ref RE_REACT: Regex = Regex::new(r"^(?:react|react-dom|@react.*|@.*react.*|@react-dom.*|@.*react-dom.*)$").unwrap();
  static ref RE_TRY: u32 = 10;
  static ref version: String = "^10.24.0".to_string();
//   static ref ignore_packages:Vec<String> = vec!["@ant-design/icon".to_string(),"icons".to_string()];
}

#[derive(Debug, Clone)]
struct Deps {
    cloned: bool,
    name: String,
    re_try: u32,
    replace_to: String,
    dir_name: String,
}

impl Deps {
    fn new(name: String, replace_to: Option<String>, dir_name: Option<String>) -> Self {
        Deps {
            cloned: false,
            name,
            re_try: 0,
            replace_to: replace_to.unwrap_or_else(|| String::from("default_value")),
            dir_name: dir_name.unwrap_or_else(|| String::from("default_value")),
        }
    }
}

#[tokio::main]
async fn main() {
    let mut deps: HashMap<String, Deps> = HashMap::new();
    let init = Deps::new(
        "antd".to_string(),
        Some("@bees-ui/antd".to_string()),
        Some("antd".to_string()),
    );
    deps.insert(init.name.clone(), init);
    let deps = Arc::new(Mutex::new(deps));

    // 获取当前工作目录
    let current_dir: PathBuf = match env::current_dir() {
        Ok(path) => path,
        Err(e) => {
            eprintln!("Error getting current directory: {:?}", e);
            return;
        }
    };

    let swap_dir = current_dir.join("swap");
    let packages_dir = current_dir.join("packages");
    let build_dir = current_dir.join("internal/build/src");
    let ignore_folders = [
        ".git",
        "node_modules",
        "dist",
        "es",
        "lib",
        "types",
        ".github",
        "package.json",
    ];

    let index = Arc::new(Mutex::new(1));

    while {
        let deps = deps.lock().unwrap();
        deps.values().any(|v| !v.cloned)
    } {
        let dep_item = {
            let deps = deps.lock().unwrap();
            deps.iter()
                .find(|(_, v)| !v.cloned && v.re_try <= *RE_TRY)
                .map(|(k, v)| (k.clone(), v.clone()))
                .unwrap()
        };

        println!(
            "{}",
            "==============================================================".blue()
        );
        println!(
            "{}",
            format!(
                "Processing: {}, size: {}, re_try: {}, current index: {}",
                dep_item.0,
                deps.lock().unwrap().len(),
                dep_item.1.re_try,
                *index.lock().unwrap()
            )
            .yellow()
        );

        let deps_clone = Arc::clone(&deps);
        let swap_dir_clone = swap_dir.clone();
        let packages_dir_clone = packages_dir.clone();
        let ignore_folders_clone = ignore_folders.clone();
        let index_clone = Arc::clone(&index);
        // 调用处理函数
        let handle = tokio::spawn(async move {
            match iteration_deps(
                &dep_item.0,
                &swap_dir_clone,
                &packages_dir_clone,
                &ignore_folders_clone,
                &deps_clone,
            )
            .await
            {
                Ok(_) => {
                    let mut deps = deps_clone.lock().unwrap();
                    if let Some(value) = deps.get_mut(&dep_item.0) {
                        value.cloned = true;
                    }
                    let mut index_guard = index_clone.lock().unwrap();
                    *index_guard += 1;
                }
                Err(e) => {
                    let mut deps = deps_clone.lock().unwrap();
                    if let Some(value) = deps.get_mut(&dep_item.0) {
                        value.re_try += 1;
                    }
                    eprintln!(
                        "{}",
                        format!("Error processing {}: {:?}", dep_item.0, e).red()
                    );
                }
            }
        });
        handle.await.unwrap();
    }
    deps.lock().unwrap().values().for_each(|v| {
        if !v.cloned || v.re_try > *RE_TRY {
            eprintln!("{}", format!("Failed to process: {}", v.name).red());
        }
    });
    output_deps(&deps.lock().unwrap(), &build_dir);
}

async fn iteration_deps(
    name: &String,
    swap_dir: &PathBuf,
    packages_dir: &PathBuf,
    ignore_folders: &[&str],
    deps: &Arc<Mutex<HashMap<String, Deps>>>,
) -> Result<String, Error> {
    //get repo url
    let clone_dir = swap_dir.join(name);
    // clone repo
    match get_npm_package_clone_url(name).await {
        Ok(repo_url) => match clone_repo(&repo_url, &clone_dir) {
            Ok(_) => {
                scan_deps(&clone_dir, deps);
                replace_package_json(&name, &clone_dir, &packages_dir, ignore_folders, deps);
                if name == "antd" {
                    let antd_dir = packages_dir.join("antd");
                    let version_path = antd_dir.join("components/version/version.ts");
                    fs::write(version_path, "export default '0.0.0';").unwrap();
                }

                Ok(String::new())
            }
            Err(e) => Err(Error::new(std::io::ErrorKind::Other, e.to_string())),
        },
        Err(e) => {
            eprintln!("Error getting repository URL: {:?}", e);
            return Err(Error::new(std::io::ErrorKind::Other, e.to_string()));
        }
    }
}

fn replace_package_json(
    name: &String,
    path: &PathBuf,
    packages_dir: &PathBuf,
    ignore_folders: &[&str],
    deps: &Arc<Mutex<HashMap<String, Deps>>>,
) {
    println!("{}", format!("Scanning dependencies in: {:?}", path).blue());
    let package_json_path = path.join("package.json");
    if !package_json_path.exists() {
        return;
    }
    let package_json = match fs::read_to_string(&package_json_path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("Error reading package.json: {:?}", e);
            return;
        }
    };
    let mut package_json: serde_json::Value = match serde_json::from_str(&package_json) {
        Ok(value) => value,
        Err(e) => {
            eprintln!("Error parsing package.json: {:?}", e);
            return;
        }
    };
    // edit name
    // let new_name = format!("@bees-ui/{}", name);

    if let Some(obj) = package_json.as_object_mut() {
        // obj.insert("name".to_string(), Value::String(new_name.to_string()));
        obj.insert("version".to_string(), Value::String("0.0.0".to_string()));
        obj.insert(
            "description".to_string(),
            Value::String("copy from antd".to_string()),
        );
        obj.insert(
            "files".to_string(),
            Value::Array(vec!["es".into(), "lib".into(), "types".into()]),
        );
    }
    // edit main module types
    if let Some(obj) = package_json.as_object_mut() {
        obj.insert("main".to_string(), Value::String(format!("./lib/index")));
        obj.insert("module".to_string(), Value::String(format!("./es/index")));
        obj.insert("types".to_string(), Value::String(format!("./types/index")));
    }
    // edit script build
    if let Some(obj) = package_json.as_object_mut() {
        let script = obj
            .entry("scripts".to_string())
            .or_insert_with(|| Value::Object(serde_json::Map::new()));
        if let Some(scripts) = script.as_object_mut() {
            scripts.insert(
                "build".to_string(),
                Value::String("pnpm bee build -d".to_string()),
            );
            scripts.insert(
                "dev".to_string(),
                Value::String("pnpm bee build --watch -d".to_string()),
            );
            scripts.insert(
                "clean".to_string(),
                Value::String("pnpm rimraf node_modules .turbo dist".to_string()),
            );
            let perpare = scripts
                .entry("prepare")
                .or_insert_with(|| Value::String("".to_string()));
            if perpare.to_string().contains("husky") || perpare.to_string().contains("dumi") {
                scripts.remove("prepare");
            }
            // scripts.insert("test".to_string(), Value::String("pnpm vitest".to_string()));
        }
    }
    // edit peerDependencies
    if let Some(obj) = package_json.as_object_mut() {
        obj.insert(
            "peerDependencies".to_string(),
            json!({
              "preact": *version,
            }),
        );
    }
    //edit dependencies
    if let Some(obj) = package_json.get_mut("dependencies") {
        if let Some(deps_map) = obj.as_object_mut() {
            let mut updates = Vec::new(); // 保存需要更新的键值对

            for (key, _) in deps_map.iter_mut() {
                if RE.is_match(key) {
                    let deps_guard = deps.lock().unwrap();
                    if let Some(deps_item) = deps_guard.get(key) {
                        updates.push((key.clone(), deps_item.replace_to.clone()));
                    }
                }
            }

            // 在循环结束后再进行 insert 操作
            for (key, value) in updates {
                deps_map.remove(&key);
                deps_map.insert(value, Value::String("workspace:^".to_string()));
            }
        }
    }
    let deps_guard = deps.lock().unwrap();
    if let Some(deps_guard) = deps_guard.get(name) {
        let out_put_path = packages_dir.join(deps_guard.dir_name.to_string());
        if let Some(obj) = package_json.as_object_mut() {
            obj.insert(
                "name".to_string(),
                Value::String(deps_guard.replace_to.to_string()),
            );
        }
        if !out_put_path.exists() {
            fs::create_dir_all(&out_put_path).unwrap();
        }
        let output_package_json_path = out_put_path.join("package.json");

        match fs::write(
            output_package_json_path,
            serde_json::to_string_pretty(&package_json).unwrap(),
        ) {
            Ok(_) => println!("{}", "package.json updated successfully.".green()),
            Err(e) => eprintln!("Error writing package.json: {:?}", e),
        };

        copy_with_ignore(path, &out_put_path, ignore_folders).unwrap();
    }
}

fn scan_deps(path: &PathBuf, deps: &Arc<Mutex<HashMap<String, Deps>>>) {
    println!("{}", format!("Scanning dependencies in: {:?}", path).cyan());

    let package_json_path = path.join("package.json");
    if !package_json_path.exists() {
        return;
    }

    let package_json = match fs::read_to_string(&package_json_path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("Error reading package.json: {:?}", e);
            return;
        }
    };

    let package_json: serde_json::Value = match serde_json::from_str(&package_json) {
        Ok(value) => value,
        Err(e) => {
            eprintln!("Error parsing package.json: {:?}", e);
            return;
        }
    };

    let default_dependencies = Value::Object(serde_json::Map::new());
    let dependencies = package_json
        .get("dependencies")
        .unwrap_or(&default_dependencies);

    let mut deps_lock = deps.lock().unwrap();
    if let Some(deps_map) = dependencies.as_object() {
        for (key, _) in deps_map {
            if ["@ant-design/icons".to_string()].contains(key) {
                println!("ignore package: {}", key);
                continue;
            }
            if RE.is_match(key) && !deps_lock.contains_key(key) {
                if let Some(caps) = RE.captures(key) {
                    let extracted_part = caps.get(2).map(|m| m.as_str().to_string());
                    let replacte_to = format!("{}{}", "@bees-ui/", extracted_part.clone().unwrap());
                    println!(
                        "{}",
                        format!("Found dependency: {} replace to {}", key, replacte_to).purple()
                    );
                    let item = Deps::new(key.clone(), Option::from(replacte_to), extracted_part);
                    deps_lock.insert(item.name.clone(), item);
                }
            }
        }
    }
}

fn clone_repo(url: &String, clone_dir: &PathBuf) -> Result<(), Box<dyn StdError>> {
    println!(
        "{}",
        format!("Cloning repository from {} to {:?}", url, clone_dir).bright_cyan()
    );

    // 判断目录是否已经存在并且是一个 Git 仓库
    if clone_dir.exists() && clone_dir.join(".git").exists() {
        // 如果是一个 Git 仓库，执行 git pull 来更新代码
        println!("{}", "Repository exists, updating...".cyan());

        let status = Command::new("git")
            .arg("-C")
            .arg(clone_dir.to_str().unwrap()) // 指定当前目录为仓库目录
            .arg("pull")
            .status()?; // 执行 `git pull`

        if status.success() {
            println!("{}", "Repository updated successfully.".green());
        } else {
            return Err("Failed to update repository.".into());
        }
    } else {
        // 如果目录不存在或不是 Git 仓库，执行 git clone
        println!("{}", "Repository does not exist, cloning...".cyan());

        // 如果目录存在但不是 Git 仓库，删除它
        if clone_dir.exists() {
            let _ = fs::remove_dir_all(clone_dir).unwrap();
        }

        // 执行 `git clone`
        let status = Command::new("git")
            .arg("clone")
            .arg(url)
            .arg(clone_dir.to_str().unwrap())
            .status()?; // 执行 `git clone`

        if status.success() {
            println!("{}", "Repository cloned successfully.".green());
        } else {
            return Err("Failed to clone repository.".into());
        }
    }

    Ok(())
}

async fn get_npm_package_clone_url(name: &String) -> Result<String, String> {
    let url = format!("https://registry.npmjs.org/{}", name);

    // 使用 `Result` 的链式调用，避免 `unwrap` 导致 panic
    let response = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;

    // 解析 JSON
    let package_info: Value = serde_json::from_str(&response).map_err(|e| e.to_string())?;

    // 获取仓库地址，直接将 None 转换为错误
    let repository_url = package_info["repository"]["url"]
        .as_str()
        .map(|url| {
            url.replace("git+", "")
                .replace("ssh://git@", "https://")
                .replace("#master", "")
                .trim()
                .to_string()
        })
        .ok_or("Repository URL not found".to_string())?;

    Ok(repository_url)
}

fn copy_with_ignore<P: AsRef<Path>>(
    source: P,
    destination: P,
    ignore_folders: &[&str],
) -> io::Result<()> {
    let source = source.as_ref();
    let destination = destination.as_ref();

    if !source.exists() {
        return Err(io::Error::new(io::ErrorKind::NotFound, "Source not found"));
    }

    if source.is_dir() {
        // 创建目标目录
        fs::create_dir_all(destination)?;

        // 遍历源目录
        for entry in fs::read_dir(source)? {
            let entry = entry?;
            let entry_name = entry.file_name().to_string_lossy().into_owned();
            let entry_path = entry.path();
            let target_path = destination.join(entry_name.clone());

            // 只在第一层检查忽略
            if ignore_folders.contains(&entry_name.as_str()) {
                continue;
            }

            // 递归复制
            if entry_path.is_dir() {
                // 只在第一层目录下复制，不递归
                fs::create_dir_all(&target_path)?;
                // 复制该目录下的内容
                copy_with_ignore(entry_path, target_path, &[])?;
            } else {
                fs::copy(entry_path, target_path)?;
            }
        }
    } else {
        fs::copy(source, destination)?;
    }

    Ok(())
}

//输出deps为typescript数组
//  { find: 'react', replacement: 'preact/compat' },
//给打包程序使用
fn output_deps(deps: &HashMap<String, Deps>, output_path: &Path) {
    let mut output = String::from("export default [");
    for (key, value) in deps {
        output.push_str(&format!(
            "{{ find: '{}', replacement: '{}' }},",
            key, value.replace_to
        ));
    }
    output.push_str("];");
    let output_path = output_path.join("deps.ts");
    fs::write(output_path, output).unwrap();
}
