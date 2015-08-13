Ext.define('CBCMGDoor.view.User',{	
	extend: 'Ext.Panel',
	xtype: 'user',
	requires: [
           'Ext.Button',
           'Ext.TitleBar',
           'Ext.util.DelayedTask',
           'Ext.MessageBox',
           'Ext.Toolbar'
       ],
   
   config: {
	   cls: 'panelBackground',
	   layout: {
		   type: 'vbox',
		   align: 'middle'
	   },
	   scrollable: true,
	   
	   items: [         		      
        {
        	xtype: "userButtons"
        },
        {
     	   xtype: 'topbar',
     	   docked: 'top'
        },
		{
			xtype: 'about',
			docked: 'bottom'
		}
    ]}
});













