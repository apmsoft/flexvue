var http_referer = 'login.html';

var device_info = {
    fcm_token : '',
    os_type : '',
    lang : ''
};

var userinfo = {
    usertoken : '',
    name : '',
    userid : '',
    fid : '',
    authtoken : '',
    nickname : '',
    profile_image : ''
};

// 콜백함수
function onReady($, _, Backbone) {
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());
    UrlUtil.pushState('family','',app.service_root_dir);

    // progress init
    ProgressBar.initialize('');

    // init
    app.initialize({});

    _.extend(Activity, {
        onCreate: function() {
            var self = this;

            if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.getSharedPreferences) ) {
                if (isMobile.Android()) {
                    window.android.getSharedPreferences('callbackGetSharedPreferences');
                }else if (isMobile.iOS()) {
                    webkit.messageHandlers.getSharedPreferences.postMessage("callbackGetSharedPreferences");
                }
            }
        },
        onCreateView: function() {
            var self = this;

            // set language
            app.language = (device_info.lang != 'ko' ) ? device_info.lang : '';

            // load layout
            Runnable(function(){
                // 시스템 메세지
                app.parserResource ('/values/sysmsg', function(sysmsg)
                {
                    _.extend(app.lang, sysmsg);
                });

                // layout
                app.parserResource ('/layout/family', function(layout_info)
                {
                    _.extend(app.docs, layout_info);

                    self.doList();
                });
            });

            // event
            $('#myModal_btn_close').on('click', function() {
                history.go(-1);
            });
            $('#left_back_button, #left_title').on('click', function() {
                history.go(-1);
            });
            $('#btn_bottom_close, #bottom_title').on('click', function() {
                history.go(-1);
            });
            $('#right_back_button, #right_title').on('click', function() {
                history.go(-1);
            });
            $('#rightside_back_button, #rightside_title').on('click', function() {
                history.go(-1);
            });
        },

        doList : function(){
            var self = this;

            // panel
            var panel_setting = app.docs.family.list; // SETTING VALUE
            var panel = Panel.onStart(panel_setting);

            // send params
            var send_params = userinfo;
            _.extend(send_params, {
                cache : false
            });
            _.extend(send_params, device_info);

            // core
            DocAsyncTask.doGetContents(panel_setting, send_params,{
                success: function(tpl, resp) {
                    $('#left_docs_contents').html(tpl).promise().done(function()
                    {
                        if(resp.msg[0]['sex']=='a'){
                            self.doEdit(resp.msg[0]['fid'], function(){
                                self.doList();
                            });
                        }

                        // Handler.post(function(){
                        //     var delay_time = 0;
                        //     $('.family-row').each(function(){
                        //         var _this = $(this);
                        //         setTimeout( function(){ 
                        //             $(_this).animateCss('fadeIn'); 
                        //         }, delay_time);
                        //         delay_time += 150;
                        //     });
                        // },10);

                        // edit
                        $('.family-row').on('click', function(){
                            var this_fid = $(this).data('fid');
                            var int_fid = parseInt(this_fid) -1;

                            // animation
                            $(this).animateCss('bounce');

                            if(resp.msg[int_fid]['sex']=='a'){
                                self.doEdit(this_fid, function(){
                                    // 프롤필 이미지 업데이트
                                    var sex = resp.msg[int_fid].sex;
                                    var profile_image = (sex == 'f') ? 'images/nopimg_f.png' : 'images/nopimg_m.png';
                                    if(!_.isUndefined(resp.msg[int_fid].profile_image) && resp.msg[int_fid].profile_image !=''){
                                        profile_image = app.host_url+resp.msg[int_fid].profile_image;
                                    }
                                    userinfo.profile_image = profile_image;
                                    userinfo.fid = ""+this_fid;
                                    userinfo.nickname = resp.msg[int_fid].nickname;
                                    
                                    // 프리퍼런스 저장
                                    setSharedPreferences();
                                });
                            }else{
                                // 프롤필 이미지 업데이트
                                var sex = resp.msg[int_fid].sex;
                                var profile_image = (sex == 'f') ? 'images/nopimg_f.png' : 'images/nopimg_m.png';
                                if(!_.isUndefined(resp.msg[int_fid].profile_image) && resp.msg[int_fid].profile_image !=''){
                                    profile_image = app.host_url+resp.msg[int_fid].profile_image;
                                }
                                userinfo.profile_image = profile_image;
                                userinfo.fid           = ""+this_fid;
                                userinfo.nickname      = resp.msg[int_fid].nickname;

                                // 프리퍼런스 저장
                                setSharedPreferences();
                            }
                        });

                        $('.family-edit').on('click', function(){
                            var this_fid = $(this).data('fid');
                            self.doEdit(this_fid, function(){
                                self.doList();
                            });
                        });

                        // post
                        $('.family-add-button').on('click', function(){
                            var this_fid = $(this).data('fid');
                            self.doPost(this_fid, function(){
                                self.doList();
                            });
                        });

                        // authtoken
                        userinfo.authtoken = resp.authtoken;
                    });
                },

                fail : function(resp){
                    ProgressBar.close_progress();
                    alert(resp.msg);
                }
            });
        },

        doPost : function(fid,callback){
            var self = this;

            ProgressBar.show_progress();

            // panel
            var panel_setting = app.docs.family.post; // SETTING VALUE
            var panel = Panel.onStart(panel_setting);

            // send params
            var send_params = userinfo;
            _.extend(send_params, {
                cache : false,
                fid : fid
            });

            // make url
            UrlUtil.pushUrlParams({
                mode : 'post',
                fid : fid
            });
            UrlUtil.pushState('fimailPost', '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

            // core
            DocAsyncTask.doGetContents(panel_setting, send_params,{
                success: function(tpl, resp) {
                    $(panel.id+'_docs_contents').html(tpl).promise().done(function()
                    {
                        // 성별
                        $('.btn-sex').on('click', function(){
                            var this_sex = $(this).data('sex');
                            $('#sex').val(this_sex);
                            if(this_sex == 'f'){
                                $('button[data-sex="m"]').removeClass("btn-dark active").addClass("btn-outline-dark");
                                $('button[data-sex="f"]').addClass("btn-dark active");
                            }else if(this_sex == 'm'){
                                $('button[data-sex="f"]').removeClass("btn-dark active").addClass("btn-outline-dark");
                                $('button[data-sex="m"]').addClass("btn-dark active");
                            }
                        });

                        // submit
                        DocAsyncTask.doSubmit('#theFamilyPostForm', function(form_params){
                            var send_params = userinfo;
                            _.extend(send_params, form_params);

                            DocAsyncTask.doPostMessage(app.src+"/family/insert", send_params, {
                                success : function(resp){
                                    ProgressBar.close_progress();
                                    history.go(-1);
            
                                    // callback
                                    if(!_.isNull(callback) && _.isFunction(callback)){
                                        callback();
                                    }
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

                                    //set focus
                                    if(!_.isUndefined(resp.fieldname)){
                                        $(panel.id+'_docs_contents #theFamilyEditForm #'+resp.fieldname).focus();
                                    }
                                }
                            });
                        });

                        // close progress
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
        },

        doEdit : function(fid,callback){
            var self = this;

            ProgressBar.show_progress();

            // panel
            var panel_setting = app.docs.family.edit; // SETTING VALUE
            var panel = Panel.onStart(panel_setting);

            // send params
            var send_params = userinfo;
            _.extend(send_params, {
                cache : false,
                fid : fid
            });

            // make url
            UrlUtil.pushUrlParams({
                mode : 'edit',
                fid : fid
            });
            UrlUtil.pushState('fimailEdit', '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

            // core
            DocAsyncTask.doGetContents(panel_setting, send_params,{
                success: function(tpl, resp) {
                    $(panel.id+'_docs_contents').html(tpl).promise().done(function()
                    {
                        // 내프로필사진
                        $('#myprofile_image').on('click',function(){
                            self.doEditImage(fid, function(){
                                history.go(-1);
            
                                // callback
                                if(!_.isNull(callback) && _.isFunction(callback)){
                                    callback();
                                }
                            });
                        });

                        // 성별
                        $('.btn-sex').on('click', function(){
                            var this_sex = $(this).data('sex');
                            $('#sex').val(this_sex);
                            if(this_sex == 'f'){
                                $('button[data-sex="m"]').removeClass("btn-dark active").addClass("btn-outline-dark");
                                $('button[data-sex="f"]').addClass("btn-dark active");
                            }else if(this_sex == 'm'){
                                $('button[data-sex="f"]').removeClass("btn-dark active").addClass("btn-outline-dark");
                                $('button[data-sex="m"]').addClass("btn-dark active");
                            }
                        });

                        // submit
                        DocAsyncTask.doSubmit('#theFamilyEditForm', function(form_params){
                            var send_params = userinfo;
                            _.extend(send_params, form_params);
                            DocAsyncTask.doPostMessage(app.src+"/family/update", send_params, {
                                success : function(resp){
                                    ProgressBar.close_progress();
                                    history.go(-1);
            
                                    // callback
                                    if(!_.isNull(callback) && _.isFunction(callback)){
                                        callback();
                                    }
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

                                    //set focus
                                    if(!_.isUndefined(resp.fieldname)){
                                        $(panel.id+'_docs_contents #theFamilyEditForm #'+resp.fieldname).focus();
                                    }
                                }
                            });
                        });

                        // close progress
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
        },
        doEditImage: function(fid, callback) {
            ProgressBar.show_progress();
            var self = this;

            // panel
            var panel_setting = app.docs.family.image; // SETTING VALUE
            var panel = Panel.onStart(panel_setting);

            // send params
            var send_params = {
                doc_id : "member/image",
                usertoken : userinfo.usertoken,
                userid:userinfo.userid,
                fid : fid
            };

            // url
            UrlUtil.pushState('profileeditimage', '', app.service_root_dir+'?'+$.param({mode:'membereditimage'}));

            // DOC REQUEST
            DocAsyncTask.doGetContents(panel_setting, send_params, {
                success: function(tpl, resp) {
                    $(panel.id+"_docs_contents").html(tpl).promise().done(function()
                    {
                        // 
                        DocAsyncTask.doSubmit("#theEditImageForm", function(params){
                            var send_params = {
                                doc_id : 'member/image_update',
                                usertoken : userinfo.usertoken,
                                userid:userinfo.userid,
                                fid : fid
                            };
                            _.extend(send_params,params);
                            DocAsyncTask.doPostMessage(app.src+"/document/stack", send_params, {
                                success : function(resp){
                                    ProgressBar.close_progress();
                                    
                                    history.go(-1);
            
                                    // callback
                                    if(!_.isNull(callback) && _.isFunction(callback)){
                                        callback();
                                    }
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
            
                                    if(!_.isUndefined(resp.fieldname)){
                                        $('#'+resp.fieldname).focus();
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
    });

    // layout
    Activity.onCreate();

    // back key
    Activity.onBackPressed(function(k){
        app.log('이전' +k+'/ 현재 : '+UrlUtil.current_id);
        if(k == 'family')
        {
            // 앱종료 alert 창 띄우기
            navigator.notification.confirm(
                app.lang.i_exit_app, // message
                function(idx){
                    if(idx == "1"){
                        
                    }else if(idx == "2"){
                        if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers) ) {
                            if (isMobile.Android()) {
                                window.android.closeApp();
                            }
                        }
                    }
                 },            // callback to invoke with index of button pressed
                '',           // title
                app.lang['alert_button']
            );
        }
    });

    // swipe
    Activity.setTouchSwipe({target: '#rightside, #right, #bottom','gesture': 'right',threshold: 100}, function() {
        history.go(-1);
    });

    // close progress
    Handler.post(function(){
        ProgressBar.close_progress();
    }, 200);
}

function setSharedPreferences(){    
    if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.setSharedPreferences) ) {
        if (isMobile.Android()) 
        {
            var json_string_data = JSON.stringify(userinfo);
            window.android.setSharedPreferences(json_string_data, 'callbackSetSharedPreferences');
        }else {
            var ios_set_data = {
                callback : 'callbackSetSharedPreferences'
            };
            _.extend(ios_set_data, userinfo);
            webkit.messageHandlers.setSharedPreferences.postMessage(JSON.stringify(ios_set_data));
        }
    }
}


function callbackSetSharedPreferences(jsonStr){
    ProgressBar.close_progress();
    app.go_url('index.html');
}

// callback 디바이스 SharedPreferences
function callbackGetSharedPreferences(jsonStr) 
{
    if(jsonStr && jsonStr !='')
    {
        var data = $.parseJSON(jsonStr);
        
        // 푸시토큰
        if (!_.isUndefined(data.userid)){
            userinfo.usertoken = data.usertoken;
            userinfo.name      = data.name;
            userinfo.fid       = data.fid;
            userinfo.userid    = data.userid;

            // 디바이스 정보
            device_info.lang = data.lang;
            device_info.fcm_token = data.fcm_token;
            device_info.os_type = data.os_type;

            // 내 정보 가져오기
            Activity.onCreateView();
        }
    }
}


if ( (typeof window.android !=='undefined')){
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
    if ( (typeof window.android !=='undefined')){
        screen.orientation.lock('portrait');
    }
}