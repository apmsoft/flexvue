// contents
var DocAsyncTask = {
    version: '1.2',
    // get
    doGetContents: function(feature, params, callback) {
        var successCallback = (!_.isNull(callback) && _.isFunction(callback.success)) ? callback.success : null;
        var falseCallback = (!_.isNull(callback) && _.isFunction(callback.fail)) ? callback.fail : null;

        require(['core/request.min'], function(document_request) {
            document_request.initialize([feature, params], function(tpl, response) {
                if (response.result == 'true') {
                    if (!_.isNull(successCallback)) {
                        successCallback(tpl, response);
                    }
                } else if (response.result == 'false') {
                    if (!_.isNull(falseCallback)) {
                        falseCallback(response);
                    }
                }
            });
        });
    },
    // post input
    doPostMessage: function(url, params, callback) {
        var successCallback = (!_.isNull(callback) && _.isFunction(callback.success)) ? callback.success : null;
        var falseCallback = (!_.isNull(callback) && _.isFunction(callback.fail)) ? callback.fail : null;

        require(['core/regi.min'], function(document_regi) {
            document_regi.initialize([url, params], function(response) {
                if (response.result == 'true') {
                    if (!_.isNull(successCallback)) {
                        successCallback(response);
                    }
                } else if (response.result == 'false') {
                    if (!_.isNull(falseCallback)) {
                        falseCallback(response);
                    }
                }
            });
        });
    },
    // return : json
    doSubmit: function(targetId, callback) {
        $(targetId).submit(function(event) {
            event.preventDefault();

            var arr = $(this).serializeArray();
            data = _(arr).reduce(function(acc, field) {
                field.value = ($('#'+field.name+' .cke_wysiwyg_frame').length > 0) ? encodeURIComponent($('#'+field.name+' .cke_wysiwyg_frame').html()) : field.value;
                // app.log('============');
                // app.log(field);
                // app.log('filedname : '+field.name);
                // app.log('field.value : '+field.value);
                acc[field.name] = (!_.isUndefined(acc[field.name]) && acc[field.name] !='') ? acc[field.name]+','+field.value : field.value;
                return acc;
            }, {});

            // app.log(data);
            callback(data);
        });
    }
};
