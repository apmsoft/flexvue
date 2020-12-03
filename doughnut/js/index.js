// 콜백함수
function onReady($, _, Backbone) {
    
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());
    // UrlUtil.pushState('index','',app.service_root_dir);

    // progress init
    ProgressBar.initialize('');

    // model panel
    app.initialize({
        "right" : {
            "panel": "right",
            "title": null,
            "frame": null,
            "template": app.assets+"/index/right#tpl_right",
            "value": null
        },
        "rightside" : {
            "panel": "rightside",
            "title": null,
            "frame": null,
            "template": app.assets+"/index/rightside#tpl_rightside",
            "value": null
        },
        "rightthird" : {
            "panel": "rightthird",
            "title": null,
            "frame": null,
            "template": app.assets+"/index/rightthird#tpl_rightthird",
            "value": null
        },
        "bottom" : {
            "panel": "bottom",
            "title": null,
            "frame": null,
            "template": app.assets+"/index/bottom#tpl_bottom",
            "value": null
        },
        "bottomside" : {
            "panel": "bottomside",
            "title": null,
            "frame": null,
            "template": app.assets+"/index/bottomside#tpl_bottomside",
            "value": null
        }
    });

    // class
    _.extend(Activity, {
        onCreate: function() {
            var self = this;

            // back key
            self.onBackPressed(function(k){
                app.log('이전' +k+'/ 현재 : '+UrlUtil.current_id);
            });

            // swipe
            self.setTouchSwipe({target: '#left','gesture': 'right',threshold: 130}, function() {
                DrawerNavigation.drawer_menu_opened();
            });
            
            self.setTouchSwipe({target: '#rightthird, #rightside, #right, #bottom','gesture': 'right',threshold: 100}, function() {
                history.go(-1);
            });

            // 뷰 실행
            self.onCreateView();
        },
        onCreateView: function() {
            var self = this;

            // event
            $('#myModal_back_button').on('click', function() {
                history.go(-1);
            });
            $('#bottom_back_button, #bottom_title').on('click', function() {
                history.go(-1);
            });
            $('#bottomside_back_button, #bottomside_title').on('click', function() {
                history.go(-1);
            });
            $('#right_back_button, #right_title').on('click', function() {
                history.go(-1);
            });
            $('#rightside_back_button, #rightside_title').on('click', function() {
                history.go(-1);
            });
            $('#rightthird_back_button, #rightthird_title').on('click', function() {
                history.go(-1);
            });

            // set language
            app.language = ''; //(device_info.lang != 'ko' ) ? device_info.lang : '';

            //  이벤트
            $('#btn-right').on('click', function(){
                self.doRun('right', function()
                {
                    // right side
                    $('#btn-rightside').on('click', function()
                    {
                        self.doRun('rightside', function()
                        {
                            // right third
                            $('#btn-rightthird').on('click', function(){
                                self.doRun('rightthird', null);
                            });
                        });
                    });
                });
            });

            $('#btn-bottom').on('click', function(){
                self.doRun('bottom', function(){
                    // bottom side
                    $('#btn-bottomside').on('click', function(){
                        self.doRun('bottomside', null);
                    });
                });
            });

            // scroll
            Activity.onScrollStateChanged('#left .fvue--layout--main', function(view, position) {
                app.log(position);
            });
        },

        // 프로그램 실행
        doRun : function(doc_id, callback){
            ProgressBar.show_progress();
            var self = this;

            // panel
            var panel_setting = app.docs[doc_id]; // SETTING VALUE
            var panel = Panel.onStart(panel_setting);

            // send params
            var send_params = {};

            // make url
            UrlUtil.pushUrlParams({
                mode : doc_id
            });
            UrlUtil.pushState('doSetting', '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

            //  template
            DocAsyncTask.doGetContents(panel_setting, send_params, {
                success: function(tpl, resp) {
                    $(panel.id+"_docs_contents").html(tpl).promise().done(function()
                    {
                        if(!_.isNull(callback) && _.isFunction(callback)){
                            callback();
                        }
                        ProgressBar.close_progress();
                    });
                },
                fail : function(resp){
                    ProgressBar.close_progress();
                }
            });
        }
    });

    // class start
    Activity.onCreate();

    // close progress
    Handler.post(function(){
        ProgressBar.close_progress();
    }, 200);
}