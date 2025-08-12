[**@unlib-js/depi**](../../README.md) • **Docs**

***

[@unlib-js/depi](../../README.md) / helpers/inversify/getDeps

# helpers/inversify/getDeps

## Functions

### default()

> **default**\<`T`\>(`clazz`): `object`

Retrieves the dependencies (properties and constructor parameters) of a
given class decorated with InversifyJS's `@inject` decorator.

This function uses the `MetadataReader` from the `inversify` library to
extract the metadata associated with the class.

The returned object contains two properties:
- `props`: an array of property keys that have the `@inject()` decorator
  applied.
- `params`: a function that returns an array of constructor parameter
  indexes that have the `@inject()` decorator applied.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`AnyConstructor`](../../index.md#anyconstructor) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clazz` | `T` | The class for which to retrieve the dependencies. |

#### Returns

`object`

An object containing the property and parameter dependencies of
the class.

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `params` | \<`T`\>(`clazz`) => `number`[] | paramDepsOf | [helpers/inversify/getDeps.ts:28](https://github.com/unlib-js/depi/blob/main/src/helpers/inversify/getDeps.ts#L28) |
| `props` | (`string` \| `symbol`)[] | - | [helpers/inversify/getDeps.ts:27](https://github.com/unlib-js/depi/blob/main/src/helpers/inversify/getDeps.ts#L27) |

#### Defined in

[helpers/inversify/getDeps.ts:21](https://github.com/unlib-js/depi/blob/main/src/helpers/inversify/getDeps.ts#L21)
