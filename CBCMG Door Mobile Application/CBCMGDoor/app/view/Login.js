Ext.define('CBCMGDoor.view.Login', {
	extend: 'Ext.Panel',
	xtype: 'login',

    initialize: function()
    {
    	this.displayLogin();
    },

	displayLogin: function()
	{
		var titleBar = 
		{
				xtype:'titlebar',
				docked: 'top',
				title: CBCMGDoor.Language.AppName,
				height: 70
        };
		var fieldSet = 
		{
				xtype: 'fieldset',
				title: CBCMGDoor.Language.PasswordQuery,
				docked: 'top',
				items: [
			        {
						xtype: 'textfield',
						itemId: 'usernameField',
						name: 'name',
						label: CBCMGDoor.Language.UserName,
						listeners:
						{
							keyup: function(field, e)
							{
								if (e.event.keyCode == 13)
								{
									e.preventDefault();
									var username = this.up().items.items[0].getValue();
					        		var password = this.up().items.items[1].getValue();
					        		this.up('login').login(username, password);
								}
							}
						}		        
			        },
			        {
			        	xtype: 'passwordfield',
			        	itemId: 'passwordfieldID',
			        	name: 'password',
			        	label: CBCMGDoor.Language.Password,
			        	listeners:
						{
							keyup: function(field, e)
							{
								if (e.event.keyCode == 13)
								{	
									e.preventDefault();
									var username = this.up().items.items[0].getValue();
					        		var password = this.up().items.items[1].getValue();
					        		this.up('login').login(username, password);
								}
							}
						}	
			        },
			        {
		        		xtype: 'selectfield',
		        		label: CBCMGDoor.Language.Language,
		        		itemId: 'languageselect',
		        		autoSelect: false,
		        		placeHolder: CBCMGDoor.Language.LangSelect,
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
			        	
		        	},
			        {
			        	xtype: 'button',
			        	text: CBCMGDoor.Language.Submit,
			        	handler: function()
			        	{
			        		var username = this.up().items.items[0].getValue();
			        		var password = this.up().items.items[1].getValue();
			        		this.up('login').login(username, password);
			        	}
		        	}]
	        	};
		this.add(
		[
		 	titleBar,
		 	fieldSet 
	    ]);
	
	},
	login: function(username, password)
	{
		Ext.Viewport.mask({xtype: 'loadmask'});
		var cookie = CBCMGDoor.app.getController('CBCMGDoor.controller.Cookie');
		
		
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
                screenheight: CBCMGDoor.app.height,
                screenwidth:  CBCMGDoor.app.width
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
									(response.responseText == 'admin') ||
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
    								Ext.Msg.show({
    									title: CBCMGDoor.Language.Error,
    									message: CBCMGDoor.Language.Privilege
    								});
    								Ext.Viewport.unmask();
								}   								
    						},
    						
    						failure: function(response)
    						{
    							Ext.Msg.alert(CBCMGDoor.Language.Error, CBCMGDoor.Language.ErrorConnection);
    							Ext.Viewport.unmask();
    						}
						
						
        				});
					}
				else
					{
						Ext.Msg.alert(CBCMGDoor.Language.Error, status.MESSAGE);
						Ext.Viewport.unmask();
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






