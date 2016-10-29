'use strict';

var assert = require('assert');

function id(){
    return String(Math.random() * 100000000000000000) + String(Date.now().valueOf())
}

var Page = function (order, leaf) {
    this._id = id();
    this._order = order || 1;
    this._leaf = leaf || false;
    this._keys = [];
    this._values = [];
};

Page.prototype.insert = function (key, value) {
    var prev = null;
    var next = this._keys[0] || null;

    for (var i = 0; i <= (this._keys.length || 1); i++) {
        if (((prev < key || prev === null) && (key <= next || next === null)) || (prev === null && next === null)) {

            // The edge case for leaf node.
            if (this._leaf) {
                this._keys.splice(i, 0, key);
                this._values.splice(i, 0, value);
            }

            // The general case for an internal node.
            else {
                var split = this._values[i].insert(key, value);

                if (split) {
                    this._keys.splice(i, 0, split[0]);
                    assert.equal(this._values[i], split[1]);
                    this._values.splice(i + 1, 0, split[2]);
                }
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

Page.prototype.split = function () {
    if (this._values.length > this._order * 2) {
        var page = new Page(this._order, this._leaf);
        var middle = this._keys[this._order];

        // Sigh leaf nodes.
        if (this._leaf) {
            page._keys = this._keys.slice(this._order);
            this._keys = this._keys.slice(0, this._order);

            page._values = this._values.slice(this._order);
            this._values = this._values.slice(0, this._order);
        }
        else {
            page._keys = this._keys.slice(this._order + 1);
            this._keys = this._keys.slice(0, this._order);

            page._values = this._values.slice(this._order + 1);
            this._values = this._values.slice(0, this._order + 1);
        }

        return [middle, this, page];
    }
};

Page.prototype.find = function (left, right) {
    right = right || left;
    var results = [];

    for (var i = 0; i <= this._keys.length; i++) {

        // The edge case for leaf nodes.
        if (this._leaf && (left <= this._keys[i] && this._keys[i] <= right)) {
            if (this._leaf) {
                results.push(this._values[i]);
            }
        }

        // The general case.
        if (!this._leaf && left <= this._keys[i]) {
            results = results.concat(this._values[i].find(left, right));

            if (this._keys[i + 1] === undefined) {
                results = results.concat(this._values[i + 1].find(left, right));
            }
        }
    }

    // Edge case for the last item in a genral case.
    if (!this._leaf && left > this._keys[this._keys.length - 1]) {
        results = results.concat(this._values[this._values.length - 1].find(left, right));
    }

    return results;
};

module.exports = Page;