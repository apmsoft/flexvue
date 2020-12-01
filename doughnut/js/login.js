var http_referer = 'index.html';

// 콜백함수
function onReady($, _, Backbone) {
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());
    UrlUtil.pushState('login','',app.service_root_dir);

    // progress init
    ProgressBar.initialize('');

    // init
    app.initialize({
    });

    _.extend(Activity, {
        onCreate: function() {
            var self = this; 
        },
        onCreateView: function() {
            var self = this;

            // event
            $('#myModal_btn_close').on('click', function() {
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

            $('#btn-join').on('click', function(){
                window.location.href = "join.html";
            });

            $('#btn-findpwd').on('click', function(){
                window.location.href = "find_passwd.html";
            });

            if(!_.isUndefined( localStorage.getItem(app.name) )){
                $('#userid').val(localStorage.getItem(app.name));
            }

            $('#userid').focus();

            DocAsyncTask.doSubmit('#theLoginForm', function(form_params){
                var send_params = {
                    doc_id : 'auth/login'
                };
                _.extend(send_params, form_params);
        
                ProgressBar.show_progress();
                DocAsyncTask.doPostMessage(app.src+"/auth/login.regi", send_params, 
                    {
                        success : function(resp){
                            var set_data = {
                                userid : resp.msg.userid,
                                passwd : resp.msg.passwd,
                                fcm_token : $('#fcm_token').val(),
                                usertoken : resp.msg.usertoken,
                                name : resp.msg.name,
                                level : resp.msg.level
                            };
                            var json_string_data = JSON.stringify(set_data);
                            
                            if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.setSharedPreferences) ) {
                                if (isMobile.Android()) {
                                    window.android.setSharedPreferences(json_string_data, 'callbackSetSharedPreferences');
                                }else {
                                    var ios_set_data = {
                                        callback : 'callbackSetSharedPreferences'
                                    };
                                    _.extend(ios_set_data, set_data);
                                    webkit.messageHandlers.setSharedPreferences.postMessage(JSON.stringify(ios_set_data));
                                }
                            }
                        },
                        fail : function(resp){
                            ProgressBar.close_progress();

                            if(resp.msg_code !='w_stay_logged_in'){
                                if ( (typeof window.android !=='undefined') ) {
                                    if (isMobile.Android()) {
                                        // 메세지내용, 위치[ bottom | center } top ], 시간[ short | long ]
                                        window.android.showToast(resp.msg,'short', 'center');
                                    }
                                }else{
                                    alert(resp.msg);
                                }
                                
                                $('#theLoginForm #'+resp.fieldname).focus();
                            }else{
                                callbackSetSharedPreferences('');
                            }
                        }
                    }
                );
            });

            // 로그인버튼 활성화 체크
            var enable_submit_cnt = 0;
            $('#userid, #passwd').on('change keyup',function(e)
            {
                var userid_val = $('#userid').val();
                var passwd_val = $('#passwd').val();
                if(userid_val && userid_val !=''){
                    enable_submit_cnt = 1;
                }
                if(passwd_val && passwd_val !=''){
                    enable_submit_cnt = 2;
                }

                if(enable_submit_cnt >= 2){
                    $('#theLoginForm button[type="submit"]').removeAttr('disabled');
                }else{
                    $('#theLoginForm button[type="submit"]').attr('disabled','disabled');
                }
            });

            // auto login
            if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.getSharedPreferences) ) {
                if (isMobile.Android()) {
                    window.android.getSharedPreferences('callbackGetSharedPreferences');
                }else if (isMobile.iOS()) {
                    webkit.messageHandlers.getSharedPreferences.postMessage("callbackGetSharedPreferences");
                }
            }
        },
    });

    // layout
    Activity.onCreate();
    Activity.onCreateView();

    // back key
    Activity.onBackPressed();

    // swipe
    Activity.setTouchSwipe({target: '#rightside, #right, #bottom','gesture': 'right',threshold: 100}, function() {
        history.go(-1);
    });

    // close progress
    Handler.post(function(){
        ProgressBar.close_progress();
    }, 200);
}

function callbackSetSharedPreferences(jsonStr){
    ProgressBar.close_progress();

    if ( (typeof window.android !=='undefined') ) {
        if (isMobile.Android()) {
            // 메세지내용, 위치[ bottom | center } top ], 시간[ short | long ]
            window.android.showToast('울산 수소차셰어링에 오신것을 환영합니다!','short', 'center');
        }
    }
    app.go_url(http_referer);
}

function callbackGetSharedPreferences(jsonStr) 
{
    app.log(jsonStr);
    if(jsonStr && jsonStr !='')
    {
        var data = $.parseJSON(jsonStr);

        // ------------------
        // * 푸시키 추가 등록
        //-------------------
        if ( (typeof data.fcm_token !=='undefined') && (data.fcm_token && data.fcm_token != ""))
        {
            var push_os = 'a';
            if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers) ) {
                if (isMobile.Android()) {
                    push_os = 'a';
                }else {
                    push_os = 'i';
                }
            }

            // +  jQuery 이용 : 폼ID를 자신에게 맞게 변경하세요
            $('<input>').attr({type:'hidden', id:'fcm_token', name:'fcm_token', value: data.fcm_token}).appendTo('#theLoginForm');
            $('<input>').attr({type:'hidden', id:'os_type', name:'os_type', value: push_os}).appendTo('#theLoginForm');
        }

        if ( (typeof data.userid !=='undefined') && (data.userid && data.userid != "") ){
            // 로그인 폼 데이터 설정
            $('#userid').val(data.userid);  // id
            $('#passwd').val(data.passwd);     // password

            // 로그인 실행 : 폼 ID 를 자신에게 맞게 변경하세요
            window.setTimeout(function() {
                $('#theLoginForm button[type="submit"]').removeAttr('disabled');
                $('#theLoginForm').triggerHandler('submit');
            }, 500);
        }
    }
}

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
}