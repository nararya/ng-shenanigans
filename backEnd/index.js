var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();

var corsFilter = app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var payloadParser = app.use(bodyParser.json());

var dummyData = [];

var generateDummyData = function(){
	for(var index = 0; index < 1000; index++){
		dummyData.push({
			//no: index + 1,
			number: 1/Math.random(),
			word: (Math.random()).toString(36).replace(/[\d\.]/g,''),
			date: new Date((new Date()-Math.pow(Math.random()*1000,4)))
		});

	}
};

generateDummyData();

var dataGrid = app.post('/datagrid', function(request,response){
	var params = request.body;
	var startIndex = params.pageSize * (params.page-1);
	var endIndex   = params.pageSize * params.page;
	var sort = params.sort;

	if(sort){
		console.log(sort);
		if(sort.forEach){
			sort = sort.reverse();
			sort.forEach(function(sortColumn){
				sortColumn = sortColumn.split(' ');
				dummyData.sort(function(a,b){
						if (a[sortColumn[0]] > b[sortColumn[0]]) {
							return sortColumn[1]=='desc'?-1:1;
						} else {
							return sortColumn[1]=='desc'?1:-1;
						}
					});
			});
		}
	}
	
	params.totalPage = Math.floor(dummyData.length/params.pageSize); 
	params.rows = dummyData.slice(startIndex,endIndex);

	response.send(params);
});

var searchable = app.post('/searchable', function(request,response){
	var params = request.body;
	var query = params.query.toLowerCase();
	var result = dummyData.filter(function(element){
		return element.word.indexOf(query) > -1;
	});

	response.send(result);
});

var select = app.post('/select', function(request,response){
	var select = [];
	for(var index = 0; index < 10; index++){
		select.push({
			value: 1/Math.random(),
			text: (Math.random()).toString(36).replace(/[\d\.]/g,''),
		});
	}
	response.send(select);
});

app.listen(8080);