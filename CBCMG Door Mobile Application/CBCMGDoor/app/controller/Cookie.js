Ext.define('CBCMGDoor.controller.Cookie',
{
	extend: 'Ext.app.Controller',
	requires: ['CBCMGDoor.store.StoreSettings'],
	storeId: 'StoreSettingsID',
	storeCheck: function()
	{
		var store = Ext.getStore('StoreSettingsID');
		if (!store)
		{
			store = Ext.create('CBCMGDoor.store.StoreSettings');
		}
		return store;
	},
	
	setCookie: function(key, value)
	{
		var store = Ext.getStore(this.storeId);
		var index = store.findExact('key', key);
		if (index != -1)
		{
			var model = store.getAt(index);
			model.set('value', value);
			store.sync();
			
		
		}
		else
		{
			store.add({key: key, value: value});
			store.sync();
		}
		
		
	},
	
	getCookie: function(key)
	{	
		var store = Ext.getStore(this.storeId);
		var index = store.findExact('key', key);
		if (index != -1)
		{
			var value = store.getAt(index).get('value');
			return value;
		}
		else
			return undefined;
		
		
	},

	removeCookie : function(key)
    {
		var store = Ext.getStore(this.storeId);
        var index = store.findExact('key', key);
        if(index!==-1)
        {
            store.removeAt(index);
            store.sync();
        }
    }
	
	
	
});
		