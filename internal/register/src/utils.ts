export function insert(target: Node, node: Node, achor: Node) {
  target.insertBefore(node, achor);
}

export function detach(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

// export
