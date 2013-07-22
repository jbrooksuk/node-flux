/**
 * Build a US Date pattern then test w/ match() and do a replace()
 */

var Flux = require('..');

var USDate = new Flux();

var testDate = 'Monday, Jul 22, 2013';
USDate.startOfLine().word().then(', ').letters(3).then(' ').digits(1, 2).then(', ').digits(4).endOfLine();
// console.log(USDate.pattern.join(''));
console.log(USDate.match(testDate) ? "matched" : "unmatched"); // matched
console.log(USDate.replace('$3/$5/$7', testDate)); // Jul/22/2013
