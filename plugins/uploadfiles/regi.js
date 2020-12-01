define(['jquery','underscore','css!uploadfiles/jquery.uploadfile.css','jqueryform','uploadfiles/jquery.uploadfile.min'],
	function($,_,css,jqueryform,uploadfile){
	var initialize = function(argv, callonload,callsuccess, calldelete){
		app.log('argv : '+argv);

		var onloadCallback	= callonload;
		var successCallback = callsuccess;
		var deleteCallback  = calldelete;
		var target_id       = argv[0];
		// var document_id		= argv[1];
		var feature         = argv[1];
		var params          = argv[2];

		// set _urlRoot
		var _urlRoot = feature.value;
        if(!_.isNull(app.server_language) && app.server_language !=''){
        	_urlRoot += app.server_language;
        }

		var settings ={
			url: 			_urlRoot,
			formData: 		{upfilename:'upfilename',doc_id:params.doc_id,token:params.token},
		    dragDrop: 		params.dragdrop, 	// true | false
		    fileName: 		'upfilename',		// input type name="upfilename"
		    maxFileCount:  	(!_.isUndefined(params.maxFileCount)) ? params.maxFileCount : -1,
		    acceptFiles: 	(!_.isUndefined(params.acceptFiles)) ? params.acceptFiles : '*',
		    returnType: 	'json',
		    previewHeight: 	"40px",
 			previewWidth: 	"40px",
 			showFileCounter:false,
 			onLoad:function(obj)
			{
				// obj.createProgress(
				// 	data.msg[i]['sfilename'],
				// 	data.msg[i]['ofilename'],
				// 	data.msg[i]['fullname'].replace('/s/','/'),
				// 	data.msg[i]['file_size'],
				// 	data.msg[i]['file_type'],
				// 	data.msg[i]['image_size']
				// );

				// callback
			    if(!_.isNull(onloadCallback) && _.isFunction(onloadCallback)){
				    onloadCallback(obj);
			   	}
			},
			onSuccess:function(files,data,xhr)
			{
				// result false
		        if(typeof(data.result) != 'undefined'){
		        	if(data.result == 'false'){
                        alert(data.msg);
                        $(target_id).focus();
                        return;
                    }
		        }

			    // callback
			    if(!_.isNull(successCallback) && _.isFunction(successCallback)){
				    successCallback(data);
			   	}
			},
		    showDelete:true,
	        deleteCallback: true,
		    deleteCallback: function(data, pd)
			{
				var data_count = data.length;
			    for(var i=0;i<data_count;i++)
			    {
					var ofilename =data[i]['ofilename'];
					var file_type =data[i]['file_type'];
					var fullname  =data[i]['fullname'];
					var sfilename =data[i]['sfilename'];

					deleteCallback({file_type:file_type,fullname:fullname,sfilename:sfilename});
				}
			}
		};
		// <div id="#mulitplefileuploader"></div>
		$(target_id).uploadFile(settings);
	};
	return {
		initialize : initialize
	};
});
