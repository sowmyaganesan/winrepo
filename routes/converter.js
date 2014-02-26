var fs = require("fs");
var http = require('http');
var request = require("request");
var async = require("async")



exports.currency = function(req, res) {
    
	  exports.currencyreader(function (err,rdata){
			var symbols = [];
		  data = JSON.parse(rdata);
		  for (var prop in data) {
		  
			if (data.hasOwnProperty(prop)) {
				var row = {};
				row['key'] = prop;
				row['symbol'] = data[prop]['symbol'];
				symbols.push(row);
			}
		  }
		  res.jsonp(symbols);
	  });
};

exports.currencyreader = function(callback){
fs.readFile('./files/rate.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
		callback(null,data);
	 });

}

exports.activity = function(req, res) {
     exports.activityreader(function (err,activitydata){
	  res.jsonp(JSON.parse(activitydata)); 
    });
};

exports.activityreader = function(callback){
	var fs1=fs;
	fs1.readFile('./files/Activity.txt', 'utf8', function (err,activitydata) {
      if (err) {
        return console.log(err);
      }
	  debugger;
	  callback(null,activitydata);
	});
}



exports.currencyConversion = function(req,res){

	exports.asyncparallelresult(function (err,results){
	
	if(err == null){
		if(results && Array.isArray(results) && results.length > 1){
			valueTable = JSON.parse(results[1]).rates;
			symbolTable = JSON.parse(results[0]);
			var symbols = {};
			for (var prop in valueTable) {
			if (valueTable.hasOwnProperty(prop)) {
				var row = {}
				row['currency'] = prop;
				row['rate'] = valueTable[prop].toFixed(2);
				if(typeof symbolTable[prop] != 'undefined')
					row['symbol'] = symbolTable[prop].symbol_native
				else
					row['symbol'] = prop
				symbols[prop] = row;
				
			}
			} 
			var net;
			if(typeof symbols =='object'){
				var resultjsonlive = symbols;
				var from = symbols[req.query.from];
				var to = symbols[req.query.to];
				
				var conversionrate = exports.conversionrate(to.rate,from.rate);
			
				var amt = req.query.amt;
				
				if(typeof amt === 'undefined'){
					amt= 1;
					net = (conversionrate * amt).toFixed(2);
				}else{
					net = (conversionrate * amt).toFixed(2);
				}
				console.log(from,to,amt,conversionrate,net);
			}
			var resultjsonfromfile = JSON.parse(results[2]);
			
			if(typeof resultjsonfromfile =='object'){
				var filefrom = resultjsonfromfile[req.query.from];
				var fileto = resultjsonfromfile[req.query.to];
				var isfromchanged= false;
				var istochanged= false;
				
				if (from.rate !== filefrom.rate){
					var temp = resultjsonfromfile[req.query.from];
					temp.rate = from.rate;
					resultjsonfromfile[req.query.from] = temp;
					isfromchanged=true;
				}
				if (to.rate !== to.rate){
					var temp = resultjsonfromfile[req.query.to];
					temp.rate = to.rate;
					resultjsonfromfile[req.query.to] = temp;
					istochanged= true;
				}
				if (isfromchanged || istochanged){
				
					var fs1 = require('fs');
				
					fs1.writeFile('./files/rate.txt', JSON.stringify(resultjsonfromfile), function (err) {
					if (err) 
						throw err;
					else
						console.log("Its saved");
					});
			}
			

		var status={};
		status.net = net;
		res.jsonp(status);
		}
	}
	}
	});
}
	
exports.currencywrite = function(callback,resultjsonfromfile){
		var fs1 = require('fs');
				
		fs1.writeFile('rate.txt', JSON.stringify(resultjsonfromfile), function (err) {
		if (err) 
			callback(err);
		else	
			callback(null,"success");
		  
	  });

}
exports.conversionrate = function (to,from){
	var conversionrate = (to / from).toFixed(2);
	if (conversionrate !== NaN)
		return conversionrate;
	else
		return 0;
}

exports.asyncparallelresult = function(callback){
	async.parallel([
	   function(cb){
		request.get('http://www.localeplanet.com/api/auto/currencymap.json?name=',function(error,response,body){
			cb(error,body)
		});
	  },
	  function(cb){
		request.get('http://openexchangerates.org/api/latest.json?app_id=11c058108ce448238a2c48274ce67f15',function(error,response,body){
			cb(error,body)
		});
	  },
	  fs.readFile.bind(fs,"./files/rate.txt",'utf8')
	], function(error, results){
		if (error){
			callback(err,results);
		}else{
			callback(null,results);
		}
	});

}