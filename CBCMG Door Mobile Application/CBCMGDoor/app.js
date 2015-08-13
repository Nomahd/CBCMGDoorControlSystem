Ext.application({
    name: 'CBCMGDoor',

    requires: [
        'Ext.MessageBox'
    ],
    views: ['Main', 'Login', 'Utilities' , 'User','UserButtons', 'UserBar', 'Settings'],
    controllers: ['Cookie'],
    stores: ['StoreSettings'],
    models: ['Settings'],
    CBCMURL: 'https://members.cbcm.org/m/',
    SERVERURL: 'https://doorsecure.cbcmg.org:8443/DoorControl.aspx',
    USERURL: 'https://doorsecure.cbcmg.org:8444/DoorControl.aspx',
    REQUESTURL: null,
    
    launchApp: function(){
    	var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
    	var rights = cookie.getCookie('rights');     
     	if (rights == "user" || rights == "admin" || rights == 'test')
 		{
     		var sessionKey = cookie.getCookie('sessionKey');
     		
     		Ext.Ajax.request ({
     			url: CBCMGDoor.app.SERVERURL,
     			method: 'GET',
     			disabledCaching: false,
     			params:
     			{
     				ID: '04',
     				name: name,
     				sessionKey: sessionKey
     			},
     		
     			success: function(response)
     			{
     				if (response.responseText == sessionKey)
 					{
     					Ext.Viewport.add(Ext.create('CBCMGDoor.view.User'));
 					}
     					
     				
     				else
 					{
 						Ext.Viewport.add(Ext.create('CBCMGDoor.view.Main'));   
 					}
     						
     			},
     			failure: function(response)
     			{
     				Ext.Msg.alert('Failed', "Connection Failed");
     			}
     		});
 		}

        else
    	{
        	Ext.Viewport.add(Ext.create('CBCMGDoor.view.Main'));   	
    	}
    },
    storeMessage: function(language) {  	
    	var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
    	Ext.Ajax.request ({    		
    		url: CBCMGDoor.app.SERVERURL,
			method: 'GET',
			disabledCaching: false,
			params:
			{
				ID: '06',
				language: language
			},
			success: function(response)
			{
				var message = {};
				var msgString = "";
				var msgChar = "";
				
				var text = response.responseText;
				for (var i=0 ; i < text.length ; i++)
				{
					msgChar = text[i];
					msgString = msgString + msgChar;
					if (msgChar == "$")
					{
						msgString = msgString.slice(0 , -1);
						var json = Ext.JSON.decode(msgString);
						var key = Object.getOwnPropertyNames(json);
						message[key] = json[key];
						json = "";
						msgString = "";

					}	
					console.log(message);
				}	
				cookie.setCookie('message', message);	
				CBCMGDoor.app.loadMessage();
			},
			failure: function(response)
			{
				Ext.Msg.alert('Failed', "Connection Failed");
			}
    	});
    	
    },
    loadMessage: function() {
    	var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
    	var message = cookie.getCookie('message');
    	for (i in message)
		{
    		CBCMGDoor.Language[i] = message[i];
		}
    	CBCMGDoor.app.launchApp();
    	
    	
    },
    launch: function() {  	
    	
    	CBCMGDoor.app.width = screen.width;
    	CBCMGDoor.app.height = screen.height;
    	
    	var cookie = this.getController('CBCMGDoor.controller.Cookie');
    	CBCMGDoor.app.REQUESTURL = cookie.getCookie('requesturl');
    	
    	if (Ext.os.is('Android'))
		{
    		document.addEventListener("backbutton", Ext.bind(keyPress, this), false);
    		
    		function keyPress(e)
    		{
    			e.preventDefault();
    			
				navigator.app.exitApp();
    		}
		}
    	
    	var language = cookie.getCookie('language');   	
        if (language == null)
    	{
        	language = 'ENG';
        	cookie.setCookie('language', language);
        	this.storeMessage(language); 
        	
    	}   
        var message = cookie.getCookie('message');
        if (message == null)
    	{
        	this.storeMessage(language);
    	}
        else
    	{
        	this.loadMessage();
    	}
        	
        Ext.fly('appLoadingIndicator').destroy();       
    }

});
Ext.define('CBCMGDoor.Language', {
	
	
});

