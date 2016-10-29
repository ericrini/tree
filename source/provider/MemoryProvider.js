'use strict';

var Promise = require('bluebird');

var MemoryProvider = function () {
    this._order = 2;
    this._data = {};
};

MemoryProvider.prototype.read = function (key) {
    var _this = this;

    return new Promise(function (resolve) {
        resolve(_this._data[key]);
    });
};

MemoryProvider.prototype.write = function (key, value) {
    var _this = this;

    return new Promise(function (resolve) {
        _this._data[key] = value;
        resolve();
    });
};

module.exports = MemoryProvider;
