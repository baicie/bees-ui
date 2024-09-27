use globwalk::GlobWalkerBuilder;
use regex::Regex;
use serde::Serialize;
use std::{env, path::PathBuf};

#[derive(Debug, Serialize, Clone)]
struct Prop {
    name: String,
    description: String,
    ty: String,
    default: String,
}

impl Prop {
    fn new(name: String, description: String, ty: String, default: String) -> Self {
        let name = if name.trim() == "-" {
            String::new()
        } else {
            name.trim().to_string()
        };
        let description = if description.trim() == "-" {
            String::new()
        } else {
            description.trim().to_string()
        };
        let ty = if ty.trim() == "-" {
            String::new()
        } else {
            ty.trim().to_string()
        };
        let default = if default.trim() == "-" {
            String::new()
        } else {
            default.trim().to_string()
        };
        Self {
            name,
            description,
            ty,
            default,
        }
    }
}

#[derive(Debug, Serialize, Clone)]
struct Method {
    name: String,
    description: String,
}

impl Method {
    fn new(name: String, description: String) -> Self {
        let name = if name.trim() == "-" {
            String::new()
        } else {
            name.trim().to_string()
        };
        let description = if description.trim() == "-" {
            String::new()
        } else {
            description.trim().to_string()
        };
        Self { name, description }
    }
}

#[derive(Debug, Serialize, Clone)]
struct Component {
    name: String,
    props: Vec<Prop>,
    events: Vec<Prop>,
    methods: Vec<Method>,
    children: Vec<Component>,
    #[serde(skip_serializing)]
    path: PathBuf,
}

impl Component {
    fn new(name: String) -> Self {
        Self {
            name,
            props: Vec::new(),
            events: Vec::new(),
            methods: Vec::new(),
            children: Vec::new(),
            path: PathBuf::new(),
        }
    }

    fn add_child(&mut self, child: Component) {
        self.children.push(child);
    }

    fn add_prop(&mut self, prop: Prop) {
        self.props.push(prop);
    }

    fn add_event(&mut self, event: Prop) {
        self.events.push(event);
    }

    fn add_method(&mut self, method: Method) {
        self.methods.push(method);
    }

    fn set_path(&mut self, path: PathBuf) {
        self.path = path;
    }
}

fn main() {
    // 获取当前工作目录
    let mut components: Vec<Component> = Vec::new();
    let current_dir = env::current_dir().unwrap();
    let component_path = current_dir
        .join("components")
        .join("antd")
        .join("components");
    let target_path = current_dir
        .join("packages")
        .join("schema")
        .join("src")
        .join("index.ts");
    let component_names = get_components(&component_path);
    for component_name in &component_names {
        let mut new_component = Component::new(component_name.clone());
        let component_dir = component_path.join(&component_name).join("index.en-US.md");
        new_component.set_path(component_dir);
        parse_markdown(&mut new_component);
        components.push(new_component);
    }
    write_components_schema(&components, &target_path);
}

fn get_components(current_dir: &PathBuf) -> Vec<String> {
    // 创建 GlobWalker 来匹配路径
    let walker = GlobWalkerBuilder::from_patterns(
        &current_dir,
        &["**/index.en-US.md", "!{version,icon,col,row}/**"],
    )
    .build()
    .expect("Failed to build glob walker");

    // 提取组件名称并过滤
    let component_names: Vec<String> = walker
        .filter_map(Result::ok)
        .filter_map(|entry| {
            let path_str = entry.path().to_string_lossy().replace("\\", "/");
            let re = regex::Regex::new(r"components/antd/components/([^/]+)/").unwrap();
            re.captures(&path_str)
                .and_then(|caps| caps.get(1).map(|m| m.as_str().to_string()))
        })
        .filter(|name| name != "overview")
        .collect();
    // 打印匹配到的组件名称
    component_names
}

fn parse_markdown(component: &mut Component) {
    let markdown = std::fs::read_to_string(&component.path).expect("Failed to read file");

    let re_api = Regex::new(r"## API").unwrap();
    let re_event = Regex::new(r"^on([A-Z].*)").unwrap();
    let re_method = Regex::new(r"### Methods").unwrap();
    let re_child = Regex::new(r"^####\s+([^\#].*)").unwrap();
    let re_row = Regex::new(
        r"\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(?:([^|]*)\s*\|\s*([^|]*)\s*\|)?\s*([^|]+)\s*\|",
    )
    .unwrap();
    let mut in_api = false;
    let mut in_method = false;
    let mut in_child = false;

    let lines: Vec<&str> = markdown.lines().collect();
    for line in lines {
        let trimmed_line = line.trim();
        // apis start
        if re_api.is_match(trimmed_line) {
            in_api = true;
            continue;
        // child component start
        } else if re_child.is_match(trimmed_line) {
            // if trimmed_line.contains(for)
            // in_child = true;
            let caps = re_child.captures(trimmed_line).unwrap();
            let child_name = caps.get(1).map_or("", |m| m.as_str().trim());

            // 判断是否有子组件
            if !child_name.is_empty() && child_name.len() > component.name.len() {
                in_child = true;
                let child = Component::new(child_name.to_string());
                component.add_child(child);
            }
            continue;
        }
        // methods start
        else if re_method.is_match(trimmed_line) {
            in_method = true;
            in_api = false;
            in_child = false;
            continue;
        }
        // props and events
        if re_row.is_match(trimmed_line) && in_api && !in_child {
            if trimmed_line.contains("Property") || trimmed_line.contains("---") {
                continue;
            }
            if let Some(prop) = match_prop(trimmed_line, &re_row) {
                if re_event.is_match(&prop.name) {
                    component.add_event(prop);
                } else {
                    component.add_prop(prop);
                }
            }
        }
        // child component
        else if re_row.is_match(trimmed_line) && in_child && in_api {
            if trimmed_line.contains("Property") || trimmed_line.contains("---") {
                continue;
            }
            if let Some(prop) = match_prop(trimmed_line, &re_row) {
                if re_event.is_match(&prop.name) {
                    component.children.last_mut().unwrap().add_event(prop);
                } else {
                    component.children.last_mut().unwrap().add_prop(prop);
                }
            }
        }
        // methods
        else if re_row.is_match(trimmed_line) && in_method {
            if trimmed_line.contains("Name") || trimmed_line.contains("---") {
                continue;
            }
            if let Some(prop) = match_method(trimmed_line, &re_row) {
                component.add_method(prop);
            }
        }
    }
}

fn match_prop(line: &str, re_row: &Regex) -> Option<Prop> {
    if let Some(cap) = re_row.captures(line) {
        let name = cap.get(1).map_or(String::new(), |m| m.as_str().to_string());
        let description = cap.get(2).map_or(String::new(), |m| m.as_str().to_string());
        let ty = cap.get(3).map_or(String::new(), |m| m.as_str().to_string());
        let default = cap.get(4).map_or(String::new(), |m| m.as_str().to_string());
        Some(Prop::new(name, description, ty, default))
    } else {
        None
    }
}

fn match_method(line: &str, re_row: &Regex) -> Option<Method> {
    if let Some(cap) = re_row.captures(line) {
        let name = cap.get(1).map_or(String::new(), |m| m.as_str().to_string());
        let description = cap.get(2).map_or(String::new(), |m| m.as_str().to_string());
        Some(Method::new(name, description))
    } else {
        None
    }
}

fn write_components_schema(components: &Vec<Component>, target_path: &PathBuf) {
    let json = serde_json::to_string_pretty(&components).unwrap();
    let json = format!("export default {};", json);
    std::fs::write(target_path, json).expect("Failed to write file");
}
