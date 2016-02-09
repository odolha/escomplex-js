# escomplex-js

**This is a fork of the original**

It allows sending out ecmaOptions params:
	
	options.ecmaOptions= {
		ecmaVersion: 6, 			// the version preset to use
		sourceType: 'module', 		// module or script
		tolerant: true,				// whether tolerant mode is enabled
		ecmaFeatures: { ... }		// specific list of features to enable/disable
	}
	
	analyse(..., options)

[![Build status][ci-image]][ci-status] [![Dependency status][dep-image]][dep-status] [![devDependency status][devdep-image]][devdep-status]

JavaScript wrapping library
for [escomplex].

[ci-image]: https://secure.travis-ci.org/jared-stilwell/escomplex-js.png?branch=master
[ci-status]: http://travis-ci.org/#!/jared-stilwell/escomplex-js
[escomplex]: https://github.com/jared-stilwell/escomplex
[dep-image]: https://david-dm.org/jared-stilwell/escomplex-js.svg
[dep-status]: https://david-dm.org/jared-stilwell/escomplex-js)
[devdep-image]: https://david-dm.org/jared-stilwell/escomplex-js/dev-status.svg
[devdep-status]: https://david-dm.org/jared-stilwell/escomplex-js#info=devDependencies)
