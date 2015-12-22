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
