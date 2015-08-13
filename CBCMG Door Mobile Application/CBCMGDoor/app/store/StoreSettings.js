Ext.define('CBCMGDoor.store.StoreSettings', {
	extend: 'Ext.data.Store',
	xtype: 'store',
	requires: [
	           'CBCMGDoor.model.Settings',
	           'Ext.data.proxy.LocalStorage'
	           ],
	           
	config:
	{
		model: 'CBCMGDoor.model.Settings',
		storeId: 'StoreSettingsID',
		proxy:
		{
		  type: 'localstorage',
		  id:   'StoreSettingsProxy'
		},
		
		autoLoad: true
	}
	
	
});