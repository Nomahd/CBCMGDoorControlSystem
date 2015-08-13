Ext.define('CBCMGDoor.view.Utilities', {
	extend: 'Ext.Panel',
	xtype: 'about',
	requires: [
	       ],
	initialize: function()
	{
		this.displayBarButtons();
	},
	config:
	{
		layout: {
			type: 'hbox',
			align: 'center'
		}
	},
   	displayBarButtons: function()
   	{
   		var aboutButton = 
   		{
			xtype: 'button',
			flex: 1,
			height: 50,
        	text: CBCMGDoor.Language.AboutTitle,
        	handler: function()
        	{
        		Ext.Msg.show({
    	   				title: CBCMGDoor.Language.About,
    	   				message: CBCMGDoor.Language.About1 
    	   				+ CBCMGDoor.Language.About2 + CBCMGDoor.Language.About3 
    	   				+ CBCMGDoor.Language.About4 + CBCMGDoor.Language.About5
	   			});
        	}
	        	
	    };  
   		var spacer = 
		{
   			xtype: 'spacer'	
		};
   		var settingsButton =
   		{
    	   xtype: 'button',
    	   flex: 1,
    	   height: 50,
    	   text: CBCMGDoor.Language.Settings,     	
    	   handler: function()
    	   {
    		   Ext.Viewport.setActiveItem({xtype: 'settings'});
    	   }
        };
   		this.add(
   				[   			
   				 	settingsButton,
   				 	spacer,
   				 	aboutButton				 	
   			    ]);
   	}
});

















