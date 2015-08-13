Ext.define('CBCMGDoor.view.Settings', {
	extend: 'Ext.Panel',
	xtype: 'settings',
	config: {
		itemId: 'settings',
		cls: 'panelBackground'
	},
	initialize: function()
	{
		var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		
		this.displayLogin();
		
		var username = this.down('#usernameField');
		var password = this.down('#passwordfieldID');
		
		usernameCookie = cookie.getCookie('name');
		passwordCookie = cookie.getCookie('password');

		username.setValue(usernameCookie);
		password.setValue(passwordCookie);
		
		 
	},
	logout: function(sessionKey, cookie)
	{
		Ext.Viewport.setActiveItem('main');
		cookie.removeCookie('sessionKey');
		cookie.removeCookie('name');
		cookie.removeCookie('password');
		cookie.removeCookie('rights');
		
		Ext.Ajax.request({
			url: CBCMGDoor.app.SERVERURL,
			method: 'GET',
			disabledCaching: false,
			params:
			{
				ID: '05',
				sessionKey: sessionKey
			},
			success: function()
			{
				
			},
			failure: function()
			{
				
			}     				
		});
			
		 	
	},
	displayLogin: function()
	{
		var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		var sessionKey = cookie.getCookie('sessionKey');
		var language = cookie.getCookie('language');
		if (language == 'ENG')
			language = CBCMGDoor.Language.English;
		else if (language == 'ZHT')
			language = CBCMGDoor.Language.TraditionalChinese;
		else if (language == 'ZHS')
			language = CBCMGDoor.Language.SimplifiedChinese;
		
		var titleBar = 
		{
				xtype:'titlebar',
				docked: 'top',
				title: CBCMGDoor.Language.Settings,
				height: 70,
				items: [
				        {
				        	xtype: 'button',
				        	text: CBCMGDoor.Language.Back,
				        	handler: function()
				        	{
				        		Ext.Viewport.setActiveItem({xtype: 'user'});
				        	}
				        }
				        ]
        };
		var usernameField = 		
        {
			xtype: 'textfield',
			itemId: 'usernameField',
			name: 'name',
			label: CBCMGDoor.Language.UserName,
			listeners:
			{
				keyup: function(fieldset, e)
				{
					if (e.event.keyCode == 13)
					{
						var username = this.up().items.items[1].getValue();
		        		var password = this.up().items.items[2].getValue();
		        		success = this.up('settings').login(username, password);
		        		if (!success)
		    			{
		        			this.up().logout(sessionKey, cookie);		        					        			
		    			} 	
		        		
					}
				}
			}			        
        };
		
		var passwordField = 
        {
        	xtype: 'passwordfield',
        	itemId: 'passwordfieldID',
        	name: 'password',
        	label: CBCMGDoor.Language.Password,
        	listeners:
			{
				keyup: function(fieldset, e)
				{
					if (e.event.keyCode == 13)
					{
						var username = this.up().items.items[1].getValue();
		        		var password = this.up().items.items[2].getValue();
		        		success = this.up('settings').login(username, password);
		        		if (!success)
		    			{
		        			this.up().logout(sessionKey, cookie);		        					        			
		    			} 	
					}
				}
			}	
        };
		
		var langSelect =			        
        {
    		xtype: 'selectfield',
    		label: CBCMGDoor.Language.Language,
    		itemId: 'languageselect',
    		autoSelect: false,
    		placeHolder: language,
    		options: [
		        	  {text: CBCMGDoor.Language.English, value: 'ENG'},
		        	  {text: CBCMGDoor.Language.TraditionalChinese, value: 'ZHT'},
		        	  {text: CBCMGDoor.Language.SimplifiedChinese, value: 'ZHS'}
		        	  ],
		    listeners: {
		    	change: function(field, newValue)
		    	{
		    		var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		    		var language = newValue;
		    		cookie.setCookie('language', newValue);
		    		CBCMGDoor.app.storeMessage(language);
		    	}
        
		    }    	  
        	
    	};
		
		var submit = 
        {
        	xtype: 'button',
        	text: CBCMGDoor.Language.Submit,
        	handler: function()
        	{
        		var sessionKey = cookie.getCookie('sessionKey');
        		var username = this.up('settings').items.items[1].getValue();
        		var password = this.up('settings').items.items[2].getValue();
        		
        		success = this.up('settings').login(username, password);
        		if (!success)
    			{
        			this.up().logout(sessionKey, cookie);		        					        			
    			} 	
        	}
    	};
		this.add(
		[
		 	titleBar,
		 	usernameField,
		 	passwordField,
		 	langSelect,
		 	submit
	    ]);
	
	},		
	login: function(username, password)
	{
		Ext.Viewport.mask({xtype: 'loadmask'});
		var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		var sessionKey = cookie.getCookie('sessionKey');
		this.logout(sessionKey, cookie);		   
		
		Ext.Ajax.request ({
			url:CBCMGDoor.app.CBCMURL,
			method: 'POST',
			disabledCaching: false,
			params:
			{
				action:   '00',
				username: username,
				password: password,
				version:  "1.0.0",
                screenheight: screen.height,
                screenwidth:  screen.width
			},
				
			success: function(response)
			{
				var status = eval('(' + response.responseText + ')');
				
				
				if (status.STATUS == "OK")
					{
						
						Ext.Ajax.request ({
							url: CBCMGDoor.app.SERVERURL,
							method: 'GET',
							disabledCaching: false,
							params:
	        				{
		        				ID: '01',
		        				name: username
	        				},
						
						
    						success: function(response)
    						{
    							if ((response.responseText == 'user') || 
									(response.responseText == 'admin')|| 
									(response.responseText == 'test'))
    								{
    									var rights = response.responseText; 									
    										
    									
        								Ext.Ajax.request ({
	        								url: CBCMGDoor.app.SERVERURL,
	        								method: 'GET',
	        								disabledCaching: false,
	        								params:
	        		        				{
	        			        				ID: '02',
	        			        				name: username,
	        			        				sessionKey: status.SESSION_KEY,
	        			        				rights: rights
	        			        				
	        		        				},
	        		        				success : function(response)
	        		        				{						        		        					
	        		        				},
	        		        				failure: function(response)
	        		        				{		
	        		        					Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
	                							Ext.Viewport.unmask();
	        		        				}
        								});
        								
										cookie.setCookie('name', username);
										cookie.setCookie('password', password);
										cookie.setCookie('sessionKey', status.SESSION_KEY);
										cookie.setCookie('rights', response.responseText);
										
										Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
    									Ext.Viewport.setActiveItem({xtype: 'user'});
    									Ext.Viewport.unmask();
    									 
	        												        								}
    							else 
								{
    								Ext.Msg.alert(CBCMGDoor.Language.Privilege);
    								Ext.Viewport.unmask();
    								return true;
								}
    								
    						},
    						
    						failure: function(response)
    						{
    							Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
    							Ext.Viewport.unmask();
    						}
						
						
        				});
					}
				else if (status.STATUS == "FAILED")
					{
						Ext.Msg.alert(CBCMGDoor.Language.Error, status.MESSAGE);
						Ext.Viewport.unmask();
						return false;
					}
			},
			failure: function(response)
			{
				Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
				Ext.Viewport.unmask();
			}
		});		
		   		
	} 	
});