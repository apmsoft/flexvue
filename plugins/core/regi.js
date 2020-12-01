define(['jquery','underscore','backbone'], function($,_,Backbone){
	var initialize = function(argv, callback){
		app.log(argv);
		app.log('callback : '+callback);

		var version = '1.0';
		var url     = argv[0];
		var params  = argv[1];

		var Model = Backbone.Model.extend({
		    urlRoot : '',
		    initialize: function(){
		        this.urlRoot = url;
		        if(!_.isNull(app.server_language) && app.server_language !=''){
		        	this.urlRoot += app.server_language;
		        }
		    },
		    url: function(){
		        app.log(this.urlRoot);
		        return this.urlRoot;
		    }
		});

		var m = new Model();
		m.save(params,{
			success:function(model, data){
				app.log(data);
				callback(data);
			},
			error:function(model, e){
		    	app.log(e.responseText);
		    	app.log(JSON.stringify(e));
		    }
		});
	};
	return {
		initialize : initialize
	};
});
