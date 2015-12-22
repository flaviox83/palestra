var myAppModule = angular.module('Mielantor', [ 'ngRoute', 'ngWebSocket', 'ngAnimate', 'ngResource', 'checklist-model', 'ui.bootstrap',
                                                'ui.grid', 'toaster', 'ngPopup' ]);

myAppModule.config(AppRouterConfig);

// Set up our mappings between URLs, templates, and controllers
function AppRouterConfig($routeProvider) {
	$routeProvider.when('/start', {
		controller : 'DashBoard',
		controllerAs : 'dashboardCtrl', // utilizzo il nuovo formalismo
										// controllerAs
		templateUrl : 'partials/dashboard.html'
	}).otherwise({
		redirectTo : '/start'
	});
};


myAppModule.controller('DashBoard', function($log, WebSocket) {
	var vm = this;

	vm.testo1 = 'pippone';
	vm.testo2 = 'antani';
		
	

        vm.test = function (event) {
            console.log(event)
        };
        
        vm.toggleResize = function () {
            vm.ngPopupOption.resizable = !vm.ngPopupOption.resizable;
        };
        
        vm.toggleDrag = function () {
            vm.ngPopupOption.draggable = !vm.ngPopupOption.draggable;
        };
        
        vm.toggleTitleBar = function () {
            vm.ngPopupOption.hasTitleBar = !vm.ngPopupOption.hasTitleBar;
        };

        vm.toggleView = function () {
            vm.ngPopupOption.isShow = !vm.ngPopupOption.isShow;
        };

        vm.msgList = [];
        vm.insertEventMessage = function (msg) {
            vm.msgList.push(msg)
        };

        
        vm.websocket =  WebSocket;
        
        vm.SetRows = function(len) {
        	vm.websocket.set_max_rows(len);	
        }
        
		vm.rows = vm.websocket.get_max_rows();
        
        if (typeof vm.websocket.collection != 'undefined') {
		  	vm.contentavailable = true;
		 } else {
		  	vm.contentavailable = false; 
		 };

        vm.ngPopupOption = {
            modelName: "myNgPopup",
            width: 400,
            height: 300,
            hasTitleBar:true,
            template: '<h1>here we are</h1>',
            title: "Awesome Dialog",
            resizable:true,
            draggable: true,
            position: { top : 250, left : 300},
            onOpen : function(){},
            onClose  : function(){},
            onDragStart : function(){},
            onDragEnd : function(){},
            onResize : function(){}
        }
		
});

myAppModule.factory("services", [ '$http', '$log', function($http) {
	var serviceBase = 'services/api.php?x=';
	var obj = {};

	obj.getUserRole = function() {
		return $http.get(serviceBase + 'get_user_role');
	};

	obj.insertForm = function(id, form) {
		var ck = document.cookie;
		return $http.post(serviceBase + 'insert_form', {
			ck : ck,
			key : id,
			data : form
		});
	};

	return obj;
} ]);

myAppModule.factory('WebSocket', function($websocket) {
	var ws = $websocket('ws://localhost:8888/');
	var collection = [];

	var max_rows = 30;
	
	var results = {};
	
	ws.onMessage(function(msg) {

		// Let's log some debug message to the console...
		console.log('message: [' + typeof msg + '] ' +  msg);
		
		// 'res' is the object that will contain the data to be pushed
		// onto the "collection" array to be returned to our controller
		var res;
		try {
			// let's try to parse the "data" property...
			res = JSON.parse(msg.data);
		} catch (e) {
			// ...and if something is wrong, let's define some default
			res = {
				'timestamp' : Date.now(),
				'message' : 'problem parsing data ['+msg.data+"]"
			};
		}

		// OK. So let's add our data to the 'collection' array...
		collection.push({
			rows: max_rows,
			timestamp : res.timestamp,
			received : Date.now(),
			message : res.message,
			host : res.host,
			severity : res.severity,
			facility : res.facility,
			programname : res.programname,
			tag : res.syslogtag
		});

		// but if we have more than max_rows lines, we need to keep only the last ones...
		while (collection.length > max_rows ) {
			collection.shift();
		}
	});

	ws.onError(function(event) {
		console.log('connection Error', event);
	});

	ws.onClose(function(event) {
		console.log('connection closed', event);
	});

	ws.onOpen(function() {
		console.log('connection open');
		ws.send('Hello World');
		ws.send('again');
		ws.send('and again');
	});
	// setTimeout(function() {
	// ws.close();
	// }, 500)

	results.set_max_rows = function(max) {
		max_rows = max;
	}

	results.get_max_rows = function() {
		return max_rows;
	}

	results.collection = collection;

	results.status = function() {
		return ws.readyState;
	}

	results.send = function(message) {
		if (angular.isString(message)) {
			ws.send(message);
		} else if (angular.isObject(message)) {
			ws.send(JSON.stringify(message));
		}
	}
//	return {
//		collection : collection,
//		status : function() {
//			return ws.readyState;
//		},
//		send : function(message) {
//			if (angular.isString(message)) {
//				ws.send(message);
//			} else if (angular.isObject(message)) {
//				ws.send(JSON.stringify(message));
//			}
//		}
//
//	};
	return results;
});


