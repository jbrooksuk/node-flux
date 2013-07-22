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
		regex.startOfLine().then('http').maybe('s').then('://').maybe('www.').anythingBut('.').either('.in', '.co', '.com').inAnyCase().endOfLine();
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
});