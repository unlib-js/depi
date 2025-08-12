[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / dependency/types

# dependency/types

## Interfaces

### RuntimeCtorParamDependency\<T\>

#### Extends

- [`RuntimeDependency`](types.md#runtimedependencyt)\<`T`\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `index?` | `number` | If the original value is an array, the index of `value` in the array | [`RuntimeDependency`](types.md#runtimedependencyt).`index` | [dependency/types.ts:6](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L6) |
| `param` | `number` | The index of the constructor parameter dependency | - | [dependency/types.ts:22](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L22) |
| `value` | `T` | - | [`RuntimeDependency`](types.md#runtimedependencyt).`value` | [dependency/types.ts:2](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L2) |

***

### RuntimeDependency\<T\>

#### Extended by

- [`RuntimePropDependency`](types.md#runtimepropdependencyt)
- [`RuntimeCtorParamDependency`](types.md#runtimectorparamdependencyt)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `index?` | `number` | If the original value is an array, the index of `value` in the array | [dependency/types.ts:6](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L6) |
| `value` | `T` | - | [dependency/types.ts:2](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L2) |

***

### RuntimePropDependency\<T\>

#### Extends

- [`RuntimeDependency`](types.md#runtimedependencyt)\<`T`\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `index?` | `number` | If the original value is an array, the index of `value` in the array | [`RuntimeDependency`](types.md#runtimedependencyt).`index` | [dependency/types.ts:6](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L6) |
| `prop` | `string` \| `number` \| `symbol` | The property key of the property dependency | - | [dependency/types.ts:14](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L14) |
| `value` | `T` | - | [`RuntimeDependency`](types.md#runtimedependencyt).`value` | [dependency/types.ts:2](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L2) |

## Type Aliases

### UnlistedInstanceContext\<T\>

> **UnlistedInstanceContext**\<`T`\>: `object` & `object` \| `object`

#### Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `instances` | `Set`\<`T`\> | Listed instances, including the ones that are added during the traversal process. | [dependency/types.ts:30](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L30) |
| `obj` | `T` | The parent object that contains the unlisted instance as a dependency. | [dependency/types.ts:34](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L34) |

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Defined in

[dependency/types.ts:25](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L25)
