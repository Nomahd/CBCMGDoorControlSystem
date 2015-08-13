Ext.define('CBCMGDoor.view.Main', {
	extend: 'Ext.Panel',
	xtype: 'main',
	requires:[
	          'Ext.form.FieldSet',
	          'Ext.field.Password',
	          'Ext.field.Select'
   	],

   	config: 
   	{  
   		cls: 'panelBackground',
   		scrollable: null,
   		items: [
	        {
	        	xtype:'login'
	        }]
   	}	
});
