Ext.define('CBCMGDoor.view.UserBar', {
	extend: 'Ext.Toolbar',
	xtype: 'topbar',
	requires: [
	           'Ext.TitleBar',
	           'Ext.Button'
	       ],
	initialize: function()
	{
		this.displayBar();
	},
   	displayBar: function()
   	{
   		var title = 
		{
    	   xtype: 'titlebar',
    	   docked: 'top',
    	   title: CBCMGDoor.Language.DoorController,
    	   height: 70
        };
   		this.add(
   				[   	
   				 	title  				 	
   			    ]);
   	}
});



















