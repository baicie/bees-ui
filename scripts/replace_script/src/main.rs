use colored::*;
use core::str;
use git2::build::RepoBuilder;
use git2::Repository;
use regex::Regex;
use serde_json::Value;
use std::collections::HashSet;
use std::io::Error;
use std::path::PathBuf;
use std::process::Command;
use std::{env, fs};

lazy_static::lazy_static! {
  static ref RE: Regex = Regex::new(r"^(@ant-design/.*|@rc-component/.*|rc-.*)$").unwrap();
}
lazy_static::lazy_static! {
  static ref RE_REACT: Regex = Regex::new(r"^(react|@react.*|@.*react.*)$").unwrap();
}
lazy_static::lazy_static! {
  static ref RE_REACT_DOM: Regex = Regex::new(r"^(react-dom|@react-dom.*|@.*react-dom.*)$").unwrap();
}

#[tokio::main]
async fn main() {
    let mut deps: HashSet<String> = HashSet::new();
    deps.insert("antd".to_string());
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
    let ignore_folders = ["node_modules", "dist", ".github"];

    while !deps.is_empty() {
        let name = deps.iter().next().cloned().unwrap();
        iteration_deps(&name, &swap_dir, &packages_dir, &ignore_folders, &mut deps).await;
        deps.remove(&name);
    }
}

async fn iteration_deps(
    name: &String,
    swap_dir: &PathBuf,
    packages_dir: &PathBuf,
    ignore_folders: &[&str],
    deps: &mut HashSet<String>,
) {
    //get repo url
    let repo_url = get_npm_package_clone_url(name).await.unwrap().unwrap();
    let clone_dir = swap_dir.join(name);
    // clone repo
    clone_repo(&repo_url, &clone_dir).unwrap();
    // replace deps and copy to packages
    replace_deps(&name, &clone_dir, &packages_dir, ignore_folders, deps);
}

fn replace_deps(
    name: &String,
    clone_dir: &PathBuf,
    packages_dir: &PathBuf,
    ignore_folders: &[&str],
    deps: &mut HashSet<String>,
) {
    scan_deps(clone_dir, deps);
    // replace_package_json(clone_dir);
    println!("replace deps: {:?}", deps);

    // // copy to packages
    // let package_name = clone_dir.file_name().unwrap().to_str().unwrap();
    // let dest = packages_dir.join(package_name);
    // fs::copy(clone_dir, dest).unwrap();
}

fn replace_file_content(path: &PathBuf) {
    let content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("Error reading file: {:?}", e);
            return;
        }
    };

    let new_content = content.replace("@ant-design", "@bees-ui");
    fs::write(path, new_content).unwrap();
}

fn replace_package_json(path: &PathBuf) {
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

    let name = package_json["name"].as_str().unwrap();
    let new_name = format!("@bees-ui/{}", name);

    // 修改 name 字段
    if let Some(obj) = package_json.as_object_mut() {
        obj.insert("name".to_string(), Value::String(new_name.to_string()));
    } else {
        return;
    }

    // 将修改后的 JSON 数据写回到文件
    let updated_content = match serde_json::to_string_pretty(&package_json) {
        Ok(content) => content,
        Err(e) => {
            return;
        }
    };

    fs::write(&package_json_path, updated_content).unwrap();
}

fn replace_dependencies(deps: Option<&mut Value>) {
    if let Some(deps) = deps {
        if let Some(deps_map) = deps.as_object_mut() {
            let mut keys_to_update = Vec::new();
            let mut keys_to_preact = Vec::new();

            // 找出符合正则表达式的包名
            for key in deps_map.keys() {
                if RE.is_match(key) {
                    keys_to_update.push(key.clone());
                }
            }

            for key in deps_map.keys() {
                if RE_REACT.is_match(key) {
                    keys_to_preact.push(key.clone());
                }
            }

            // 替换包名
            for key in keys_to_update {
                deps_map.remove(&key).unwrap();
                let new_key = format!("@bees-ui/{}", key);
                deps_map.insert(new_key, Value::String("workspace:^".to_string()));
            }

            for key in keys_to_preact {
                let value = deps_map.remove(&key).unwrap();
                deps_map.insert("preact".to_string(), value);
            }
        }
    }
}

