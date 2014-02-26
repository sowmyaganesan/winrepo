var converter = require('../routes/converter');
var expect = require('expect.js');
var fc; 
describe('converter.js',function(){
 
	describe('currencyreader',function(){
		it('reads the contents of the file',function(done) {
			converter.currencyreader(function(err,filecontent1){
				fc= filecontent1;
				expect(filecontent1.length).to.be.greaterThan(0);
				done();
			});
			
		});
	});
	describe('asyncparallelresult',function(){
		it('Expect it to be an array',function(done) {
			converter.asyncparallelresult(function(err,result){
				expect(result).to.be.an('array');
				done();
			});
			
		});
		
	}); 
	describe("JSON", function() {
	describe(".parse()", function() {
       it("should detect malformed JSON strings", function(){
          converter.asyncparallelresult(function(err,result){
				expect(result).to.be.an('array');
				done();
			});
       });
		});
	});
	
	describe('activityreader',function(){
			it('reads the contents of the file',function(done) {
				converter.activityreader(function(err,filecontent1){
					expect(filecontent1.length).to.be.greaterThan(0);
					done();
				});
				
			});
		});
		
	describe('conversionrate',function(){
			it('expect a number',function(done) {
				var result = converter.conversionrate(66,10);
				expect(result).to.be.greaterThan(0);
					done();
				});
				
	});
	
	describe('currencywrite',function(){
			it('writes the contents to the file',function(done) {
				converter.currencywrite(function(err,fc){
					expect(fc.length).to.be.greaterThan(0);
					done();
				});
				
			});
		});

});