/**
 * Fluent Regular Expressions for Node.js
 * Ported from Flux.php by @selvinortiz
 * @version 0.3.0
 * @copyright James Brooks <jbrooksuk@me.com>
 * 			  Selvin Ortiz <http://twitter.com/selvinortiz>
 * @license MIT - http://jbrooksuk.mit-license.org
 */

var util = require('util');

// Creates a new Flux object
function Flux() {
	this.seed      = false;
	this.pattern   = [];
	this.prefixes  = [];
	this.suffixes  = [];
	this.modifiers = [];

	return this;
};

// Returns a string representation of the Flux object.
Flux.prototype.toString = function() {
	return this.compile() + '/' + this.modifiers.join();
};

// Takes the parameters and compiles them into a regular expression
Flux.prototype.compile = function() {
	if(this.seed) return this.seed;

	var pattern   = this.pattern.join(''),
		prefixes  = this.prefixes.join(''),
		suffixes  = this.suffixes.join('');

	return util.format('%s%s%s', prefixes, pattern, suffixes);
};

// Returns the built pattern
Flux.prototype.getPattern = function() {
	return this.compile();
};

// Clears the pattern
Flux.prototype.clear = function() {
	this.seed      = false;
	this.pattern   = [];
	this.prefixes  = [];
	this.suffixes  = [];
	this.modifiers = [];
	return this;
};

// Adds the seed.
// Seeds allow us to use a complete regular expression overwriting the fluently build regex.
Flux.prototype.addSeed = function(seed) {
	this.seed = seed;
	return this;
};

// Removes the seed
Flux.prototype.removeSeed = function() {
	this.seed = false;
	return false;
};

Flux.prototype.getSeed = function() {
	return this.seed;
};

// Returns a segment in the pattern
Flux.prototype.getSegment = function(position) {
	if(position === undefined) position = 1;
	position = (position > 0 ) ? --position : 0;

	if(typeof this.pattern[position] !== 'undefined') {
		return this.pattern[position];
	}

	return false;
};

Flux.prototype.removeSegment = function(position) {
	if(position === undefined) position = 1;

	if(typeof this.pattern[position] !== 'undefined') {
		delete this.pattern[position];
	}
};

Flux.prototype.getSegments = function() {
	return this.pattern;
};

// Adds an item to the pattern
Flux.prototype.add = function(val, format) {
	if(format === undefined) format = '(%s)';
	this.pattern.push(util.format(format, this.sanitize(val)));
	return this;
};

// Adds a raw (must match) item.
Flux.prototype.raw = function(val, format) {
	if(format === undefined) format = '%s';
	this.pattern.push(util.format(format, val));
	return this;
};

// Adds a modifier (g/i/m/s) etc
// Modifiers can only be added once
Flux.prototype.addModifier = function(modifier) {
	if(typeof this.modifiers[modifier] === 'undefined') {
		this.modifiers.push(modifier.trim());
	}
	return this;
};

// Removes a given modifier if it exists
Flux.prototype.removeModifier = function(modifier) {
	if(typeof this.modifiers[modifier] !== 'undefined') {
		delete this.modifiers[modifier];
	}
	return this;
};

// Adds to the prefix list.
// Prefixes are ^ etc
Flux.prototype.addPrefix = function(prefix) {
	if(typeof this.prefixes[prefix] === 'undefined') {
		this.prefixes.push(prefix.trim());
	}
	return this;
};

// Adds a suffix
// $ for end of line
Flux.prototype.addSuffix = function(suffix) {
	if(typeof this.suffixes[suffix] === 'undefined') {
		// this.suffixes = [suffix.trim()].concat(this.suffixes);
		this.suffixes.push(suffix.trim());
	}
	return this;
};

// Helper for the ^ prefix
Flux.prototype.startOfLine = function() {
	return this.addPrefix('^');
};

// Helper for the $ suffix
Flux.prototype.endOfLine = function() {
	return this.addSuffix('$');
};

// Adds a modifier to ignore cases
Flux.prototype.inAnyCase = function() {
	return this.addModifier('i');
};

// Alias to Flux#inAnyCase
Flux.prototype.ignoreCase = function() {
	return this.inAnyCase();
};

// Removes the 'm' modifier if it exists
Flux.prototype.oneLine = function() {
	return this.removeModifier('m');
};

// Adds the 'm' modifier
Flux.prototype.multiLine = function() {
	return this.addModifier('m');
};

// Adds the dot all (.) modifier
Flux.prototype.dotAll = function() {
	return this.addModifier('s');
};

