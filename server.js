const express = require('express');
const fs = require('fs');
const app = new express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.use(express.static('public'));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/smile_detect.html');
});

app.post('/save', function(request, response) {
    fs.writeFile(request.body.name, request.body.text, function() {console.log("file saved")});
    request.connection.setTimeout(1000);
});

app.listen(8000);