use globwalk::GlobWalkerBuilder;
use pulldown_cmark::{Event, Parser, Tag, TagEnd};
use serde::Serialize;
use std::{env, path::PathBuf};

#[derive(Debug, Serialize)]
struct Prop {
    name: String,
    description: String,
    required: bool,
    ty: String,
    default: Option<String>,
}

impl Prop {
    fn new(
        name: String,
        description: String,
        required: bool,
        ty: String,
        default: Option<String>,
    ) -> Self {
        Self {
            name,
            description,
            required,
            ty,
            default,
        }
    }
}

#[derive(Debug, Serialize)]
struct Component {
    name: String,
    props: Vec<Prop>,
    children: Vec<Component>,
    path: PathBuf,
}

impl Component {
    fn new(name: String) -> Self {
        Self {
            name,
            props: Vec::new(),
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
    let current_dir = env::current_dir().unwrap().join("components/antd");
    let component_names = get_components(&current_dir);
    for component_name in component_names {
        let mut new_component = Component::new(component_name.clone());
        let component_dir = current_dir
            .join("components")
            .join(format!("{component_name}/index.zh-CN.md"));
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
        &[
            "components/**/index.zh-CN.md",
            "!components/{version,icon,col,row}/**",
        ],
    )
    .build()
    .expect("Failed to build glob walker");

    // 提取组件名称并过滤
    let component_names: Vec<String> = walker
        .filter_map(Result::ok)
        .filter_map(|entry| {
            // 转换路径为字符串，提取组件名称
            entry.path().to_str().and_then(|p| {
                let re = regex::Regex::new(r"components/antd/components/([^/]*)/").unwrap();
                re.captures(p)
                    .and_then(|caps| caps.get(1).map(|m| m.as_str().to_string()))
            })
        })
        .filter(|name| name != "overview")
        .collect();

    // 打印匹配到的组件名称
    component_names
}

fn parse_markdown(component: &mut Component) {
    let content = std::fs::read_to_string(&component.path).expect("Failed to read file");

    let parser = Parser::new(&content);
    let mut in_table = false;
    let mut in_header = false;
    let mut current_props: Vec<Prop> = Vec::new();

    for event in parser {
        match event {
            Event::Start(tag) => {
                if let Tag::Table(_) = tag {
                    in_table = true;
                }
                if let Tag::TableHead = tag {
                    in_header = true;
                }
            }
            Event::End(tag) => {
                if let TagEnd::Table = tag {
                    // 这里也没有括号
                    in_table = false;
                }
                if let TagEnd::TableHead = tag {
                    // 没有括号
                    in_header = false;
                }
                if let TagEnd::TableRow = tag {
                    if let Some(prop) = current_props.pop() {
                        component.add_prop(prop);
                    }
                }
            }
            Event::Text(text) => {
                if in_table && !in_header {
                    println!("{}", text);
                    let parts: Vec<&str> = text.split('|').map(|s| s.trim()).collect();
                    if parts.len() >= 4 {
                        let name = parts[0].to_string();
                        let description = parts[1].to_string();
                        let required = parts[2] == "true";
                        let ty = parts[3].to_string();
                        let default = if parts.len() > 4 {
                            Some(parts[4].to_string())
                        } else {
                            None
                        };
                        current_props.push(Prop::new(name, description, required, ty, default));
                    }
                }
            }
            _ => {}
        }
    }

    current_props
        .into_iter()
        .for_each(|prop| component.add_prop(prop));
}

fn write_components_schema(components: &Vec<Component>) {
    println!("{:#?}", components);
    let json = serde_json::to_string_pretty(&components).unwrap();
    std::fs::write("components.json", json).expect("Failed to write file");
}
