angular.module('ngForm', []).directive('ngForm', ['$compile', '$http', function($compile, $http) {
  return {
    restrict: 'E',
    scope: {
    	model: '=',
      config: '=',
      title: '@'
    },
    compile: function($element, $attributes) {
      return {
        post: function($scope, $element, $attributes) {
          var config = $scope.config;
          var form = $('<form></form>');
          if (config.horizontal) {
            form.addClass('form-horizontal');
          }

          var renderField = function() {
          	form.empty();
            config.fields.forEach(function(field) {
              var formGroup = $('<div></div>').appendTo(form);
              formGroup.addClass('form-group');

              var label = $('<label class="control-label">' + field.label + '</label>');
              var inputContainer = $('<div></div>');

              if (config.horizontal) {
                inputContainer.addClass('col-sm-' + config.fieldWidth);
                label.addClass('col-sm-' + config.labelWidth);
              }

              var input;

              switch (field.type) {
                case 'string':
                  input = $('<input type="text" ng-model="model.'+field.model+'"></input>');
		              input.addClass('form-control');
                  break;
                case 'number':
                  input = $('<input type="text" ng-model="model.'+field.model+'"></input>');
		              input.addClass('form-control');
                  input.on('keypress', function(event) {
                    var charInput = String.fromCharCode(event.which);
                    console.log(charInput);
                    if (charInput.match(/[^\d\.\,\-\+]/)) {
                      event.stopPropagation();
                      event.preventDefault();
                    }
                  });
                  break;
                case 'select':
                  input = $('<select ng-model="model.'+field.model+'"></select>');
                  input.addClass('form-control');
                  getSelectOptions(field, input);
                  break;
                case 'searchable':
                  input = $('<div></div>');
                  applySearchableBehaviour(field, input);
                  break;
                case 'checkbox':
                  input = $('<input type ="checkbox" ng-model="model.'+field.model+'"></input>');
                  break;
                case 'radio':
                  input = $('<div></div>');
                  getRadioOptions(field, input);
                  break;
                default:
                  input = $('<input type="text" ng-model="model.'+field.model+'"></input>');
                  input.addClass('form-control');

              }

              inputContainer.append($compile(input)($scope));

              formGroup.append(label);
              formGroup.append(inputContainer);
            });
          };

          var getSelectOptions = function(fieldConfig, input) {
            if (!fieldConfig.textAttribute) {
              fieldConfig.textAttribute = 'text';
            }
            if (!fieldConfig.valueAttribute) {
              fieldConfig.valueAttribute = 'value';
            }
            $http.post(fieldConfig.address)
              .success(function(result) {
                result.forEach(function(option) {
                  input.append('<option value="' + option[fieldConfig.valueAttribute] + '">' + option[fieldConfig.textAttribute] + '</option>');
                });
              })
              .error(function(result) {
                console.error(result);
              });
          };

          var getRadioOptions = function(fieldConfig, input) {
          	if (!fieldConfig.textAttribute) {
              fieldConfig.textAttribute = 'text';
            }
            if (!fieldConfig.valueAttribute) {
              fieldConfig.valueAttribute = 'value';
            }

            if(fieldConfig.options){
            	fieldConfig.options.forEach(function(option){
            		input.append(
            			'<label>'+
								    '<input type="radio" ng-model="model.'+fieldConfig.model+'" value="'+option[fieldConfig.valueAttribute]+'"/>'+
								  	option[fieldConfig.textAttribute]+ 
								  '</label><br/>');
            	});
            }

          }; 

          var applySearchableBehaviour = function(fieldConfig, input) {
          	var searchBox = $('<input class="form-control"></input>').appendTo(input); 
						var searchResult = $('<select  ng-model="model.'+fieldConfig.model+'" size="5" class="form-control"></select>').appendTo(input); 

          	searchBox.on('keyup', function(){
          		if(searchBox.val().length>1){
	          		$http.post(fieldConfig.address, {
	          			query:searchBox.val()
	          		})
	              .success(function(result) {
	              	searchResult.empty();
	              	result.forEach(function(option){
										searchResult.append('<option value="' + option[fieldConfig.valueAttribute] + '">' + option[fieldConfig.textAttribute] + '</option>');
	              	});
	              })
	              .error(function(result) {
	                console.error(result);
	              });          			
          		} else {
          				searchResult.empty();
          		}
          	});
          };

          renderField();
          $element.append(form);
        }
      }
    }
  }
}]);