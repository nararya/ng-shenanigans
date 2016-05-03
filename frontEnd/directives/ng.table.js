/*Config form

{
	columns: [
		{displayText: '', attributeName: }
	],
	address: ''
}

*/
angular.module('ngTable', []).directive('ngTable', ['$compile', '$http', function($compile, $http) {
  return {
    restrict: 'E',
    scope: {
      config: '=',
      title: '@'
    },
    compile: function($element, $attributes) {

      return {
        post: function($scope, $element, $attributes) {

          var config = $scope.config;

          if (config) {
            if (!config.pageSize) {
              config.pageSize = 20;
            }
            if (!config.page) {
              config.page = 1;
            }
            if (!config.pageJump) {
              config.page = 5;
            }
          } else {
            console.log('No config is set!')
          }

          var table = $('<table class="table"></table>').appendTo($element);
					
					var renderTable = function() {
            if (!$scope.config) {
              console.log('No table config specified!');
            } else if (!$scope.config.columns) {
              console.log('No table columns specified!');
            } else {
              renderHead();
              renderBody();
            }
          };

          var renderHead = function() {
            var thead = $('<thead></thead>');
            var theadTr = $('<tr></tr>').appendTo(thead);
            config.columns.forEach(function(column) {
              var theadTd = $('<td>' + column.displayText + '</td>').appendTo(theadTr);
              if(!column.attributeName.match(/^(no|actions)$/)){

	              var sortAsc = $('<a href="#/">▲</a>').appendTo(theadTd);
	              var sortDesc = $('<a href="#/">▼</a>').appendTo(theadTd);    

	              sortAsc.on('click',function(){
	              	config.sort = config.sort.filter(function(element){
	              		return element.indexOf(column.attributeName) == -1;
	              	});
	              	config.sort.unshift(column.attributeName + ' asc');
	              	config.page = 1;
									renderBody();
	              });

	              sortDesc.on('click',function(){
	              	config.sort = config.sort.filter(function(element){
	              		return element.indexOf(column.attributeName) == -1;
	              	});
	              	config.sort.unshift(column.attributeName + ' desc');
	              	config.page = 1;
	              	renderBody();
	              });

              }
            });

            table.append(thead);
          }

          var renderBody = function(pageData) {
          	if(!pageData){
	          	
	          	var payLoad = {
                page: $scope.config.page,
                pageSize: $scope.config.pageSize,
              };

              if(config.sort){
              	payLoad.sort = config.sort;
              }

	          	if ($scope.config.address) {
	              $http.post($scope.config.address, payLoad)
	                .success(function(result) {
	                  config.totalPage = result.totalPage;
	                  renderBody(result);
	                })
	                .error(function(result) {
	                	console.error(result);
	                });
	            } else {
	              console.log('No dataAddress or data!');
	            }          		

          	} else {

	            var tbody = $('<tbody></tbody>');

	            var startIndex = config.pageSize * (config.page - 1);
	            var endIndex = config.pageSize * config.page;
	          
	            pageData.rows.forEach(function(row, rowIndex) {
	              var tbodyTr = $('<tr></tr>').appendTo(tbody);
	              config.columns.forEach(function(column) {
	                var fieldValue = '-';
	                switch (column.attributeName){
	                	case 'no': 
	                		fieldValue = rowIndex + 1 + (config.pageSize*(config.page-1));
	                		break;
	                	default:
	                		fieldValue = row[column.attributeName];
	                }
	                tbodyTr.append('<td>' + fieldValue + '</td>');
	              });
	            });

							var actualTbody = $element.find('tbody');

							if(actualTbody.length==0){
	            	table.append(tbody);
	          	} else {
								actualTbody.replaceWith(tbody);
	          	}

		          renderPaging(pageData);          		
          	
          	}

          };

          var renderPaging = function() {

          	var lowerBound = Math.max(+config.page-config.pageJump,1);
          	var upperBound = Math.min(+config.page+config.pageJump,config.totalPage);

 						console.log(lowerBound,upperBound);
 

          	var paging = $('<div class="paging"></div>');

						paging.append('<span><a href="#">&lt;&lt;</a></span>');
						paging.append('<span><a href="#">&lt;</a></span>');
          	
          	for(var pageNumber = lowerBound; pageNumber<=upperBound; pageNumber++){
          		if(pageNumber == config.page){
	          		paging.append('<span class="current-page">'+pageNumber+'</span>');
          		} else {
	          		paging.append('<span><a href="#/">'+pageNumber+'</a></span>');
          		}
          	}

          	paging.append('<span><a href="#/">&gt;</a></span>');
						paging.append('<span><a href="#/">&gt;&gt;</a></span>');

						var actualPaging = $element.find('.paging');

						if(actualPaging.length==0){
            	table.before(paging.clone());
							table.after(paging.clone());
          	} else {
							actualPaging.replaceWith(paging);
          	}

          	$element.find('.paging').find('a').on('click',function(){
							var page = $(this).text();
							switch(page){
								case '<<':
									config.page = Math.max(+config.page-config.pageJump,1);
									break;
								case '<':
									config.page = Math.max(+config.page-1,1);
									break;

								case '>>':
									config.page = Math.min(+config.page+config.pageJump,config.totalPage);
									break;
								case '>':
									config.page = Math.min(+config.page+1,config.totalPage);
									break;
								default: 
									config.page = page;
							}
							renderBody();
						});

          };

          renderTable();
        }
      };
    }
  };
}])