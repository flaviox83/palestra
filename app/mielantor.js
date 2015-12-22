var myAppModule = angular.module('Mielantor', [ 'ngRoute', 'ngWebSocket', 'ngAnimate', 'ngResource', 'checklist-model', 'ui.bootstrap',
                                                'ui.grid', 'toaster', 'ngPopup' ]);

myAppModule.config(AppRouterConfig);

// Set up our mappings between URLs, templates, and controllers
function AppRouterConfig($routeProvider) {
	$routeProvider.when('/start', {
		controller : 'DashBoard',
		controllerAs : 'dashboardCtrl', // utilizzo il nuovo formalismo controllerAs
		templateUrl : 'partials/dashboard.html'
	}).otherwise({
		redirectTo : '/start'
	});
};

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