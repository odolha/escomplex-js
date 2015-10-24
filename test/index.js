'use strict';

var assert, mockery, sinon, modulePath;

assert = require('chai').assert;
mockery = require('mockery');
sinon = require('sinon');

modulePath = '../src';

mockery.registerAllowable(modulePath);
mockery.registerAllowable('check-types');

suite('index:', function () {
    var walker, esprimaParse, esComplexAnalyse;
  
    setup(function () {
        walker = {};
        esprimaParse = sinon.stub().returns('esprima.parse result');
        esComplexAnalyse = sinon.stub().returns('escomplex.analyse result');
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('esprima', {
            parse: esprimaParse
        });
        mockery.registerMock('escomplex-ast-moz', walker);
        mockery.registerMock('escomplex', {
            analyse: esComplexAnalyse
        });
    });

    teardown(function () {
        mockery.deregisterMock('esprima');
        mockery.deregisterMock('escomplex-ast-moz');
        mockery.deregisterMock('escomplex');
        mockery.disable();
        walker = undefined;
    });

    test('require does not throw', function () {
        assert.doesNotThrow(function () {
            require(modulePath);
        });
    });

    test('require returns object', function () {
        assert.isObject(require(modulePath));
    });

    suite('require:', function () {
        var index;

        setup(function () {
            index = require(modulePath);
        });

        teardown(function () {
            index = undefined;
        });

        test('analyse function is exported', function () {
            assert.isFunction(index.analyse);
        });

        test('analyse does not throw', function () {
            assert.doesNotThrow(function () {
                index.analyse();
            });
        });

        test('esprima.parse was not called', function () {
            assert.strictEqual(esprimaParse.callCount, 0);
        });

        test('escomplex.analyse was not called', function () {
            assert.strictEqual(esComplexAnalyse.callCount, 0);
        });

        suite('array source:', function () {
            var options, result;

            setup(function () {
                options = {};
                result = index.analyse([ { path: '/foo.js', code: 'console.log("foo");' }, { path: '../bar.js', code: '"bar";' } ], options);
            });

            teardown(function () {
                options = result = undefined;
            });

            test('esprima.parse was called twice', function () {
                assert.strictEqual(esprimaParse.callCount, 2);
            });

            test('esprima.parse was passed two arguments first time', function () {
                assert.lengthOf(esprimaParse.firstCall.args, 2);
            });

            test('esprima.parse was given correct source first time', function () {
                assert.strictEqual(esprimaParse.firstCall.args[0], 'console.log("foo");');
            });

            test('esprima.parse was given correct options first time', function () {
                assert.isObject(esprimaParse.firstCall.args[1]);
                assert.isTrue(esprimaParse.firstCall.args[1].loc);
                assert.lengthOf(Object.keys(esprimaParse.firstCall.args[1]), 1);
            });

            test('esprima.parse was passed two arguments second time', function () {
                assert.lengthOf(esprimaParse.secondCall.args, 2);
            });

            test('esprima.parse was given correct source second time', function () {
                assert.strictEqual(esprimaParse.secondCall.args[0], '"bar";');
            });

            test('esprima.parse was given correct options second time', function () {
                assert.isObject(esprimaParse.secondCall.args[1]);
                assert.isTrue(esprimaParse.secondCall.args[1].loc);
                assert.lengthOf(Object.keys(esprimaParse.secondCall.args[1]), 1);
            });

            test('escomplex.analyse was called once', function () {
                assert.strictEqual(esComplexAnalyse.callCount, 1);
            });

            test('escomplex.analyse was passed three arguments', function () {
                assert.lengthOf(esComplexAnalyse.firstCall.args, 3);
            });

            test('escomplex.analyse was given correct asts', function () {
                assert.isArray(esComplexAnalyse.firstCall.args[0]);
                assert.lengthOf(esComplexAnalyse.firstCall.args[0], 2);

                assert.isObject(esComplexAnalyse.firstCall.args[0][0]);
                assert.strictEqual(esComplexAnalyse.firstCall.args[0][0].path, '/foo.js');
                assert.strictEqual(esComplexAnalyse.firstCall.args[0][0].ast, 'esprima.parse result');
                assert.lengthOf(Object.keys(esComplexAnalyse.firstCall.args[0][0]), 2);

                assert.isObject(esComplexAnalyse.firstCall.args[0][1]);
                assert.strictEqual(esComplexAnalyse.firstCall.args[0][1].path, '../bar.js');
                assert.strictEqual(esComplexAnalyse.firstCall.args[0][1].ast, 'esprima.parse result');
                assert.lengthOf(Object.keys(esComplexAnalyse.firstCall.args[0][1]), 2);
            });

            test('escomplex.analyse was given correct walker', function () {
                assert.strictEqual(esComplexAnalyse.firstCall.args[1], walker);
            });

            test('escomplex.analyse was given correct options', function () {
                assert.strictEqual(esComplexAnalyse.firstCall.args[2], options);
            });

            test('correct result was returned', function () {
                assert.strictEqual(result, 'escomplex.analyse result');
            });
        });

        suite('array source with bad code:', function() {
            var code;

            setup(function () {
                mockery.deregisterMock('esprima');
                mockery.disable();
                code = [ { path: '/foo.js', code: 'foo foo' }, { path: '../bar.js', code: '"bar";' } ];
                index = require(modulePath);
            });

            teardown(function () {
                code = undefined;
            });

            test('throws an error with default options', function() {
                assert.throws(function() {
                    index.analyse(code, {});
                }, '/foo.js: Line 1: Unexpected identifier');
            });

            test('swallows error with options.ignoreErrors', function() {
                assert.doesNotThrow(function() {
                    index.analyse(code, { ignoreErrors: true });
                });
            });
        });

        suite('string source:', function () {
            var options, result;

            setup(function () {
                options = {};
                result = index.analyse('foo bar baz', options);
            });

            teardown(function () {
                options = result = undefined;
            });

            test('esprima.parse was called once', function () {
                assert.strictEqual(esprimaParse.callCount, 1);
            });

            test('esprima.parse was passed two arguments', function () {
                assert.lengthOf(esprimaParse.firstCall.args, 2);
            });

            test('esprima.parse was given correct source', function () {
                assert.strictEqual(esprimaParse.firstCall.args[0], 'foo bar baz');
            });

            test('esprima.parse was given correct options', function () {
                assert.isObject(esprimaParse.firstCall.args[1]);
                assert.isTrue(esprimaParse.firstCall.args[1].loc);
                assert.lengthOf(Object.keys(esprimaParse.firstCall.args[1]), 1);
            });

            test('escomplex.analyse was called once', function () {
                assert.strictEqual(esComplexAnalyse.callCount, 1);
            });

            test('escomplex.analyse was passed three arguments', function () {
                assert.lengthOf(esComplexAnalyse.firstCall.args, 3);
            });

            test('escomplex.analyse was given correct ast', function () {
                assert.strictEqual(esComplexAnalyse.firstCall.args[0], 'esprima.parse result');
            });

            test('escomplex.analyse was given correct walker', function () {
                assert.strictEqual(esComplexAnalyse.firstCall.args[1], walker);
            });

            test('escomplex.analyse was given correct options', function () {
                assert.strictEqual(esComplexAnalyse.firstCall.args[2], options);
            });

            test('correct result was returned', function () {
                assert.strictEqual(result, 'escomplex.analyse result');
            });
        });
    });
});

