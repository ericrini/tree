'use strict';

var assert = require('assert');

function id(){
    return String(Math.random() * 100000000000000000) + String(Date.now().valueOf())
}

var InternalNode = function (provider) {
    this._id = id();
    this._provider = provider;
    this._keys = [];
    this._values = [];
    this._leaf = false;
};

InternalNode.prototype.insert = function (key, value) {
    var prev = null;
    var next = this._keys[0] || null;

    for (var i = 0; i <= (this._keys.length || 1); i++) {
        if (((prev < key || prev === null) && (key <= next || next === null)) || (prev === null && next === null)) {
            var split = this._values[i].insert(key, value);

            if (split) {
                this._keys.splice(i, 0, split[0]);
                assert.equal(this._values[i], split[1]);
                this._values.splice(i + 1, 0, split[2]);
            }

            return this.split();
        }

        prev = this._keys[i];
        next = null;

        if (i + 1 < this._keys.length) {
            next = this._keys[i + 1];
        }
    }
};

InternalNode.prototype.split = function () {
    if (this._values.length > this._provider._order * 2) {
        var node = new InternalNode(this._provider);
        var middle = this._keys[this._provider._order];

        node._keys = this._keys.slice(this._provider._order + 1);
        this._keys = this._keys.slice(0, this._provider._order);

        node._values = this._values.slice(this._provider._order + 1);
        this._values = this._values.slice(0, this._provider._order + 1);

        return [middle, this, node];
    }
};

InternalNode.prototype.find = function (left, right) {
    right = right || left;
    var results = [];

    for (var i = 0; i <= this._keys.length; i++) {

        if (left <= this._keys[i]) {
            results = results.concat(this._values[i].find(left, right));

            if (this._keys[i + 1] === undefined) {
                results = results.concat(this._values[i + 1].find(left, right));
            }
        }
    }

    if (left > this._keys[this._keys.length - 1]) {
        results = results.concat(this._values[this._values.length - 1].find(left, right));
    }

    return results;
};

InternalNode.prototype.toString = function () {
    var data = [];

    for (var j = 0; j < this._values.length; j++) {
        data.push(this._values[j]._id.slice(0, 3) + '*');

        if (j < this._keys.length) {
            data.push(this._keys[j]);
        }
    }

    return '(' + this._id.slice(0, 3) + ')' + JSON.stringify(data);
};

module.exports = InternalNode;