/**
 * Build a US Phone Number pattern tehn test with match() and perform a replace().
 */

var Flux = require('..');

var USPhone = new Flux();

var testPhone = '(612) 424-0013';
USPhone.startOfLine().find('(').digits(3).then(')').maybe(' ').digits(3).anyOf(' -').digits(4).endOfLine();
console.log(USPhone.match(testPhone) ? "matched" : "unmatched"); // matched
console.log(USPhone.replace('$2.$5.$7', testPhone)); // Jul/22/2013