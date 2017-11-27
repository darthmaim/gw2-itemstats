import Gw2ApiClient from 'gw2api-client';
import keyBy from 'lodash/keyBy';

const CACHE_ITEMS = 'gw2-itemstats/items';
const CACHE_ITEMSTATS = 'gw2-itemstats/itemstats';

const api = new Gw2ApiClient();

export const defaultOptions = {
    cache: new Map(),
    filter: (item) => true,
    api: {
        items: (lang) => api.language(lang).items().all(),
        stats: (lang) => api.language(lang).itemstats().all()
    },
    useCache: true
};

export function getItemstats(language, options) {
    const opts = { ...defaultOptions, ...options };

    return Promise.all([
        loadItems(language, opts),
        loadItemstats(language, opts).then((itemstats) => keyBy(itemstats, 'id'))    
    ]).then(
        ([items, itemstats]) => {
            const stats = new Map();
            items.filter(filterItems).filter(opts.filter).forEach(
                (item) => {
                    const {type, level, rarity} = item;
                    const subtype = itemSubtype(item);
                    const upgrade = item.details.infix_upgrade;
        
                    const key = `${type}-${level}-${rarity}-${subtype}-${upgrade.id}`;
                    
                    if(stats.has(key)) {
                        return;
                    }
        
                    stats.set(key, {
                        ...itemstats[upgrade.id],
                        attributes: upgrade.attributes.reduce(
                            (attributes, {attribute, modifier}) => ({ ...attributes, [attribute]: modifier }),
                            {}
                        ),
                        type, level, rarity, subtype
                    });
                }
            );
        
            return Array.from(stats.values());
        }
    );
}

/**
 * Loads all items from cache or API.
 * 
 * @param {string} language 
 * @param {Object} options
 * @param {bool}   options.useCache
 * @param {Map}    options.cache
 * @param {Object} options.api
 */
function loadItems(language, {useCache, cache, api}) {
    // Check the cache for all items
    if(useCache && cache.has(CACHE_ITEMS)) {
        return Promise.resolve(cache.get(CACHE_ITEMS));
    }
    
    // Load items
    return api.items(language).then(
        (items) => {
            // Add items to cache
            cache.set(CACHE_ITEMS, items);
            
            // Return all items
            return items;
        }
    );
}

/**
 * Loads all itemstats from cache or API.
 * 
 * @param {string} language 
 * @param {Object} options
 * @param {bool}   options.useCache
 * @param {Map}    options.cache
 * @param {Object} options.api
 */
async function loadItemstats(language, {useCache, cache, api}) {
    const cacheKey = `${CACHE_ITEMSTATS}:${language}`

    // Check the cache for all itemstats
    if(useCache && cache.has(cacheKey)) {
        return Promise.resolve(cache.get(cacheKey));
    }
    
    // Load itemstats
    return api.itemstats(language).then(
        (itemstats) => {
            // Add itemstats to cache
            cache.set(cacheKey, itemstats);
            
            // Return all itemstats
            return itemstats;
        }
    );
}

function filterItems(item) {
    const canHaveItemstats = ['Weapon', 'Armor', 'Back', 'Trinket'].indexOf(item.type) !== -1;
    const hasItemStats = item.details.infix_upgrade && item.details.infix_upgrade.id && item.details.infix_upgrade.attributes.length > 0;

    return canHaveItemstats && hasItemStats;
}

function itemSubtype(item) {
    if(item.type === 'Weapon') {
        return isWeapon1Handed(item.details.type) ? '1Handed' : '2Handed';
    }

    return item.details.type;
}

function isWeapon1Handed(type) {
    return ['Axe', 'Dagger', 'Mace', 'Pistol', 'Sword', 'Scepter', 'Focus', 'Shield', 'Torch', 'Warhorn'].indexOf(type) !== -1
}