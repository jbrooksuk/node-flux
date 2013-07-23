# FLUX (Fluent Regular Expressions)
node-flux is a Node.js port of [Selvin Ortiz' Flux.php](http://github.com/selvinortiz/flux)

Currently node-flux is Node.js compatible as it makes use of the `util` library. I'm looking to change this in the near future to be usable in the browser and on the server.

# Examples
Examples are provided in the `/examples` directory. You can test them with `node examples/usdate.js` or `node examples/usphone.js`

More examples will be added as the syntax evolves or changes.

# Changelog

## 0.2.0
- Added `addSeed`, `removeSeed`
- Seeds can be passed through as final arguments in `match` and `replace`
- Added `toString()` which will compile your pattern with modifiers
- Added new tests
- Added `getSegment`. When passed an integer will return that position in the pattern. Default is `0`.

## 0.1.0
- Changed version to minor version 1 as the syntax is working and passes all examples used by the the [Flux.php](http://github.com/selvinortiz/flux)

## 0.0.4
- Added `global` modifier (g)
- Added new test for `global` modifier

## 0.0.3
- Added examples `usdate.js` and `usphone.js`
- Commented code a little

## 0.0.2
- Adds the `letters` method
- Renamed `numbers` to `digits`
- Adds support for quantifiers in `digits`
- Adds `ignoreCase` as an alias for `inAnyCase`

# License
MIT - [http://jbrooksuk.mit-license.org](http://jbrooksuk.mit-license.org)