fn scan_deps(path: &PathBuf, deps: &mut HashSet<String>) {
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
    let dependencies = match package_json.get("dependencies") {
        Some(deps) => deps,
        None => return,
    };
    let peer_dependencies = match package_json.get("peerDependencies") {
        Some(deps) => deps,
        None => return,
    };

    let name = package_json["name"].as_str().unwrap();

    for (key, _) in dependencies.as_object().unwrap() {
        if RE.is_match(key) {
            deps.insert(key.clone());
        }
    }

    for (key, _) in peer_dependencies.as_object().unwrap() {
        if RE_REACT.is_match(key) {
            deps.insert(name.to_string());
            break;
        }
    }
}

fn clone_repo(url: &String, clone_dir: &PathBuf) -> Result<(), git2::Error> {
    // 获取远程仓库的主分支
    println!(
        "{} for {}",
        "Fetching repository information...".yellow(),
        url.green()
    );
    let branch = get_default_branch(url).unwrap();
    println!(
        "Cloning repository from {}/{} to {:?}",
        url.green(),
        branch.yellow(),
        clone_dir.to_string_lossy().cyan()
    );
    // 判断目录是否已经存在并且是一个 Git 仓库
    if clone_dir.exists() && clone_dir.join(".git").exists() {
        println!(
            "{}",
            "Repository already exists. Fetching updates...".yellow()
        );

        // 打开已有的仓库并执行更新
        let repo = Repository::open(clone_dir)?;

        // 拉取最新的代码
        let mut remote = repo.find_remote("origin")?;
        remote.fetch(&[&branch], None, None)?;

        // 检查出最新的分支
        let (object, reference) = repo.revparse_ext(&format!("origin/{}", branch))?;
        repo.checkout_tree(&object, None)?;

        // 更新HEAD指针到最新的分支
        if let Some(r) = reference {
            repo.set_head(r.name().unwrap())?;
        } else {
            repo.set_head_detached(object.id())?;
        }

        println!("{}", "Repository updated successfully.".green());
    } else {
        // 如果不存在则克隆
        if clone_dir.exists() {
            let _ = fs::remove_dir_all(clone_dir).unwrap(); // 如果目录存在但不是Git仓库，删除它
        }
        println!("{}", "Cloning repository...".yellow());

        // 执行克隆操作
        let mut builder = RepoBuilder::new();
        builder.branch(&branch);
        builder.clone(url, clone_dir)?;

        println!("{}", "Repository cloned successfully.".green());
    }

    Ok(())
}

// 获取远程仓库的默认分支

fn get_default_branch(url: &str) -> Result<String, Error> {
    let output = Command::new("git")
        .args(&["ls-remote", "--symref", url, "HEAD"])
        .output()?;

    if !output.status.success() {
        return Err(Error::new(
            std::io::ErrorKind::Other,
            format!("Git command failed with status: {:?}", output.status),
        ));
    }

    let output_str = str::from_utf8(&output.stdout).expect("Invalid UTF-8 output");

    // 查找行中的 "ref: refs/heads/" 部分
    if let Some(line) = output_str
        .lines()
        .find(|line| line.contains("ref: refs/heads/"))
    {
        let branch_name = line
            .split_whitespace()
            .nth(1) // 提取分支名称部分
            .ok_or_else(|| Error::new(std::io::ErrorKind::Other, "Branch name not found"))?
            .strip_prefix("refs/heads/")
            .ok_or_else(|| Error::new(std::io::ErrorKind::Other, "Invalid branch format"))?;
        Ok(branch_name.to_string())
    } else {
        Err(Error::new(
            std::io::ErrorKind::NotFound,
            "Default branch not found",
        ))
    }
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
            .replace("ssh://git@", "https://");
        Ok(Some(url))
    } else {
        Ok(None) // 没有找到仓库地址
    }
}
