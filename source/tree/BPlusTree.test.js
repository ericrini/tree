'use strict';

var os = require('os');
var assert = require('assert');
var simple = require('simple-mock');

var BPlusTree = require('./BPlusTree');

describe('The BPlusTree', function () {
    var tree;

    beforeEach(function () {
        var counter = 1;

        simple.mock(Math, 'random').callFn(function() {
            return counter++;
        });

        tree = new BPlusTree();

        tree.insert(3, '3*');
        tree.insert(5, '5*');
        tree.insert(2, '2*');
        tree.insert(10, '10*');
        tree.insert(6, '6*');
        tree.insert(2, '2*');
        tree.insert(5, '5*');
        tree.insert(4, '4*');
        tree.insert(9, '9*');
        tree.insert(10, '10*');
        tree.insert(3, '3*');
        tree.insert(4, '4*');
        tree.insert(9, '9*');
        tree.insert(8, '8*');
        tree.insert(7, '7*');
        tree.insert(8, '8*');
        tree.insert(1, '1*');
        tree.insert(1, '1*');
        tree.insert(6, '6*');
        tree.insert(7, '7*');

        console.log(tree.toString());
    });

    it('can represent itself as a string', function () {
        assert.equal(tree.toString(),
            '(800)["300*",7,"700*"]' + os.EOL +
            '(300)["100*",2,"900*",3,"400*",5,"200*"] (700)["600*",9,"500*"]' + os.EOL +
            '(100)["1*","1*"] (900)["2*","2*","3*"] (400)["3*","4*","4*","5*"] (200)["5*","6*","6*","7*"] (600)["7*","8*","8*","9*"] (500)["9*","10*","10*"]' + os.EOL
        );
    });

    it('can find all values matching a key', function () {
        assert.deepStrictEqual(tree.find(3), ['3*', '3*']);
        assert.deepStrictEqual(tree.find(8), ['8*', '8*']);
        assert.deepStrictEqual(tree.find(0), []);
        assert.deepStrictEqual(tree.find(11), []);
    });

    it('can find values matching a range of keys', function () {
        assert.deepStrictEqual(tree.find(3, 5), ['3*', '3*', '4*', '4*', '5*', '5*']);
        assert.deepStrictEqual(tree.find(6, 7), ['6*', '6*', '7*', '7*']);
        assert.deepStrictEqual(tree.find(0, 1), ['1*', '1*']);
        assert.deepStrictEqual(tree.find(10, 11), ['10*', '10*']);
    });

    afterEach(function () {
        simple.restore();
    });
});