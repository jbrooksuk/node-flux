# FLUX (Fluent Regular Expressions)
node-flux is a Node.js port of [Selvin Ortiz' Flux.php](http://github.com/selvinortiz/flux)

Currently node-flux is Node.js compatible as it makes use of the `util` library. I'm looking to change this in the near future to be usable in the browser and on the server.

# Examples
Examples are provided in the `/examples` directory. You can test them with `node examples/usdate.js` or `node examples/usphone.js`

More examples will be added as the syntax evolves or changes.

# Changelog

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