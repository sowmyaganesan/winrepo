var converter = require('../routes/converter');
var expect = require('expect.js');

describe('converter.js',function(){
	describe('activityreader',function(){
			it('reads the contents of the file',function(done) {
				converter.activityreader(function(err,filecontent1){
					expect(filecontent1.length).to.be.greaterThan(0);
					
				});
				done();
			});
		});
		
		
}); 
