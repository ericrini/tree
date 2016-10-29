'use strict';

var os = require('os');

var Page = require('./Page');

var BPlusTree = function (order) {
    this._order = order || 1;
    this._root = new Page(this._order, true);
};

BPlusTree.prototype.insert = function (key, value) {
    var split = this._root.insert(key, value);

    if (split) {
        this._root = new Page(this._order, false);
        this._root._keys.push(split[0]);
        this._root._values.push(split[1]);
        this._root._values.push(split[2]);
    }
};

BPlusTree.prototype.find = function (left, right) {
    return this._root.find(left, right);
};

BPlusTree.prototype.toString = function (last, intermediate) {
    if (!last) {
        return this.toString([this._root], '');
    }

    var next = [];
    var level = '';

    for (var i = 0; i < last.length; i++) {
        if (level.length > 0) {
            level += ' ';
        }

        if (last[i]._leaf) {
            level += '(' + last[i]._id.slice(0, 3) + ')' + JSON.stringify(last[i]._values);
        }
        else {
            var data = [];

            for (var j = 0; j < last[i]._values.length; j++) {
                data.push(last[i]._values[j]._id.slice(0, 3) + '*');

                if (j < last[i]._keys.length) {
                    data.push(last[i]._keys[j]);
                }
            }

            level += '(' + last[i]._id.slice(0, 3) + ')' + JSON.stringify(data);
        }

        next = next.concat(last[i]._values);
    }

    if (intermediate.length > 0) {
        intermediate += os.EOL;
    }

    intermediate += level;

    if (!last[0]._leaf) {
        return this.toString(next, intermediate);
    }

    return intermediate + os.EOL;
};

module.exports = BPlusTree;