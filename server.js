const express = require('express');
const app = new express();

app.use(express.static('public'));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/smile_detect.html');
});

app.listen(8000);