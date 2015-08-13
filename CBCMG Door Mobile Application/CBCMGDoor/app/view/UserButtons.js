Ext.define('CBCMGDoor.view.UserButtons', {
	extend: 'Ext.Panel',
	xtype: 'userButtons',
	requires: [
	           'Ext.Button',
	           'Ext.TitleBar',
	           'Ext.util.DelayedTask',
	           'Ext.MessageBox',
	           'Ext.Toolbar'
	       ],
	initialize: function()
	{
		
		this.showButtons();
		
	},
	showButtons: function()
	{  		
		var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		var userButton =
		{
				xtype: 'button',
		    	ui: 'decline-round',
		    	html: '<br><br><br><br><br><br><br>' + CBCMGDoor.Language.MainAccess,
		    	itemId: 'userbutton',
		    	margin: 10,
		    	width: 200,
		    	minHeight: 200,
				handler: function()
				{	 			
					Ext.Viewport.mask({xtype: 'loadmask'});
					this.up().request("Grant Access");
					
				}
		};
    	
		var adminButton =
		{  	
        	xtype: 'button',
        	ui: 'confirm-round',
        	html: '<br><br><br><br><br><br><br>' + CBCMGDoor.Language.MainLock,
        	cls: 'adminButtonImage',
        	margin: 10,
        	width: 200,
        	minHeight: 200,
        	itemId: 'adminbutton',
    		handler: function()
    		{
    			var top = this.up('userButtons');
    			
    			Ext.Ajax.request ({
    				url: CBCMGDoor.app.SERVERURL,
    				method: 'GET',
    				disabledCaching: false,
    				params:
    				{
    					ID: '03'
    				},    
    			
	    	   		success: function(response)
	    	   		{
	    	   			if (response.responseText == "Locked")
	    	   				{
		    	   				Ext.Msg.show({
		        	   				title: CBCMGDoor.Language.DoorStatus,
		        	   				message: CBCMGDoor.Language.DoorStatusL,
		        	   				buttons: [{text: CBCMGDoor.Language.Unlock, itemId: 'unlock'},{text: CBCMGDoor.Language.Cancel}],
		        	   				fn: function(buttonId)
		        	   				{
		        	   					if (buttonId == 'unlock')
		        	   						top.request("Unlock");
		        	   				}
		        	   			});
	
	    	   				}
	    	   			else if (response.responseText == "Unlocked")
	    	   				{
	    	   				Ext.Msg.show({
	        	   				title: CBCMGDoor.Language.DoorStatus,
	        	   				message: CBCMGDoor.Language.DoorStatusU,
	        	   				buttons: [{text: CBCMGDoor.Language.Lock, itemId: 'lock'},{text: CBCMGDoor.Language.Cancel}],
	        	   				fn: function(buttonId)
	        	   				{
	        	   					if (buttonId == 'lock')
	        	   						top.request("Card Only");
	        	   				}
	        	   			});
	    	   				}
	    	   			
	    	   		},
	    	   		failure: function(response)
	    	   		{
		   				Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
		   				Ext.Viewport.unmask();
	    	   		}
				});	  
    		}
        };
	   if (cookie.getCookie('rights') == 'user')
	   {
		 
		  this.add([userButton]);
	   }
	   else
	  {
	   this.add(
				[
				 	userButton,
				 	adminButton
				 ]);
	  }
		
	},
	
	request: function (access)   
	   {
		   	var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		   	var sessionKey = cookie.getCookie('sessionKey');
		   	var name = cookie.getCookie('name');
			var media = null;
			var URL = null;
			var rights = cookie.getCookie('rights');			
			if (rights == "user")
				URL = CBCMGDoor.app.USERURL;			
			else
				URL = CBCMGDoor.app.SERVERURL;
				
			if (Ext.os.is('Android'))
			{
				media = new Media('/android_asset/www/sfx.mp3');
			}
			else if (Ext.os.is('iOS'))
			{
				media = new Media('sfx.mp3');				
			}
			
			
			if (rights == 'test')
			{
				if (access == "Grant Access")
				{
					if (Ext.os.is('Android') || Ext.os.is('iOS'))
					{
						navigator.notification.vibrate(1000);
						media.play();
					}
					
					var message = Ext.Msg.alert(CBCMGDoor.Language.Success, CBCMGDoor.Language.GrantAccessMessage);
					message.setButtons("");			
					var wait = Ext.create('Ext.util.DelayedTask', 
							function(){message.hide();});
					wait.delay(8000);
					Ext.Viewport.unmask();
				}
				else if (access == "Unlock" || access == "Card Only")
				{
					if (Ext.os.is('Android') || Ext.os.is('iOS'))
					{
						navigator.notification.vibrate(1000);
						media.play();
						
					}
					Ext.Msg.alert(CBCMGDoor.Language.Success);	
					Ext.Viewport.unmask();
				}				
			}
			else 
			{		
				Ext.Ajax.request({
					url: URL,
					method: 'GET',
					disabledCaching: false,
					params:
					{
						ID: '07',
						sessionKey: sessionKey
					},
					success: function(response)
					{
						if (response.responseText == sessionKey)
						{
							Ext.Ajax.request ({
								url: URL,
								method: 'GET',
								disabledCaching: false,
								params:
								{
									ID: '00',
									request: access,
									name: name,
									sessionKey: sessionKey
								},
							
								success: function(response)
								{
									if (access == "Grant Access")
									{
										if (Ext.os.is('Android') || Ext.os.is('iOS'))
										{
											navigator.notification.vibrate(1000);
											media.play();
										}
										
										var message = Ext.Msg.alert(CBCMGDoor.Language.Success, CBCMGDoor.Language.GrantAccessMessage);
										message.setButtons("");			
										var wait = Ext.create('Ext.util.DelayedTask', 
												function(){message.hide();});
										wait.delay(8000);
										Ext.Viewport.unmask();
									}
									else if (access == "Unlock" || access == "Card Only")
									{
										if (Ext.os.is('Android') || Ext.os.is('iOS'))
										{
											navigator.notification.vibrate(1000);
											media.play();
											
										}
										Ext.Msg.alert(CBCMGDoor.Language.Success);	
										Ext.Viewport.unmask();
									}				
								},
								failure: function(response)
								{
									if (rights == "user")
				    	   				Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.Wifi);
				    	   			else
				    	   				Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
									Ext.Viewport.unmask();
								}
							});
						}
						else
						{
							Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorSession);
							Ext.Viewport.unmask();
						}
					},
					failure: function(response)
					{
						if (rights == "user")
	    	   				Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.Wifi);
	    	   			else
	    	   				Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
						
						Ext.Viewport.unmask();
					}
				});
			}
 		}

});