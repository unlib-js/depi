export default class DiGraph<Node> {
  public constructor(
    private readonly opts: {
      nodes(): Iterable<Node>
      childrenOf(node: Node): Set<Node>
      entries?: (this: DiGraph<Node>) => Iterable<readonly [Node, Set<Node>]>
    },
  ) {}

  public nodes() { return this.opts.nodes() }
  public childrenOf(node: Node) { return this.opts.childrenOf(node) }

  protected *_entries() {
    for (const node of this.nodes()) {
      yield [node, this.childrenOf(node)] as const
    }
  }

  public entries() {
    return this.opts.entries?.call(this) ?? this._entries()
  }
}

export class SimpleDiGraph<Node> extends DiGraph<Node> {
  /**
   * Constructs a new `SimpleDiGraph` instance from a map of edges.
   *
   * @param edges - A map of nodes to their child nodes.
   */
  public constructor(edges: Map<Node, Set<Node>>) {
    super({
      nodes: () => edges.keys(),
      childrenOf: node => edges.get(node) ?? new Set(),
      entries: () => edges.entries(),
    })
  }

  /**
   * Constructs a new `DiGraph` instance that is the reverse of the given
   * `DiGraph`.
   *
   * The resulting `DiGraph` will have the same nodes as the input `DiGraph`,
   * but the direction of the edges will be reversed. That is, if there was an
   * edge from node A to node B in the input `DiGraph`, there will be an edge
   * from node B to node A in the resulting `DiGraph`.
   *
   * @param graph - The `DiGraph` instance to reverse.
   * @returns A new `SimpleDiGraph` instance that is the reverse of the input
   * `DiGraph`.
   */
  public static fromReversed<Node>(graph: DiGraph<Node>) {
    const reversedEdges = new Map<Node, Set<Node>>()
    for (const [node, children] of graph.entries()) {
      if (!reversedEdges.has(node)) reversedEdges.set(node, new Set())
      for (const child of children) {
        const parents = reversedEdges.get(child) ?? new Set()
        parents.add(node)
        reversedEdges.set(child, parents)
      }
    }
    return new SimpleDiGraph(reversedEdges)
  }
}
