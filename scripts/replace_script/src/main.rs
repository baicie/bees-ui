use colored::*;
use core::str;
use git2::Config as GitConfig;
use git2::Repository;
use regex::Regex;
use serde_json::json;
use serde_json::Value;
use std::collections::HashMap;
use std::io::Error;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::{env, fs};

lazy_static::lazy_static! {
  static ref RE: Regex = Regex::new(r"^(@ant-design/.*|@rc-component/.*|rc-.*)$").unwrap();
  static ref RE_REACT: Regex = Regex::new(r"^(?:react|react-dom|@react.*|@.*react.*|@react-dom.*|@.*react-dom.*)$").unwrap();
  static ref RE_TRY: u32 = 10;
  static ref version: String = "^17.0.2".to_string();
}

#[derive(Debug, Clone)]
struct Deps {
    cloned: bool,
    name: String,
    re_try: u32,
}

impl Deps {
    fn new(name: String) -> Self {
        Deps {
            cloned: false,
            name,
            re_try: 0,
        }
    }
}

#[tokio::main]
async fn main() {
    env::set_var("http_proxy", "http://127.0.0.1:7890");
    env::set_var("https_proxy", "http://127.0.0.1:7890");

    let mut deps: HashMap<String, Deps> = HashMap::new();
    let init = Deps::new("antd".to_string());
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
    let ignore_folders = [];

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
}

async fn iteration_deps(
    name: &String,
    swap_dir: &PathBuf,
    packages_dir: &PathBuf,
    ignore_folders: &[&str],
    deps: &Arc<Mutex<HashMap<String, Deps>>>,
) -> Result<String, Error> {
    //get repo url
    let repo_url = get_npm_package_clone_url(name).await.unwrap().unwrap();
    let clone_dir = swap_dir.join(name);
    // clone repo
    match clone_repo(&repo_url, &clone_dir) {
        Ok(_) => {
            scan_deps(&clone_dir, deps, name);
            replace_package_json(&name, &clone_dir, &swap_dir, &packages_dir, ignore_folders);
            Ok(String::new())
        }
        Err(e) => Err(Error::new(std::io::ErrorKind::Other, e.message())),
    }
}

fn replace_package_json(
    name: &String,
    path: &PathBuf,
    swap_dir: &PathBuf,
    packages_dir: &PathBuf,
    ignore_folders: &[&str],
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
    let new_name = format!("@bees-ui/{}", name);
    if let Some(obj) = package_json.as_object_mut() {
        obj.insert("name".to_string(), Value::String(new_name.to_string()));
        obj.insert("version".to_string(), Value::String("0.0.0".to_string()));
        obj.insert(
            "description".to_string(),
            Value::String("copy from antd".to_string()),
        );
        obj.insert("files".to_string(), Value::Array(vec!["dist".into()]));
        obj.insert(
            "exports".to_string(),
            json!({
                ".": {
                    "default": "./dist/es/index.js",
                    "require": "./dist/lib/index.js",
                    "import": "./dist/es/index.js",
                    "types": "./dist/types/index.d.ts"
                }
            }),
        );
    }
    // edit main module types
    if let Some(obj) = package_json.as_object_mut() {
        obj.insert(
            "main".to_string(),
            Value::String(format!("./dist/lib/index.js")),
        );
        obj.insert(
            "module".to_string(),
            Value::String(format!("./dist/es/index.js")),
        );
        obj.insert(
            "types".to_string(),
            Value::String(format!("./dist/types/index.d.ts")),
        );
    }
    // edit script build
    if let Some(obj) = package_json.as_object_mut() {
        let script = obj
            .entry("scripts".to_string())
            .or_insert_with(|| Value::Object(serde_json::Map::new()));
        if let Some(scripts) = script.as_object_mut() {
            scripts.insert(
                "build".to_string(),
                Value::String("pnpm bee build --minify --sourcemap".to_string()),
            );
            scripts.insert(
                "dev".to_string(),
                Value::String("pnpm bee build --watch --sourcemap".to_string()),
            );
            scripts.insert(
                "clean".to_string(),
                Value::String("pnpm rimraf node_modules .turbo dist".to_string()),
            );
            // scripts.insert("test".to_string(), Value::String("pnpm vitest".to_string()));
        }
    }
    // no edit dependencies
    // edit peerDependencies
    if let Some(obj) = package_json.as_object_mut() {
        obj.insert(
            "peerDependencies".to_string(),
            json!({
              "preact": version,
            }),
        );
    }
}

fn scan_deps(path: &PathBuf, deps: &Arc<Mutex<HashMap<String, Deps>>>, pkg_name: &String) {
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
    let peer_dependencies = package_json
        .get("peerDependencies")
        .unwrap_or(&default_dependencies);

    let name = package_json["name"].as_str().unwrap_or(pkg_name);

    // Lock the `deps` HashMap before accessing it
    let mut deps_lock = deps.lock().unwrap();

    if let Some(deps_map) = dependencies.as_object() {
        for (key, _) in deps_map {
            if RE.is_match(key) && !deps_lock.contains_key(key) {
                println!("{}", format!("Found dependency: {}", key).purple());
                let item = Deps::new(key.clone());
                deps_lock.insert(item.name.clone(), item);
            }
        }
    }

    if let Some(peer_deps_map) = peer_dependencies.as_object() {
        for (key, _) in peer_deps_map {
            if RE_REACT.is_match(key) && deps_lock.contains_key(name) {
                println!("{}", format!("Found peer dependency: {}", key).purple());
                let item = Deps::new(name.to_string());
                deps_lock.insert(item.name.clone(), item);
                break; // If the condition is met, break the loop
            }
        }
    }
}

fn clone_repo(url: &String, clone_dir: &PathBuf) -> Result<(), git2::Error> {
    // 获取远程仓库的主分支

    let mut config = GitConfig::open_default().unwrap();
    config.set_str("http.proxy", "http://127.0.0.1:7890")?;

    println!(
        "{}",
        format!("Cloning repository from {}  to {:?}", url, clone_dir).bright_cyan()
    );
    // 判断目录是否已经存在并且是一个 Git 仓库
    if clone_dir.exists() && clone_dir.join(".git").exists() {
        // 打开已有的仓库并执行更新
        println!("{}", "Repository exists, updating...".cyan());
        let repo = Repository::open(clone_dir)?;

        // 拉取最新的代码
        let mut remote = repo.find_remote("origin")?;
        remote.fetch(&["HEAD"], None, None)?;
    } else {
        // 如果不存在则克隆
        println!(
            "{}",
            format!("Repository does not exist, cloning...").cyan()
        );
        if clone_dir.exists() {
            let _ = fs::remove_dir_all(clone_dir).unwrap(); // 如果目录存在但不是Git仓库，删除它
        }
        // 执行克隆操作
        Repository::clone(url, clone_dir)?;
    }
    println!("{}", "Repository updated successfully.".green());

    Ok(())
}

async fn get_npm_package_clone_url(name: &String) -> Result<Option<String>, String> {
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

    // 获取仓库地址
    if let Some(repository) = package_info["repository"]["url"].as_str() {
        let url = repository
            .replace("git+", "")
            .replace("ssh://git@", "https://")
            .replace("#master", "");
        Ok(Some(url.trim().to_string()))
    } else {
        Ok(None) // 没有找到仓库地址
    }
}
