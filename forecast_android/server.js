var express = require('express');
// var http = require('http');
var request = require('request');
var port = 8081;
var cors = require('cors');

var app = express();
app.use(cors());

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
});

//app.listen(80, function () {
//  console.log('CORS-enabled web server listening on port 80')
// });

app.use(express.static('dist/forecast'));

app.get('/googleLocation', function(req, res){
    var baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='
    var key = '&key=***';
    var address = req.query.address;
    var url = baseUrl + address + key;
    console.log('geocode URL', url);
    
    request(url, function (error, response, body) {
        console.log('googleCode statusCode:', response && response.statusCode);
        res.send(body);
    });

});

app.get('/darkLocation', function(req, res){
    var baseUrl = 'https://api.darksky.net/forecast/'
    var key = '***/';
    var location = req.query.location;
    var url = baseUrl + key + location;
    console.log('darksky URL', url);
    request(url, function (error, response, body) {
        console.log('dark statusCode:', response && response.statusCode);
        res.send(body);
    });

});

app.get('/customLocation', function(req, res) {
    // console.warn("received custom location call request");
    // var baseUrl1 = 'https://www.googleapis.com/customsearch/v1?q=state-seal%20';
    // var baseUrl1 = 'https://www.googleapis.com/customsearch/v1?q=seals%20';
    var baseUrl1 = 'https://www.googleapis.com/customsearch/v1?q=seal%20of%20';
    var baseUrl2 = '&imgSize=large&imgType=news&num=1&searchType=image';
    var searchEngineId = '&cx=***';
    var key = '&key=***';
    var state = req.query.state;
    var url = baseUrl1 + state + searchEngineId + baseUrl2 + key;
    console.log('custom url', url);
    request(url, function(error, response, body) {
        console.log('customSearch statusCode', response && response.statusCode);
        res.send(body);
    });
});

app.get('/darkDailyLocation', function(req, res) {
    console.warn('received the daily weather call request');
    const baseurl1 = 'https://api.darksky.net/forecast/';
    const key = '***/';
    var address = req.query.address;
    var url = baseurl1 + key + address;
    console.log('darkDaily url in server', url);
    request(url, function (error, response, body) {
        console.log('darkdaily stsatusCode:', response && response.statusCode);
        res.send(body);
    });
});

app.get('/cityLocation', function (req, res) {
    const baseurl1 = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&language=en';
    const key = '&key=***';
    const baseurl2 = '&input=';
    var city = req.query.city;
    var url = baseurl1 + key + baseurl2 +city;
    
    request(url, function (error, response, body){
        console.log('auto complete stsatusCode:', response && response.statusCode);
        res.send(body);
    });
  });

app.get('/customLocationApp', function(req, res) {
    var baseUrl1 = 'https://www.googleapis.com/customsearch/v1?q=';
    var baseUrl2 = '&imgSize=large&imgType=news&num=8&searchType=image';
    var searchEngineId = '&cx=***';
    var key = '&key=***';
    var city = req.query.city;
    var url = baseUrl1 + city + searchEngineId + baseUrl2 + key;
    console.log('custom url', url);
    request(url, function(error, response, body) {
        console.log('customSearch statusCode', response && response.statusCode);
        res.send(body);
    });
});  


app.listen(port, () => console.log(`Listening on port ${port}`));