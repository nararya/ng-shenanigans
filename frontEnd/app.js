var app = angular.module('ngAppDemo', ['ngTable','ngForm']);

var ngTableDemoController = app.controller('ngTableDemoController', ['$scope', function($scope){
	$scope.selectedSample = 'form';	

	$scope.tableConfig = {
		columns: [
			{displayText: 'No',   attributeName: 'no'}, //attributName 'no' is reserved specially for automatic row numbering
			{displayText: 'Word',   attributeName: 'word'},
			{displayText: 'Number', attributeName: 'number'},
			{displayText: 'Date',   attributeName: 'date'},
		],
		address: 'http://localhost:8080/datagrid',
		pageJump: 5,
		sort: ['word asc']
	};

	$scope.formModel = {
		name:'',
		number:0,
		select:0,
		searchable:0
	};

	$scope.formConfig = {
		horizontal: true,
		labelWidth: '4',
		fieldWidth: '8',
		fields: [
			{label: 'Word',   type: 'string', model: 'name'},
			{label: 'Number', type: 'number', model: 'number'},
			{label: 'Select', type: 'select', model: 'select',
				address: 'http://localhost:8080/select', valueAttribute: 'value', textAttribute: 'text'},
			//valueAttribute and textAttribute defaults to "value" and "text"
			{label: 'Searchable', type: 'searchable', model: 'searchable',
				address: 'http://localhost:8080/searchable', valueAttribute: 'number', textAttribute: 'word'},
			//searchable will send a POST request with the payload {query:[input]}, searching a substring
			//valueAttribute and textAttribute behave in the same way as select
			{label: 'Checkbox', type: 'checkbox', model: 'checkbox'},
			{label: 'Radio',    type: 'radio',    model: 'radio',
				valueAttribute: 'value', textAttribute: 'text',
				options: [
					{text: 'Option 1', value: 1},
					{text: 'Option 2', value: 2},
					{text: 'Option 3', value: 3}
				]
			}
		]
	};
}]);