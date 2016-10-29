'use strict';

var MemoryProvider = function () {
    this._data = {};
};

MemoryProvider.prototype.read = function (keys) {
    keys = [].concat(keys);
    var data = [];

    for (var i = 0; i < keys.length; i++) {
        data.push(Object.assign({}, this._data[i]));
    }

    return data;
};

MemoryProvider.prototype.write = function (keys, values) {
    keys = [].concat(keys);
    values = [].concat(values);

    for (var i = 0; i < keys.length; i++) {
        this._data[keys[i]] = values[i];
    }
};

MemoryProvider.prototype.expire = function (keys) {
    keys = [].concat(keys);

    for (var i = 0; i < keys.length; i++) {
        delete this._data[keys[i]];
    }
};