[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / dependency/FullDependencyGraphBuilder

# dependency/FullDependencyGraphBuilder

## Classes

### default\<T\>

#### Extends

- [`default`](DependencyGraphBuilder.md#defaultt)\<`T`\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Constructors

##### new default()

> **new default**\<`T`\>(`__namedParameters`): [`default`](FullDependencyGraphBuilder.md#defaultt)\<`T`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`FullDependencyGraphBuilderOptions`](FullDependencyGraphBuilder.md#fulldependencygraphbuilderoptionst)\<`T`\> |

###### Returns

[`default`](FullDependencyGraphBuilder.md#defaultt)\<`T`\>

###### Overrides

[`default`](DependencyGraphBuilder.md#defaultt).[`constructor`](DependencyGraphBuilder.md#constructors)

###### Defined in

[dependency/FullDependencyGraphBuilder.ts:39](https://github.com/unlib-js/depi/blob/main/src/dependency/FullDependencyGraphBuilder.ts#L39)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `depsOf` | `readonly` | (`inst`: `T`) => `object` \| `object` | [`default`](DependencyGraphBuilder.md#defaultt).`depsOf` | [dependency/DependencyGraphBuilder.ts:18](https://github.com/unlib-js/depi/blob/main/src/dependency/DependencyGraphBuilder.ts#L18) |
| `onUnlistedInstance?` | `protected` | [`OnUnlistedInstance`](FullDependencyGraphBuilder.md#onunlistedinstancet)\<`T`\> | - | [dependency/FullDependencyGraphBuilder.ts:38](https://github.com/unlib-js/depi/blob/main/src/dependency/FullDependencyGraphBuilder.ts#L38) |

#### Methods

##### fromInstances()

> **fromInstances**(`instances`): [`default`](../graph/DiGraph.md#defaultnode)\<`T`\>

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

###### Overrides

[`default`](DependencyGraphBuilder.md#defaultt).[`fromInstances`](DependencyGraphBuilder.md#frominstances)

###### Defined in

[dependency/FullDependencyGraphBuilder.ts:49](https://github.com/unlib-js/depi/blob/main/src/dependency/FullDependencyGraphBuilder.ts#L49)

## Interfaces

### FullDependencyGraphBuilderOptions\<T\>

#### Extends

- [`DependencyGraphBuilderOptions`](DependencyGraphBuilder.md#dependencygraphbuilderoptionst)\<`T`\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `depsOf?` | (`inst`: `T`) => `object` \| `object` | An optional function that determines the dependencies of a given instance of type `T`. This function is used by the `DependencyGraphBuilder` to construct the dependency graph. If not provided, the `depsOf` function will be used. | [`DependencyGraphBuilderOptions`](DependencyGraphBuilder.md#dependencygraphbuilderoptionst).`depsOf` | [dependency/DependencyGraphBuilder.ts:14](https://github.com/unlib-js/depi/blob/main/src/dependency/DependencyGraphBuilder.ts#L14) |
| `onUnlistedInstance?` | [`OnUnlistedInstance`](FullDependencyGraphBuilder.md#onunlistedinstancet)\<`T`\> | An optional callback that is called when an encountered instance is not in the initial set of instances provided to the `fromInstances` method. **See** OnUnlistedInstance | - | [dependency/FullDependencyGraphBuilder.ts:33](https://github.com/unlib-js/depi/blob/main/src/dependency/FullDependencyGraphBuilder.ts#L33) |

## Type Aliases

### OnUnlistedInstance()\<T\>

> **OnUnlistedInstance**\<`T`\>: (`unlistedInst`, `ctx`) => `boolean`

A function that is called when an encountered instance is not in the initial
set of instances provided to the `fromInstances` method.

This callback allows the caller to decide whether to include the unlisted
instance in the dependency graph or not.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unlistedInst` | `T` | The unlisted instance that was encountered. |
| `ctx` | [`UnlistedInstanceContext`](types.md#unlistedinstancecontextt)\<`T`\> | Additional context about the unlisted instance, including the current object that depends on `unlistedInst`, the property or constructor parameter that referenced the unlisted instance, and the set of instances that have already been added to the graph. |

#### Returns

`boolean`

`true` if the unlisted instance should be included in the
dependency graph, `false` otherwise.

#### Defined in

[dependency/FullDependencyGraphBuilder.ts:22](https://github.com/unlib-js/depi/blob/main/src/dependency/FullDependencyGraphBuilder.ts#L22)
