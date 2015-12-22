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
