'use strict';

var MemoryProvider = require('./MemoryProvider');
var Promise = require('bluebird');
var assert = require('assert');

describe('The MemoryProvider', function () {
    var provider;

    beforeEach(function () {
        provider = new MemoryProvider();

        return Promise.all([
            provider.write('key1', { id: 'key1', property: 'value1' }),
            provider.write('key2', { id: 'key2', property: 'value2' }),
            provider.write('key3', { id: 'key3', property: 'value3' })
        ]);
    });

    it('can read values', function () {
        return Promise.all([
            provider.read('key1'),
            provider.read('key2'),
            provider.read('key3')
        ])
        .spread(function (value1, value2, value3) {
            assert.deepStrictEqual(value1, { id: 'key1', property: 'value1' });
            assert.deepStrictEqual(value2, { id: 'key2', property: 'value2' });
            assert.deepStrictEqual(value3, { id: 'key3', property: 'value3' });
        });
    });
});