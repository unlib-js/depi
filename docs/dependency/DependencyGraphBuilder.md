[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / dependency/DependencyGraphBuilder

# dependency/DependencyGraphBuilder

## Classes

### `abstract` default\<T\>

#### Extended by

- [`default`](FullDependencyGraphBuilder.md#defaultt)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Constructors

##### new default()

> **new default**\<`T`\>(`__namedParameters`): [`default`](DependencyGraphBuilder.md#defaultt)\<`T`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`DependencyGraphBuilderOptions`](DependencyGraphBuilder.md#dependencygraphbuilderoptionst)\<`T`\> |

###### Returns

[`default`](DependencyGraphBuilder.md#defaultt)\<`T`\>

###### Defined in

[dependency/DependencyGraphBuilder.ts:19](https://github.com/unlib-js/depi/blob/main/src/dependency/DependencyGraphBuilder.ts#L19)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| `depsOf` | `readonly` | *typeof* [`default`](depsOf.md#default) | [dependency/DependencyGraphBuilder.ts:18](https://github.com/unlib-js/depi/blob/main/src/dependency/DependencyGraphBuilder.ts#L18) |

#### Methods

##### fromInstances()

> `abstract` **fromInstances**(`instances`): [`default`](../graph/DiGraph.md#defaultnode)\<`T`\>

Constructs a directed graph (`DiGraph`) from the provided set of
instances.

The graph will represent the dependencies between the instances, as
determined by the `depsOf` function provided in the constructor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `instances` | `Set`\<`T`\> | The set of instances to build the dependency graph from. |

###### Returns

[`default`](../graph/DiGraph.md#defaultnode)\<`T`\>

A directed graph (DiGraph) representing the dependencies between
the instances.

###### Defined in

[dependency/DependencyGraphBuilder.ts:37](https://github.com/unlib-js/depi/blob/main/src/dependency/DependencyGraphBuilder.ts#L37)

## Interfaces

### DependencyGraphBuilderOptions\<T\>

#### Extended by

- [`FullDependencyGraphBuilderOptions`](FullDependencyGraphBuilder.md#fulldependencygraphbuilderoptionst)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `depsOf?` | *typeof* [`default`](depsOf.md#default) | An optional function that determines the dependencies of a given instance of type `T`. This function is used by the `DependencyGraphBuilder` to construct the dependency graph. If not provided, the `depsOf` function will be used. | [dependency/DependencyGraphBuilder.ts:14](https://github.com/unlib-js/depi/blob/main/src/dependency/DependencyGraphBuilder.ts#L14) |
