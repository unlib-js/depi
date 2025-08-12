[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / decorators/DependsOn

# decorators/DependsOn

## Type Aliases

### DependsOnOptions\<T\>

> **DependsOnOptions**\<`T`\>: keyof `InstanceType`\<`T`\>[] \| `object`

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`AnyConstructor`](../index.md#anyconstructor) |

#### Defined in

[decorators/DependsOn.ts:7](https://github.com/unlib-js/depi/blob/main/src/decorators/DependsOn.ts#L7)

## Functions

### default()

> **default**\<`T`\>(`opts`): (`clazz`) => `undefined` \| `T`

A decorator that tracks the dependencies of a class.

This dependency information can be used to indicate that the decorated class
should be destroyed before its dependencies.

It achieves this by doing the following:

- Wrap the constructor to store dependencies in the constructor's parameters
  specified by `opts.params` in the `[symbols.ctorDeps]` property.
- Add the dependencies in properties specified by `opts.props` to the
  metadata on the class.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`AnyConstructor`](../index.md#anyconstructor) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | [`DependsOnOptions`](DependsOn.md#dependsonoptionst)\<`T`\> | An array of property keys or an object describing the properties and constructor parameters that the decorated class depends on. |

#### Returns

`Function`

A decorator function that can be applied to a class.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `clazz` | `T` |

##### Returns

`undefined` \| `T`

#### Defined in

[decorators/DependsOn.ts:31](https://github.com/unlib-js/depi/blob/main/src/decorators/DependsOn.ts#L31)
