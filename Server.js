var express = require('express');
var app = express();
app.use(express.json());       
app.use(express.urlencoded());
var converter = require('./routes/converter');

app.get('/paypal/currency', converter.currency);
app.get('/paypal/activity', converter.activity);
app.get("/paypal/currencyConversion",converter.currencyConversion);

app.listen(3000);
console.log('Listening on port 3000...');
