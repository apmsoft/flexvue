define(['jquery', 'underscore', 'backbone', 'lazyload','DateFormat'],
    function($, _, Backbone, lazyload, DateFormat) {

        // 알람
        var AlarmActivity = {
            is_loading: false,
            init : function(callback){
                var self = this;
                app.parserResource ('/layout/alarm', function(layout_info)
                {
                    _.extend(app.docs, layout_info);

                    // callback
                    if(!_.isNull(callback) && _.isFunction(callback)){
                        callback();
                    }
                });
            },
            doListDialog : function(params, callback){
                var self = this;

                if (!self.is_loading) {
                    // panel
                    var panel_setting = app.docs.alarm.list_dialog; // SETTING VALUE
                    var panel = Panel.onStart(panel_setting);

                    // make url
                    UrlUtil.pushUrlParams({
                        mode : 'alarm_dialog'
                    });
                    UrlUtil.pushState('alarm_dialog', '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

                    var send_params = {
                        cache:false,
                        page : (!_.isUndefined(params.page)) ? params.page : 1,
                        authtoken  : userinfo.authtoken,
                        userid  : userinfo.userid
                    };
                    _.extend(send_params,params);

                    self.is_loading = true;
                    ProgressBar.show_progress();
                    DocAsyncTask.doGetContents(panel_setting, send_params, {
                        success: function(tpl, resp) {
                            ProgressBar.close_progress();

                            $('#myModal_docs_contents').html(tpl).promise().done(function(){
                                callback(resp);
                            });

                            setTimeout(function() {
                                self.is_loading = false;
                            }, 300);
                        },
                        fail : function(resp){
                            self.is_loading = false;
                            ProgressBar.close_progress();
                        }
                    });
                }
            },
            doList : function(params, callback){
                var self = this;

                if (!self.is_loading) 
                {
                    // panel
                    var panel_setting = app.docs.alarm.list; // SETTING VALUE
                    var panel = Panel.onStart(panel_setting);

                    // make url
                    UrlUtil.pushUrlParams({
                        mode : 'alarm_list'
                    });
                    UrlUtil.pushState('alarm_list', '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

                    var send_params = {
                        cache:false,
                        page : (!_.isUndefined(params.page)) ? params.page : 1,
                        authtoken  : userinfo.authtoken,
                        userid  : userinfo.userid
                    };
                    _.extend(send_params,params);

                    self.is_loading = true;
                    ProgressBar.show_progress();
                    DocAsyncTask.doGetContents(panel_setting, send_params, {
                        success: function(tpl, resp) {
                            ProgressBar.close_progress();

                            callback(tpl, resp);

                            setTimeout(function() {
                                self.is_loading = false;
                            }, 300);
                        },
                        fail : function(resp){
                            self.is_loading = false;
                            ProgressBar.close_progress();
                        }
                    });
                }
            },
            doUpdateRead: function() {
                var send_params = {
                    cache:false,
                    doc_id:'alarm/update',
                    authtoken  : userinfo.authtoken,
                    userid  : userinfo.userid
                };
                DocAsyncTask.doPostMessage(app.src+"/alarm/update_read", send_params, {
                        success : function(resp){
                            // app.log('resp : '+ resp);
                        },
                        fail : function(resp){
                            app.log(resp);
                        }
                    }
                );
            }
        };
        return AlarmActivity;
    });
