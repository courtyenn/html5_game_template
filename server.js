var express = require('express');
var app = express();

app.use(express.static(process.cwd() + '/public'));


app.disable("view cache");

app.get("/", function(request, response){
	response.sendfile('public/index.html');
});


app.listen(1337);