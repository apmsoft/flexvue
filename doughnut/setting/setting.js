define(['jquery','underscore','backbone','lazyload'],
    function($,_,Backbone,lazyload) {

        // contents
        var SettingActivity = {
            version: '1',

            init : function(){
                var self = this;
                app.parserResource ('/layout/setting', function(layout_info)
                {
                    _.extend(app.docs, layout_info);

                    self.doSetting();
                });
            },
            doSetting: function() {
                
                ProgressBar.show_progress();
                var self = this;

                // panel
                var panel_setting = app.docs.setting.doset; // SETTING VALUE
                var panel = Panel.onStart(panel_setting);

                // send params
                var send_params = userinfo;
                _.extend(send_params, {
                    cache : false
                });

                // make url
                UrlUtil.pushUrlParams({
                    mode : 'setting'
                });
                UrlUtil.pushState('doSetting', '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

                // DOC REQUEST
                DocAsyncTask.doGetContents(panel_setting, send_params, {
                    success: function(tpl, resp) {
                        $(panel.id+"_docs_contents").html(tpl).promise().done(function()
                        {
                            // 약관
                            $('.show-rules').on('click', function(e){
                                ProgressBar.show_progress();
                                e.preventDefault();
                                var m = $(this).data("id");

                                // panel
                                var panel_setting = app.docs.setting[m];
                                var panel = Panel.onStart(panel_setting);

                                // url
                                UrlUtil.pushState(m, '', app.service_root_dir+'?'+$.param({mode:m})+'#'+m);
                                DocAsyncTask.doGetContents(panel_setting, {}, {
                                    success: function(tpl, resp) {
                                        ProgressBar.close_progress();
                                    }
                                });
                            });

                            // 내프로필사진 보여주기
                            $('#setting-profile_image').css('backgroundImage', "url("+userinfo.profile_image+")");

                            // 사용자 선택
                            $('#myprofile_image, #btn-profile-edit').on('click', function(){
                                app.go_url("family.html");
                            });

                            // 공지/뉴스
                            $('#btn-setting-notice').on('click', function(){
                                require([app.assets+'/notice/notice.min.js'], function(NoticeActivity) {
                                    NoticeActivity.init();
                                });
                            });

                            // 운동기록
                            $('#btn-trading-history').on('click', function(){
                                require([app.assets+'/graph/graph.min.js'], function(GraphActivity) {
                                    GraphActivity.init(function(){
                                        GraphActivity.doRun();
                                    });
                                });
                            });

                            // 알림 수신 여부
                            $('#is_push').unbind('click');
                            $('#is_push').on('click', function() 
                            {
                                ProgressBar.show_progress();
                                var is_push_v = 'y';
                                if ($(this).parent().hasClass('is-checked')) {
                                    // alert($(this).attr('id'));
                                    $(this).parent().removeClass("is-checked");
                                    $(this).attr('checked', false);
                                    is_push_v = 'n';
                                    $('#is_push').val('n');
                                } else {
                                    $(this).parent().addClass("is-checked");
                                    $(this).attr('checked', true);
                                    $('#is_push').val('y');
                                    is_push_v = 'y';
                                }

                                // 푸싱 수신 여부 저장
                                var _send_params = userinfo;
                                _.extend(_send_params, {
                                    cache : false,
                                    is_push : is_push_v
                                });
                                DocAsyncTask.doPostMessage(app.src+"/setting/is_push.regi", _send_params, {
                                    success : function(resp){
                                        ProgressBar.close_progress();
                                    },
                                    fail : function(resp){
                                        ProgressBar.close_progress();
                                        if ( (typeof window.android !=='undefined') ) {
                                            if (isMobile.Android()) {
                                                // 메세지내용, 위치[ bottom | center } top ], 시간[ short | long ]
                                                window.android.showToast(resp.msg,'short', 'center');
                                            }
                                        }else{
                                            alert(resp.msg);
                                        }
                                    }
                                });
                            });

                            // 지도 뷰 설정
                            $('#mkt').unbind('click');
                            $('#mkt').on('click', function() 
                            {
                                ProgressBar.show_progress();
                                var mkt_val = 'y';
                                if ($(this).parent().hasClass('is-checked')) {
                                    // alert($(this).attr('id'));
                                    $(this).parent().removeClass("is-checked");
                                    $(this).attr('checked', false);
                                    mkt_val = 'n';
                                    $('#mkt').val('n');
                                } else {
                                    $(this).parent().addClass("is-checked");
                                    $(this).attr('checked', true);
                                    $('#mkt').val('y');
                                    mkt_val = 'y';
                                }

                                // 푸싱 수신 여부 저장
                                var _send_params = userinfo;
                                _.extend(_send_params, {
                                    cache : false,
                                    is_marketing : mkt_val
                                });
                                DocAsyncTask.doPostMessage(app.src+"/setting/is_marketing.regi", _send_params, {
                                    success : function(resp){
                                        ProgressBar.close_progress();
                                    },
                                    fail : function(resp){
                                        ProgressBar.close_progress();
                                        if ( (typeof window.android !=='undefined') ) {
                                            if (isMobile.Android()) {
                                                // 메세지내용, 위치[ bottom | center } top ], 시간[ short | long ]
                                                window.android.showToast(resp.msg,'short', 'center');
                                            }
                                        }else{
                                            alert(resp.msg);
                                        }
                                    }
                                });
                            });

                            ProgressBar.close_progress();
                        });
                    },
                    fail : function(resp){
                        ProgressBar.close_progress();
                        if ( (typeof window.android !=='undefined') ) {
                            if (isMobile.Android()) {
                                // 메세지내용, 위치[ bottom | center } top ], 시간[ short | long ]
                                window.android.showToast(resp.msg,'short', 'center');
                            }
                        }else{
                            alert(resp.msg);
                        }
                    }
                });
            }
        };

        return SettingActivity;
    });
