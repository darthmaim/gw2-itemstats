# gw2-itemstats

[![version][npm-badge]][npm]
[![license][license-badge]](LICENSE)
[![Travis][travis-badge]][travis]
[![Coverage][coverage-badge]][coverage]

[npm-badge]: https://img.shields.io/npm/v/gw2-itemstats.svg?style=flat-square
[license-badge]: https://img.shields.io/github/license/darthmaim/gw2-itemstats.svg?style=flat-square
[travis-badge]: https://img.shields.io/travis/darthmaim/gw2-itemstats.svg?style=flat-square
[coverage-badge]: https://img.shields.io/codecov/c/github/darthmaim/gw2-itemstats.svg?style=flat-square
[npm]: https://www.npmjs.com/package/gw2-itemstats
[travis]: https://travis-ci.org/darthmaim/gw2-itemstats
[coverage]: https://codecov.io/github/darthmaim/gw2-itemstats


This module loads itemstats combinations with real attribute values from the API by parsing all available items and matching them to `/v2/itemstats`.


## Installation
Install this module with your favorite package manager, e.g. `npm install gw2-itemstats`.


### Usage
```javascript
import { getItemstats } from 'gw2-itemstats';

const language = 'en';

// get itemstats
const itemstats = getItemstats(language);

// get itemstats for rare level 78 weapons
const itemstatsRare78Weapons = getItemstats(language, {
    filter: (item) => item.rarity === 'Rare' && item.level === 78 && item.type === 'Weapon'
});
```

### Result
Array of itemstats objects following this structure:

```js
{
    id: 161,
    name: 'Berserker\'s',
    attributes: {
        CritDamage: 101,
        Power: 141,
        Precision: 101
    },
    level: 80,
    rarity: 'Ascended',
    type: 'Armor',
    subtype: 'Coat'
}
```

#### Options
| Option | Type | Description
|---|---|---|
| `useCache` | bool | Use the cache to lookup items and itemstats.<br>*Default*: `true`.
| `api` | Object | Object containing the functions `items` and `itemstats`, both returning promises containing all items and itemstats that should be considered for resulting list.<br>*Default*: Uses [gw2api-client](https://github.com/queicherius/gw2api-client) to load all items and itemstats
| `cache` | Map | Object used as cache following the [Map]() interface.<br>*Default*: `new Map()`
| `filter` | function | Callback used to filter the items. The first parameter is the item as it is returned from the API.<br>This is done after caching, to reuse the cache for different filters. Manually applying a filter in the `api`-option can reduce the cache size.<br>*Default*: `(item) => true`


## License
**gw2-itemstats** is licensed under the [MIT License](LICENSE).