Flux.prototype.matchNewLine = function() {
	return this.addModifier('s');
};

// Adds the 'g' modifier for global searching
Flux.prototype.global = function() {
	return this.addModifier('g');
};

// Alias to Flux#then
Flux.prototype.find = function(val) {
	return this.then(val);
};

// Adds a search parameter
Flux.prototype.then = function(val) {
	return this.add(val);
};

// Optional search parameter
Flux.prototype.maybe = function(val) {
	return this.add(val, '(%s)?');
};

// Takes multiple arguments are creates an OR list.
// Output would be one|two|three etc
Flux.prototype.either = function() {
	var args = Array.prototype.slice.call(arguments);
	if(args.length === 0) return this;
	return this.raw(args.join('|'), '(%s)');
};

// Creates a [%s] search param
Flux.prototype.any = function(val) {
	return this.add(val, '([%s])');
};

// Alias to Flux#any
Flux.prototype.anyOf = function(val) {
	return this.any(val);
};

// Adds a wildcard parameter
Flux.prototype.anything = function() {
	return this.raw('(.*)');
};

// Matches anything but the given arguments
Flux.prototype.anythingBut = function(val) {
	return this.add(val, '([^%s]*)');
};

Flux.prototype.br = function() {
	return this.raw('(\\n|\\r\\n)');
};

Flux.prototype.tab = function() {
	return this.raw('(\\t)');
};

Flux.prototype.lineBreak = function() {
	return this.br();
};

// Matches only words
Flux.prototype.word = function() {
	return this.raw('(\\w+)');
};

// Matches digits
// Optionally you can provide a min and max value to search for
// For example you might have a min of 6 numbers and a max of 7 in which case 123 wouldn't match
// If it can only be 7 digits then just pass .digits(7)
Flux.prototype.digits = function(min, max) {
	if(min && max) {
		return this.raw(util.format('(\\d{%d,%d})', min, max));
	}else if(min && !max) {
		return this.raw(util.format('(\\d{%d})', min));
	}else{
		return this.raw('(\\d+)');
	}
};

// Matches letters
// Optionally you can provide a min and max value to search for
// For example you might have a min of 6 digits and a max of 7 in which case abc wouldn't match
// If it can only be 7 letters then just pass .letters(7)
Flux.prototype.letters = function(min, max) {
	if(min && max) {
		return this.raw(util.format('([a-zA-Z]{%d,%d})', min, max));
	}else if(min && !max) {
		return this.raw(util.format('([a-zA-Z]{%d})', min));
	}else{
		return this.raw('([a-zA-Z]+)');
	}
};

// selvinortiz listed this as experimental.
// This is bound to change
Flux.prototype.orTry = function(val) {
	if(val === undefined) {
		return this.addPrefix('(').addSuffix(')').raw(')|(');
	}

	return this.addPrefix('(').addSuffix(')').raw(val, ')|(%s');
};

// Creates a range character class
// You can create a-z0-9 by calling Flux.range('a', 'z', 0, 9)
Flux.prototype.range = function() {
	var iRow = 0, args = Array.prototype.slice.call(arguments), ranges = [];

	if(args.length === 0) return this;

	for(var segment in args) {
		iRow++;

		if(iRow % 2 === 0) {
			ranges.push(util.format('%s-%s', args[iRow - 1], args[iRow]));
		}
	}

	return this.raw(ranges.join(''), '([%s])');
};

// Performs a test (match) with the generated regular expression
// Returns true/false
Flux.prototype.match = function(subject, seed) {
	if(seed !== undefined) this.addSeed(seed);

	var regex = new RegExp(this.compile(), this.modifiers.join());
	return regex.test(subject);
};

// Replaces the replacement characters passed through using $x format where x is the integer position of the matched segment
Flux.prototype.replace = function(replacement, subject, seed) {
	if(seed !== undefined) this.addSeed(seed);

	var regex = new RegExp(this.compile(), this.modifiers.join());
	return subject.replace(regex, replacement);
};

// Helper method, but public that escapes values passed to it
Flux.prototype.sanitize = function(val) {
	return preg_quote(val, '/');
};

function preg_quote (str, delimiter) {
	// http://kevin.vanzonneveld.net
	// +   original by: booeyOH
	// +   improved by: Ates Goral (http://magnetiq.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Onno Marsman
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// *     example 1: preg_quote("$40");
	// *     returns 1: '\$40'
	// *     example 2: preg_quote("*RRRING* Hello?");
	// *     returns 2: '\*RRRING\* Hello\?'
	// *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
	// *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
	return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

module.exports = Flux;