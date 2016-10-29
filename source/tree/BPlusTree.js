'use strict';

var os = require('os');

var MemoryProvider = require('../provider/MemoryProvider');
var InternalNode = require('./InternalNode');
var LeafNode = require('./LeafNode');

var BPlusTree = function (provider) {
    this._provider = provider || new MemoryProvider();
    this._root = new LeafNode(this._provider);
};

BPlusTree.prototype.insert = function (key, value) {
    var split = this._root.insert(key, value);

    if (split) {
        this._root = new InternalNode(this._provider);
        this._root._keys.push(split[0]);
        this._root._values.push(split[1]);
        this._root._values.push(split[2]);
    }
};

BPlusTree.prototype.find = function (left, right) {
    return this._root.find(left, right);
};

BPlusTree.prototype.toString = function (last, intermediate) {
    last = last || [this._root];
    intermediate = intermediate || '';

    var next = [];
    var level = '';

    for (var i = 0; i < last.length; i++) {
        if (level.length > 0) {
            level += ' ';
        }

        level += last[i].toString();
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