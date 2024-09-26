use globwalk::GlobWalkerBuilder;
use pulldown_cmark::{Event, HeadingLevel, Parser, Tag, TagEnd};
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
        Self {
            name,
            description,
            ty,
            default,
        }
    }
}

#[derive(Debug, Serialize, Clone)]
struct AEvent {
    name: String,
    description: String,
    ty: String,
}

impl AEvent {
    fn new(name: String, description: String, ty: String) -> Self {
        Self {
            name,
            description,
            ty,
        }
    }
}

#[derive(Debug, Serialize, Clone)]
struct Method {
    name: String,
    description: String,
    ty: String,
}

impl Method {
    fn new(name: String, description: String, ty: String) -> Self {
        Self {
            name,
            description,
            ty,
        }
    }
}

#[derive(Debug, Serialize, Clone)]
struct Component {
    name: String,
    props: Vec<Prop>,
    events: Vec<AEvent>,
    methods: Vec<Method>,
    children: Vec<Component>,
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

    fn set_path(&mut self, path: PathBuf) {
        self.path = path;
    }
}

fn main() {
    // 获取当前工作目录
    let mut components: Vec<Component> = Vec::new();
    let current_dir = env::current_dir()
        .unwrap()
        .join("components")
        .join("antd")
        .join("components");
    let component_names = get_components(&current_dir);
    for component_name in &component_names[28..29] {
        let mut new_component = Component::new(component_name.clone());
        let component_dir = current_dir.join(&component_name).join("index.zh-CN.md");
        new_component.set_path(component_dir);
        parse_markdown(&mut new_component);
        components.push(new_component);
    }
    write_components_schema(&components);
}

fn get_components(current_dir: &PathBuf) -> Vec<String> {
    // 创建 GlobWalker 来匹配路径
    let walker = GlobWalkerBuilder::from_patterns(
        &current_dir,
        &["**/index.zh-CN.md", "!{version,icon,col,row}/**"],
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

    let mut in_table = false;
    let mut in_header = false;
    let mut current_props: Vec<Prop> = Vec::new();
    let mut current_methods: Vec<Method> = Vec::new();
    let mut current_child: Option<Component> = None;

    let re = Regex::new(r"### (.+)").unwrap();

    let lines: Vec<&str> = markdown.lines().collect();
    for line in lines {
        let trimmed_line = line.trim();

        // 处理表格的开始和结束
        if trimmed_line.starts_with("|") && trimmed_line.contains("---") {
            in_table = true;
            continue;
        } else if in_table && trimmed_line.is_empty() {
            in_table = false; // 表格结束
            continue;
        }

        // 处理表格内容
        if in_table {
            let columns: Vec<&str> = trimmed_line.split('|').map(|s| s.trim()).collect();
            if columns.len() >= 5 {
                // 解析参数、说明、类型、默认值、版本
                let param = columns[1].to_string();
                let description = columns[2].to_string();
                let param_type = columns[3].to_string();
                let default_value = columns[4].to_string();

                // 将属性添加到 current_props 中
                current_props.push(Prop {
                    name: param,
                    description,
                    ty: param_type,
                    default: default_value,
                });
            }
            continue;
        }

        // 处理三级标题
        if let Some(captures) = re.captures(trimmed_line) {
            let title = captures.get(1).unwrap().as_str().trim();
            if title.contains('.') {
                // 处理子组件
                let child_name = title.split('.').last().unwrap().to_string();
                current_child = Some(Component::new(child_name));
            } else if title == "Methods" {
                in_header = true; // 进入方法解析状态
            } else if title.starts_with("Props") {
                // 处理属性部分
                // 此处可以添加更多逻辑以解析属性
            }
            continue;
        }

        // 处理方法内容
        if in_header && trimmed_line.starts_with('-') {
            let method_name = trimmed_line.trim_start_matches('-').trim();
            // 创建 Method 实例并添加到 current_methods
            current_methods.push(Method {
                name: method_name.to_string(),
                description: todo!(),
                ty: todo!(),
            });
        }
    }

    // 将解析得到的属性、方法和子组件添加到组件中
    component.props = current_props;
    component.methods = current_methods;
    if let Some(child) = current_child {
        component.children.push(child);
    }
}

fn write_components_schema(components: &Vec<Component>) {
    let json = serde_json::to_string_pretty(&components).unwrap();
    std::fs::write("components.json", json).expect("Failed to write file");
}
