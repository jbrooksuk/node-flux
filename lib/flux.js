var util = require('util');

function Flux() {
	this.pattern   = [];
	this.prefixes  = [];
	this.suffixes  = [];
	this.modifiers = [];

	return this;
}

Flux.prototype.compile = function() {
	var pattern   = this.pattern.join(''),
		prefixes  = this.prefixes.join(''),
		suffixes  = this.suffixes.join('');
		// modifiers = this.modifiers.join('');

	return util.format('%s%s%s', prefixes, pattern, suffixes);
};

Flux.prototype.add = function(val) {
	this.pattern.push(val);
	return this;
};

Flux.prototype.raw = function(val) {
	return this.add(util.format('(%s)', val));
};

Flux.prototype.addModifier = function(modifier) {
	if(typeof this.modifiers[modifier] === 'undefined') {
		this.modifiers.push(modifier.trim());
	}
	return this;
};

Flux.prototype.removeModifier = function(modifier) {
	if(typeof this.modifiers[modifier] !== 'undefined') {
		delete this.modifiers[modifier];
	}
	return this;
};

Flux.prototype.addPrefix = function(prefix) {
	if(typeof this.prefixes[prefix] === 'undefined') {
		this.prefixes.push(prefix.trim());
	}
	return this;
};

Flux.prototype.addSuffix = function(suffix) {
	if(typeof this.suffixes[suffix] === 'undefined') {
		this.suffixes = [suffix.trim()].concat(this.suffixes);
	}
	return this;
};

Flux.prototype.startOfLine = function() {
	return this.addPrefix('^');
};

Flux.prototype.endOfLine = function() {
	return this.addSuffix('$');
};

Flux.prototype.inAnyCase = function() {
	return this.addModifier('i');
};

Flux.prototype.ignoreCase = function() {
	return this.inAnyCase();
};

Flux.prototype.searchOneLine = function() {
	return this.removeModifier('m');
};

Flux.prototype.multiLine = function() {
	return this.addModifier('m');
};

Flux.prototype.dotAll = function() {
	return this.addModifier('s');
};

Flux.prototype.find = function(val) {
	return this.then(val);
};

Flux.prototype.then = function(val) {
	return this.add(util.format('(%s)', this.sanitize(val)));
};

Flux.prototype.maybe = function(val) {
	return this.add(util.format('(%s)?', this.sanitize(val)));
};

Flux.prototype.either = function() {
	var args = Array.prototype.slice.call(arguments);
	if(args.length === 0) return this;
	return this.raw(args.join('|'));
};

Flux.prototype.any = function(val) {
	return this.add(util.format('([%s])', this.sanitize(val)));
};

Flux.prototype.anyOf = function(val) {
	return this.any(val);
};

Flux.prototype.anything = function() {
	return this.add('(.*)');
};

Flux.prototype.anythingBut = function(val) {
	return this.add(util.format('([^%s]*)', this.sanitize(val)));
};

Flux.prototype.word = function() {
	return this.add('(\\w+)');
};

Flux.prototype.digits = function(min, max) {
	if(min && max) {
		return this.add(util.format('(\\d{%d,%d})', min, max));
	}else if(min && !max) {
		return this.add(util.format('(\\d{%d})', min));
	}else{
		return this.add('(\\d+)');
	}
};

Flux.prototype.letters = function(min, max) {
	if(min && max) {
		return this.add(util.format('([a-zA-Z]{%d,%d})', min, max));
	}else if(min && !max) {
		return this.add(util.format('([a-zA-Z]{%d})', min));
	}else{
		return this.add('([a-zA-Z]+)');
	}
};

Flux.prototype.orTry = function(val) {
	return this.addPrefix('(').addSuffix(')').add(util.format(')|(%s', val));
};

Flux.prototype.range = function() {
	var iRow = 0, args = Array.prototype.slice.call(arguments), ranges = [], tmp;

	if(args.length === 0) return this;

	for(var segment in args) {
		iRow++;

		if(iRow % 2 === 0) {
			tmp = util.format('%s-%s', args[iRow - 1], args[iRow]);
			ranges.push(tmp);
		}
	}

	return this.add(util.format('([%s])', ranges.join('|')));
};

Flux.prototype.match = function(subject) {
	var regex = new RegExp(this.compile(), this.modifiers.join());
	return regex.test(subject);
};

Flux.prototype.replace = function(replacement, subject) {
	var regex = new RegExp(this.compile(), this.modifiers.join());
	return subject.replace(regex, replacement);
};

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