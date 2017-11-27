/* eslint-env node, mocha */
import {expect} from 'chai';
import {getItemstats} from '../src';
import ApiClient from 'gw2api-client';

const api = new ApiClient();

function generateMockOptions(items, itemstats) {
    return {
        api: {
            items: () => Promise.resolve(items), 
            itemstats: () => Promise.resolve(itemstats)
        }
    }
}

describe('getItemstats', () => {
    it('should get itemstats', (done) => {
        const options = generateMockOptions(items, itemstats);

        getItemstats('en', options).then(
            (stats) => {
                expect(stats).to.be.an('array').that.has.length(1);
                expect(stats[0]).to.deep.equal({
                    id: 161, name: 'Berserker\'s', attributes: { CritDamage: 101, Power: 141, Precision: 101 },
                    level: 80, rarity: 'Ascended', type: 'Armor', subtype: 'Coat'
                });
            }
        ).then(done, done);
    });
})


const items = [{
    "name": "Zojja's Breastplate",
    "type": "Armor",
    "level": 80,
    "rarity": "Ascended",
    "id": 48073,
    "details": {
        "type": "Coat",
        "infix_upgrade": {
            "id": 161,
            "attributes": [
                {
                    "attribute": "Power",
                    "modifier": 141
                },
                {
                    "attribute": "Precision",
                    "modifier": 101
                },
                {
                    "attribute": "CritDamage",
                    "modifier": 101
                }
            ]
        },
    }
}];

const itemstats = [{
    "id": 161,
    "name": "Berserker's",
    "attributes": {
        "Power": 0.35,
        "Precision": 0.25,
        "CritDamage": 0.25
    }
}];