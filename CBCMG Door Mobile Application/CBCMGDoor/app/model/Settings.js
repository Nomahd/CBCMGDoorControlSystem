Ext.define('CBCMGDoor.model.Settings', {
	extend: 'Ext.data.Model',
	requires: ['Ext.data.identifier.Uuid'],
	config: {
		identifier: 'uuid',
		fields: [
         	'key', 'value'
         ]
	}


});