myAppModule.factory('WebSocket', function($websocket) {
	var ws = $websocket('ws://10.6.1.119:8888/');
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
