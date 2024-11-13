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
| `param` | `number` | The index of the constructor parameter dependency | - | [dependency/types.ts:18](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L18) |
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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `value` | `T` | [dependency/types.ts:2](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L2) |

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
| `prop` | `string` \| `number` \| `symbol` | The property key of the property dependency | - | [dependency/types.ts:10](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L10) |
| `value` | `T` | - | [`RuntimeDependency`](types.md#runtimedependencyt).`value` | [dependency/types.ts:2](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L2) |

## Type Aliases

### UnlistedInstanceContext\<T\>

> **UnlistedInstanceContext**\<`T`\>: `object` & `object` \| `object`

#### Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `instances` | `Set`\<`T`\> | Listed instances, including the ones that are added during the traversal process. | [dependency/types.ts:26](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L26) |
| `obj` | `T` | The parent object that contains the unlisted instance as a dependency. | [dependency/types.ts:30](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L30) |

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Defined in

[dependency/types.ts:21](https://github.com/unlib-js/depi/blob/main/src/dependency/types.ts#L21)
