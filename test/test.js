var Flux = require('..'),
	should = require('should');

describe('Flux', function() {
	var regex = new Flux();
	var matchRegex = '^(http)(s)?(\\:\\/\\\/)(www\\.)?([^\\.]*)(.in|.co|.com)$';
	var testSubject = 'http://selvinortiz.com';

	it('should start empty', function(done) {
		regex.pattern.should.be.empty;
		done();
	});

	it('should build a regular expression', function(done) {
		regex.startOfLine().then('http').maybe('s').then('://').maybe('www.').anythingBut('.').either('.in', '.co', '.com').ignoreCase().endOfLine();
		regex.compile().should.equal(matchRegex);
		done();
	});

	it('should match http://selvinortiz.com', function(done) {
		var testMatch = regex.match(testSubject);
		testMatch.should.be.true;
		done();
	});

	it('should replace matches with selvinortiz.com', function(done) {
		var replacer = regex.replace('$5$6', testSubject);

		replacer.should.equal('selvinortiz.com');

		done();
	});

	it('should return a string representation with .toString()', function(done) {
		regex.toString().should.equal(matchRegex + '/i');
		done();
	});

	it('should add a global modifier', function(done) {
		var testGlobal = new Flux();
		testGlobal.global();

		testGlobal.modifiers.should.include('g');

		done();
	});

	it('should be able to be passed a custom regex - seed', function(done) {
		var testSeed = new Flux();
		testSeed.match(testSubject, '/(.*)/');
		testSeed.seed.should.not.equal.false;
		done();
	});
});