// Intercetto le chiamate HTTP per loggarle con il servizio di JSNLog
// myAppModule.config(['$httpProvider', function($httpProvider) {
// $httpProvider.interceptors.push('logToServerInterceptor');
// }]);

myAppModule
		.config([
				"$provide",
				function($provide) {
					// Use the `decorator` solution to substitute or attach
					// behaviors to
					// original service instance; @see angular-mocks for more
					// examples....

					$provide
							.decorator(
									'$log',
									[
											"$delegate",
											function($delegate) {
												// mi serve per aggiungere i
												// leading zero a data e ora
												var pad = function(n, width, z) {
													z = z || '0';
													n = n + '';
													return n.length >= width ? n
															: new Array(width
																	- n.length
																	+ 1)
																	.join(z)
																	+ n;
												}

												var wantTrace = false;

												// Save the original
												// $log.debug()
												var debugFn = $delegate.debug;

												$delegate.debug = function() {
													var args = [].slice
															.call(arguments);
													var currentdate = new Date();
													var datetime = pad(
															currentdate
																	.getDate(),
															2)
															+ "/"
															+ pad(
																	currentdate
																			.getMonth() + 1,
																	2)
															+ "/"
															+ pad(
																	currentdate
																			.getFullYear(),
																	4)
															+ " "
															+ pad(
																	currentdate
																			.getHours(),
																	2)
															+ ":"
															+ pad(
																	currentdate
																			.getMinutes(),
																	2)
															+ ":"
															+ pad(
																	currentdate
																			.getSeconds(),
																	2);

													// Prepend timestamp
													args[0] = datetime + " "
															+ args[0];

													// now try to log the error
													// to the server side.
													try {
														var msg = args[0];
														var ck = document.cookie;

														// use AJAX (in this
														// example jQuery) and
														// NOT
														// an angular service
														// such as $http
														$
																.ajax({
																	type : "POST",
																	url : "services/api.php?x=write_log",
																	contentType : "application/json",
																	data : '{"msg":"'
																			+ args[0]
																			+ '","ck":"'
																			+ document.cookie
																			+ '"}'
																});
													} catch (loggingError) {
														$log
																.warn("Error server-side logging failed");
														$log.log(loggingError);
													}

													// Call the original with
													// the output prepended with
													// formatted timestamp
													debugFn.apply(null, args)
												};

												$delegate.trace = function() {
													if (wantTrace) {
														var args = [].slice
																.call(arguments);
														var currentdate = new Date();
														var datetime = pad(
																currentdate
																		.getDate(),
																2)
																+ "/"
																+ pad(
																		currentdate
																				.getMonth() + 1,
																		2)
																+ "/"
																+ pad(
																		currentdate
																				.getFullYear(),
																		4)
																+ " "
																+ pad(
																		currentdate
																				.getHours(),
																		2)
																+ ":"
																+ pad(
																		currentdate
																				.getMinutes(),
																		2)
																+ ":"
																+ pad(
																		currentdate
																				.getSeconds(),
																		2);

														// Prepend timestamp
														args[0] = "[TRACE] "
																+ datetime
																+ " " + args[0];

														// Call the original
														// with the output
														// prepended with
														// formatted timestamp
														debugFn.apply(null,
																args)
													}
												};

												return $delegate;
											} ]);
				} ]);