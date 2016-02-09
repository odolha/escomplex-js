/*globals require, exports */

'use strict';

var check, esprima, walker, escomplex;

check = require('check-types');
esprima = require('esprima');
walker = require('escomplex-ast-moz');
escomplex = require('escomplex');

exports.analyse = analyse;

function analyse (source, options) {
  if (check.array(source)) {
    return analyseSources(source, options);
  }

  return analyseSource(source, options);
}

function analyseSources (sources, options) {
  return performAnalysis(
    sources.map(
      mapSource.bind(null, options)
    ).filter(filterSource),
    options
  );
}

function mapSource (options, source) {
  try {
    return {
      path: source.path,
      ast: getSyntaxTree(source.code, options.ecmaOptions)
    };
  } catch (error) {
    if (options.ignoreErrors) {
      return null;
    }

    error.message = source.path + ': ' + error.message;
    throw error;
  }
}

function filterSource(source) {
  return !!source;
}

function getSyntaxTree(source, ecmaOptions) {
  return esprima.parse(source, { loc: true, ecmaVersion: ecmaOptions.ecmaVersion, sourceType: ecmaOptions.sourceType, tolerant: ecmaOptions.tolerant, ecmaFeatures: ecmaOptions.ecmaFeatures });
}

function performAnalysis (ast, options) {
  return escomplex.analyse(ast, walker, options);
}

function analyseSource (source, options) {
  return performAnalysis(getSyntaxTree(source, options.ecmaOptions), options);
}
