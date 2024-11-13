[**@unlib-js/depi**](README.md) • **Docs**

***

[@unlib-js/depi](README.md) / index

# index

## Enumerations

### MetaKey

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| ------ | ------ | ------ |
| `DependsOnProps` | `"depends-on-props"` | [common.ts:2](https://github.com/unlib-js/depi/blob/main/src/common.ts#L2) |

## Interfaces

### Dependant\<T\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `[ctorDeps]?` | `readonly` | [`RuntimeCtorParamDependency`](dependency/types.md#runtimectorparamdependencyt)\<`T`\>[] | The constructor parameters that this object depends on. Property dependencies are recorded in the `MetaKey.DependsOnProps` metadata. | [types.ts:14](https://github.com/unlib-js/depi/blob/main/src/types.ts#L14) |

***

### DestroyAllOptions\<T\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `dependencyGraphOf?` | [`default`](dependency/DependencyGraphBuilder.md#defaultt)\<`T`\> \| (`instances`) => [`default`](graph/DiGraph.md#defaultnode)\<`T`\> | An optional dependency graph builder function or instance that can be used to construct the dependency graph for the instances being destroyed. If not provided, a default `FullDependencyGraphBuilder` will be used. | [destroy.ts:34](https://github.com/unlib-js/depi/blob/main/src/destroy.ts#L34) |
| `instances` | `Set`\<`T`\> \| `T`[] | The instances to be destroyed. | [destroy.ts:10](https://github.com/unlib-js/depi/blob/main/src/destroy.ts#L10) |
| `onCircularDependencyDetected?` | (`stack`: `T`[], `graph`: [`default`](graph/DiGraph.md#defaultnode)\<`T`\>) => `void` | An optional callback that is called when a circular dependency is detected. The callback receives the stack of instances involved in the circular dependency, and the full dependency graph. NOTE: This callback is called during the traverse-and-destroy process. Therefore, it could be called multiple times when the destruction of some instances may have already been started. | [destroy.ts:25](https://github.com/unlib-js/depi/blob/main/src/destroy.ts#L25) |

***

### Symbols

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| `ctorDeps` | `readonly` | *typeof* `ctorDeps` | [common.ts:6](https://github.com/unlib-js/depi/blob/main/src/common.ts#L6) |

## Type Aliases

### AnyConstructor()

> **AnyConstructor**: (...`args`) => `any`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

#### Returns

`any`

#### Defined in

[types.ts:5](https://github.com/unlib-js/depi/blob/main/src/types.ts#L5)

## Variables

### symbols

> `const` **symbols**: [`Symbols`](index.md#symbols)

#### Defined in

[common.ts:9](https://github.com/unlib-js/depi/blob/main/src/common.ts#L9)
