import type DiGraph from './DiGraph'

/**
 * @internal
 */
export default function dfs<Node>(
  graph: DiGraph<Node>,
  root: Node,
  visited: Set<Node>,
  action: (node: Node) => void,
  onLoop?: (stack: Node[], graph: DiGraph<Node>) => void,
) {
  _dfs({
    graph,
    root,
    visited,
    stack: onLoop ? [] : undefined,
    action,
    onLoop,
  })
}

function _dfs<Node>({
  graph,
  root,
  visited,
  stack,
  action,
  onLoop,
}: {
  graph: DiGraph<Node>
  root: Node
  visited: Set<Node>
  stack?: Node[]
  action: (node: Node) => void
  onLoop?: (stack: Node[], graph: DiGraph<Node>) => void
}) {
  if (stack?.includes(root)) {
    onLoop?.([ ...stack, root ], graph)
    return
  }
  if (visited.has(root)) return
  visited.add(root)
  stack?.push(root)
  for (const child of graph.childrenOf(root)) {
    _dfs<Node>({
      graph,
      root: child,
      visited,
      stack,
      action,
      onLoop,
    })
  }
  stack?.pop()
  action(root)
}
