'use strict';

var assert = require('assert');

function id(){
    return String(Math.random() * 100000000000000000) + String(Date.now().valueOf())
}

var LeafNode = function (provider) {
    this._id = id();
    this._provider = provider;
    this._keys = [];
    this._values = [];
    this._leaf = true;
};

LeafNode.prototype.insert = function (key, value) {
    var prev = null;
    var next = this._keys[0] || null;

    for (var i = 0; i <= (this._keys.length || 1); i++) {
        if (((prev < key || prev === null) && (key <= next || next === null)) || (prev === null && next === null)) {
            this._keys.splice(i, 0, key);
            this._values.splice(i, 0, value);
            return this.split();
        }

        prev = this._keys[i];
        next = null;

        if (i + 1 < this._keys.length) {
            next = this._keys[i + 1];
        }
    }
};

LeafNode.prototype.split = function () {
    if (this._values.length > this._provider._order * 2) {
        var leaf = new LeafNode(this._provider);
        var middle = this._keys[this._provider._order];

        leaf._keys = this._keys.slice(this._provider._order);
        this._keys = this._keys.slice(0, this._provider._order);

        leaf._values = this._values.slice(this._provider._order);
        this._values = this._values.slice(0, this._provider._order);

        return [middle, this, leaf];
    }
};

LeafNode.prototype.find = function (left, right) {
    right = right || left;
    var results = [];

    for (var i = 0; i <= this._keys.length; i++) {
        if (left <= this._keys[i] && this._keys[i] <= right) {
            results.push(this._values[i]);
        }
    }

    return results;
};

LeafNode.prototype.toString = function () {
    return '(' + this._id.slice(0, 3) + ')' + JSON.stringify(this._values);
};

module.exports = LeafNode;