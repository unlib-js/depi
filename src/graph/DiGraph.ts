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

/**
 * @internal
 */
export class SimpleDiGraph<Node> extends DiGraph<Node> {
  public constructor(edges: Map<Node, Set<Node>>) {
    super({
      nodes: () => edges.keys(),
      childrenOf: node => edges.get(node) ?? new Set(),
      entries: () => edges.entries(),
    })
  }
}
