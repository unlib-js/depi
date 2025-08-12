[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / dependency/depsOf

# dependency/depsOf

## Functions

### default()

> **default**\<`T`\>(`inst`): `object` \| `object`

Retrieves the dependencies of the given instance.

- Property dependencies are declared by the metadata of the class of the
  instance, identified by `MetaKey.DependsOnProps`.
- Constructor parameter dependencies are captured and stored in the property
  `[symbols.ctorDeps]`.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `inst` | `T` | The instance to retrieve dependencies for. |

#### Returns

`object` \| `object`

An object containing the instance's property dependencies and
constructor dependencies.

#### Defined in

[dependency/depsOf.ts:21](https://github.com/unlib-js/depi/blob/main/src/dependency/depsOf.ts#L21)
