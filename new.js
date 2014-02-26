var hasloaded= false;
var ROW_BASE = 1;
var currencydata="";
var counter=0;
var headcount=0;

$(document).ready(function(){
			hasLoaded = true;
			$("#currency").hide();
			$("#exchangerate").hide();
			$("#transaction").show();
			
			$.ajax({ 
			   type: "GET",
			   dataType: "jsonp",
			   url: "http://localhost:8085/paypal/currency?callback=?",
			   success: function(data){     
				currencydata= data;
			   },error: function(xhr,error){
				console.debug(error);
			   }
			});
			
			$("#config").click(function(e) { 
			console.log('onclick config');
			cleartable('configtable');
			var cellcount=0;
			
			
				if (currencydata !== 'undefined'){
				var tbl = document.getElementById('configtable');
				
				var row = tbl.tBodies[0].insertRow(0);
					for (var prop in currencydata) {
					
						if (headcount === 0){
							var header = tbl.createTHead();

							var row = header.insertRow(0);    

							var cell = row.insertCell(0);
							
							cell = row.insertCell(1);
							cell.innerHTML = "<input type=\"button\" value=\"Save\" id=\"csub\">";
							headcount++;
							
						}
						if (currencydata.hasOwnProperty(prop)) {
						
						if (cellcount % 15 === 0){
							var nextRow = tbl.tBodies[0].rows.length;
							var iteration = nextRow + ROW_BASE;
							
							row = tbl.tBodies[0].insertRow(nextRow);
							cellcount=0;
						}
							var cell1 = row.insertCell(cellcount++);
							var checkbox = document.createElement('input');
							checkbox.type = "checkbox";
							checkbox.name = currencydata[prop].key;
							checkbox.value = currencydata[prop].key;
							checkbox.id = currencydata[prop].key;
							var label = document.createElement('label')
							label.htmlFor = currencydata[prop].key;
							label.appendChild(document.createTextNode(currencydata[prop].key));
							cell1.appendChild(checkbox);
                            cell1.appendChild(label);
						
						}
					}
				}
				$('#transaction').hide();
				$("#currency").hide();
				$("#exchangerate").hide();
			});
			handleselector('#mySelect1');
			handleselector('#mySelect');
			handleselector('#eSelect1');
			handleselector('#eSelect');
			
			$('#trans').click(function(e) { 
				$.ajax({ 
				   type: "GET",
				   dataType: "jsonp",
				   url: "http://localhost:8085/paypal/activity?callback=?",
				   success: function(data){  
					cleartable('activity');			   
					for (var i=0;i<data.length;i++){
						addRowToTable("activity",data[i].Date,data[i].Transaction,data[i].rate);
						}
				   },error: function(xhr,error){
					console.debug(error);
				   }
				});
				$("#transaction").show();
				$("#currency").hide();
				$("#exchangerate").hide();
				$('#configuration').hide();
			});
			$('#convert').click(function(e) {  
				$('#transaction').hide();
				$("#currency").show();
				$("#exchangerate").hide();
				$('#configuration').hide();
			});
			$('#exchange').click(function(e) {  
				$('#transaction').hide();
				$("#currency").hide();
				$("#exchangerate").show();
				$('#configuration').hide();
			});
			$('#config').click(function(e) {  
				$('#transaction').hide();
				$("#currency").hide();
				$("#exchangerate").hide();
				$('#configuration').show();
			});
			$('#sub').click(function(e) {  
				var amt= document.getElementById('amt').value;
				var from= $("#mySelect").val();
				var to= $("#mySelect1").val();
				if (amt !== '' && from !== null && to !== null && !isNaN(amt)){
				senddata= {"amt":amt,"from":from,"to":to};
					
					$.ajax({
					type: "POST",
					dataType: "jsonp",
					url: "http://localhost:8085/paypal/currencyConversion",
					// The key needs to match your method's input parameter (case-sensitive).
					data: senddata,
					contentType: "application/json; charset=utf-8",
				   
					success: function(data){alert(data.net);},
					failure: function(errMsg) {
						alert(errMsg);
					}
				});
				}else{
					alert('Invalid data');
				}
			});
			
			$('#esub').click(function(e) {  
				
				var from= $("#eSelect").val();
				var to= $("#eSelect1").val();
				if (from !== null && to !== null){
				senddata= {"from":from,"to":to};
					
					$.ajax({
					type: "POST",
					dataType: "jsonp",
					url: "http://localhost:8085/paypal/currencyConversion",
					// The key needs to match your method's input parameter (case-sensitive).
					data: senddata,
					contentType: "application/json; charset=utf-8",
				   
					success: function(data){alert(data.net);},
					failure: function(errMsg) {
						alert(errMsg);
					}
				});
				}else{
					alert('Invalid data');
				}
			});
			
			$('#csub').click(function(e) {  
				console.log('onclick csub');
				allVals = [];
				$('#configtable :checked').each(function() {
				   allVals.push($(this).val());
				 });
			});
		});

function handleselector(id){
	$(id).click(function(e) { 
				$.each(currencydata, function(val, text) {
					$(id).append(new Option(text.key + ' ' +text.symbol,text.key));
				});
		});
}
function cleartable(id){
			
           for(var i=0; i<document.getElementById(id).tBodies[0].rows.length; i++) {
		   
           	document.getElementById(id).tBodies[0].deleteRow(i);
           	document.getElementById(id).tBodies[0].rows.length--;
           	i--;
           }
           
           if (document.getElementById(id).tBodies[0].rows.length === 0)
           	return true;
           else
           	return false;
}
function addRowToTable(tbname,Date,Transaction,rate,num)
{
		if (hasLoaded) {
			var tbl = document.getElementById(tbname);
			
			if (counter === 0){
				var header = tbl.createTHead();

				var row = header.insertRow(0);    

				var cell = row.insertCell(0);
				cell.innerHTML = "<b>#</b>";
				
				cell = row.insertCell(1);
				cell.innerHTML = "<b>Date</b>";
				
				cell = row.insertCell(1);
				cell.innerHTML = "<b>Transaction</b>";
				
				cell = row.insertCell(1);
				cell.innerHTML = "<b>Amount</b>";
				counter++;
			}
			var nextRow = tbl.tBodies[0].rows.length;
			var iteration = nextRow + ROW_BASE;
			if (num == null) { 
			num = nextRow;
			} else {
			iteration = num + ROW_BASE;
			}
			// add the row
			var row = tbl.tBodies[0].insertRow(num);
			row.className = 'classy' + (iteration % 2);
			
			var cell0 = row.insertCell(0);
			var textNode = document.createTextNode(iteration);
			cell0.appendChild(textNode);
			
			var cell1 = row.insertCell(1);
			var textNode1 = document.createTextNode(Date);
			cell1.appendChild(textNode1);
			
			var cell2 = row.insertCell(2);
			var textNode2 = document.createTextNode(Transaction);
			cell2.appendChild(textNode2);
			
			var cell3 = row.insertCell(3);
			var textNode3 = document.createTextNode(rate);
			cell3.appendChild(textNode3);
			
			
		}
}