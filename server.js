const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendFile(__dirname + '/smile_detect.html');
});

app.get('/color_detect.html', function(request, response){
    response.sendFile(__dirname + '/color_detect.html');
});

app.get('/smile_detect.html', function(request, response){
    response.sendFile(__dirname + '/smile_detect.html');
});

app.get('/AI.js', function(request, response){
    response.sendFile(__dirname + '/AI.js');
});

app.get('/file.js', function(request, response){
    response.sendFile(__dirname + '/file.js');
});

app.get('/ai.ai', function(request, response){
    response.sendFile(__dirname + '/ai.ai');
});

app.listen(8000);