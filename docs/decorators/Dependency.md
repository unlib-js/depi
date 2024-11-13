[**@unlib-js/depi**](../README.md) • **Docs**

***

[@unlib-js/depi](../README.md) / decorators/Dependency

# decorators/Dependency

## Functions

### default()

> **default**(): (`proto`, `propertyKey`) => `void`

A decorator function that marks a property as a dependency for the class it
is applied to.

The marked property will be added to the `MetaKey.DependsOnProps` metadata
array for the class.

#### Returns

`Function`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `proto` | `object` |
| `propertyKey` | `string` \| `symbol` |

##### Returns

`void`

#### Defined in

[decorators/Dependency.ts:11](https://github.com/unlib-js/depi/blob/main/src/decorators/Dependency.ts#L11)
