[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / graph/DiGraph

# graph/DiGraph

## Classes

### default\<Node\>

#### Extended by

- [`SimpleDiGraph`](DiGraph.md#simpledigraphnode)

#### Type Parameters

| Type Parameter |
| ------ |
| `Node` |

#### Constructors

##### new default()

> **new default**\<`Node`\>(`opts`): [`default`](DiGraph.md#defaultnode)\<`Node`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `object` |
| `opts.entries`? | (`this`) => `Iterable`\<readonly [`Node`, `Set`\<`Node`\>], `any`, `any`\> |
| `opts.childrenOf` |
| `opts.nodes` |

###### Returns

[`default`](DiGraph.md#defaultnode)\<`Node`\>

###### Defined in

[graph/DiGraph.ts:2](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L2)

#### Methods

##### \_entries()

> `protected` **\_entries**(): `Generator`\<readonly [`Node`, `Set`\<`Node`\>], `void`, `unknown`\>

###### Returns

`Generator`\<readonly [`Node`, `Set`\<`Node`\>], `void`, `unknown`\>

###### Defined in

[graph/DiGraph.ts:13](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L13)

##### childrenOf()

> **childrenOf**(`node`): `Set`\<`Node`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `Node` |

###### Returns

`Set`\<`Node`\>

###### Defined in

[graph/DiGraph.ts:11](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L11)

##### entries()

> **entries**(): `Iterable`\<readonly [`Node`, `Set`\<`Node`\>], `any`, `any`\>

###### Returns

`Iterable`\<readonly [`Node`, `Set`\<`Node`\>], `any`, `any`\>

###### Defined in

[graph/DiGraph.ts:19](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L19)

##### nodes()

> **nodes**(): `Iterable`\<`Node`, `any`, `any`\>

###### Returns

`Iterable`\<`Node`, `any`, `any`\>

###### Defined in

[graph/DiGraph.ts:10](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L10)

***

### SimpleDiGraph\<Node\>

#### Extends

- [`default`](DiGraph.md#defaultnode)\<`Node`\>

#### Type Parameters

| Type Parameter |
| ------ |
| `Node` |

#### Constructors

##### new SimpleDiGraph()

> **new SimpleDiGraph**\<`Node`\>(`edges`): [`SimpleDiGraph`](DiGraph.md#simpledigraphnode)\<`Node`\>

Constructs a new `SimpleDiGraph` instance from a map of edges.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edges` | `Map`\<`Node`, `Set`\<`Node`\>\> | A map of nodes to their child nodes. |

###### Returns

[`SimpleDiGraph`](DiGraph.md#simpledigraphnode)\<`Node`\>

###### Overrides

[`default`](DiGraph.md#defaultnode).[`constructor`](DiGraph.md#constructors)

###### Defined in

[graph/DiGraph.ts:30](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L30)

#### Methods

##### \_entries()

> `protected` **\_entries**(): `Generator`\<readonly [`Node`, `Set`\<`Node`\>], `void`, `unknown`\>

###### Returns

`Generator`\<readonly [`Node`, `Set`\<`Node`\>], `void`, `unknown`\>

###### Inherited from

[`default`](DiGraph.md#defaultnode).[`_entries`](DiGraph.md#_entries)

###### Defined in

[graph/DiGraph.ts:13](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L13)

##### childrenOf()

> **childrenOf**(`node`): `Set`\<`Node`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `Node` |

###### Returns

`Set`\<`Node`\>

###### Inherited from

[`default`](DiGraph.md#defaultnode).[`childrenOf`](DiGraph.md#childrenof)

###### Defined in

[graph/DiGraph.ts:11](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L11)

##### entries()

> **entries**(): `Iterable`\<readonly [`Node`, `Set`\<`Node`\>], `any`, `any`\>

###### Returns

`Iterable`\<readonly [`Node`, `Set`\<`Node`\>], `any`, `any`\>

###### Inherited from

[`default`](DiGraph.md#defaultnode).[`entries`](DiGraph.md#entries)

###### Defined in

[graph/DiGraph.ts:19](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L19)

##### nodes()

> **nodes**(): `Iterable`\<`Node`, `any`, `any`\>

###### Returns

`Iterable`\<`Node`, `any`, `any`\>

###### Inherited from

[`default`](DiGraph.md#defaultnode).[`nodes`](DiGraph.md#nodes)

###### Defined in

[graph/DiGraph.ts:10](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L10)

##### fromReversed()

> `static` **fromReversed**\<`Node`\>(`graph`): [`SimpleDiGraph`](DiGraph.md#simpledigraphnode)\<`Node`\>

Constructs a new `DiGraph` instance that is the reverse of the given
`DiGraph`.

The resulting `DiGraph` will have the same nodes as the input `DiGraph`,
but the direction of the edges will be reversed. That is, if there was an
edge from node A to node B in the input `DiGraph`, there will be an edge
from node B to node A in the resulting `DiGraph`.

###### Type Parameters

| Type Parameter |
| ------ |
| `Node` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `graph` | [`default`](DiGraph.md#defaultnode)\<`Node`\> | The `DiGraph` instance to reverse. |

###### Returns

[`SimpleDiGraph`](DiGraph.md#simpledigraphnode)\<`Node`\>

A new `SimpleDiGraph` instance that is the reverse of the input
`DiGraph`.

###### Defined in

[graph/DiGraph.ts:51](https://github.com/unlib-js/depi/blob/main/src/graph/DiGraph.ts#L51)
