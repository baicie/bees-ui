use std::collections::HashSet;
use std::path::PathBuf;
use std::{env, fs, iter};

use regex::Regex;
use serde_json::Value;

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
    let antd_dir = current_dir.join("antd");

    while !deps.is_empty() {
        let name = deps.iter().next().cloned().unwrap();
        iteration_deps(&name);
        deps.remove(&name);
    }
}

fn iteration_deps(name: &String) {
    //get repo url
    let repo_url =
    // clone repo
    // replace deps
}

fn clone_repo(url: &String) {
    // git clone
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
    let re = Regex::new(r"^(@ant-design/.*|@rc-component/.*|rc-.*)$").unwrap();

    for (key, _) in dependencies.as_object().unwrap() {
        if re.is_match(key) {
            deps.insert(key.clone());
        }
    }
}

// fn clone_replace_deps() {}

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
        let url = repository.replace("git+", "");
        Ok(Some(url))
    } else {
        Ok(None) // 没有找到仓库地址
    }
}
