var http_referer = 'login.html';

var device_info = {
    auth_token  : 'gksksladlwntldmsgPrkskfmfenfmslsorpdmsgPrksjaclehdkwnslarkatkgkqslek',
    fcm_token : '',
    os_type : '',
    lang : ''
};

// 콜백함수
function onReady($, _, Backbone) {
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());

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
                app.parserResource ('/layout/join', function(layout_info)
                {
                    _.extend(app.docs, layout_info);

                    // core
                    DocAsyncTask.doGetContents(app.docs.join, {},{
                        success: function(tpl, resp) {
                            $('#left_docs_contents').html(tpl).promise().done(function()
                            {
                                require(['swiper'], function(Swiper)
                                {
                                    var swiper = new Swiper('.swiper-container', {
                                        pagination: {
                                          el: '.swiper-pagination',
                                          type: 'progressbar',
                                        },
                                        allowSlidePrev : false,
                                        noSwiping : true,
                                        noSwipingClass : 'swiper-no-swiping',
                                        navigation: {
                                        //   nextEl: '.swiper-button-next',
                                        //   prevEl: '.swiper-button-prev',
                                        }
                                    });

                                    // lock
                                    swiper.allowSlideNext = false;

                                    $('#cellphone, #sms_authno, #name').on('change keyup',function(e)
                                    {
                                        var mEvent = e || window.event;
                                        var mPressed = mEvent.keyCode || mEvent.which;

                                        var this_val = $(this).val();
                                        var this_input_id = $(this).attr('id');
                                        var this_btn_id = '';
                                        if(this_input_id == 'cellphone'){
                                            this_btn_id = '#btn-sms-authreq';
                                        }else if(this_input_id == 'sms_authno'){
                                            this_btn_id = '#btn-sms-authno-next';
                                        }else if(this_input_id == 'name'){
                                            this_btn_id = '#btn-name-next';
                                        }

                                        if(!_.isUndefined(mPressed)){
                                            if(this_val && this_val !=''){
                                                $(this_btn_id).removeAttr('disabled');
                                            }else{
                                                $(this_btn_id).attr('disabled','disabled');
                                            }
                                        }else{
                                            $(this_btn_id).trigger('click');
                                        }
                                    });

                                    // 이름 다음버튼
                                    $('#btn-name-next').on('click', function(e)
                                    {
                                        var mEvent = e || window.event;
                                        var mPressed = mEvent.keyCode || mEvent.which;

                                        DocAsyncTask.doPostMessage(app.src+"/auth/chk_name", {
                                            auth_token : device_info.auth_token,
                                            name : $('#name').val()
                                        }, {
                                            success : function(resp){
                                                ProgressBar.close_progress();

                                                if(!_.isUndefined(mPressed)){
                                                    // swiper
                                                    swiper.allowSlideNext = true;
                                                    swiper.slideNext();
                                                    swiper.allowSlideNext = false;
                                                }

                                                // 버튼 활성화
                                                $('button[type="submit"]').removeAttr('disabled');
                                            },
                                            fail : function(resp){
                                                ProgressBar.close_progress();
                                                alert(resp.msg);
                                            }
                                        });
                                    });

                                    // 인증번호입력 다음 버튼
                                    $('#btn-sms-authno-next').on('click', function(e)
                                    {
                                        var mEvent = e || window.event;
                                        var mPressed = mEvent.keyCode || mEvent.which;

                                        DocAsyncTask.doPostMessage(app.src+"/auth/chk_smstoken", {
                                            auth_token : device_info.auth_token,
                                            cellphone : $('#cellphone').val(),
                                            sms_authno : $('#sms_authno').val(),
                                            ssid_authno : $('#ssid_authno').val()
                                        }, {
                                            success : function(resp){
                                                ProgressBar.close_progress();

                                                if(!_.isUndefined(mPressed)){
                                                    // swiper
                                                    swiper.allowSlideNext = true;
                                                    swiper.slideNext();
                                                    swiper.allowSlideNext = false;
                                                }
                                            },
                                            fail : function(resp){
                                                ProgressBar.close_progress();
                                                if(resp.msg_code == 'w_duplicate_id')
                                                {
                                                    var set_data = {
                                                        userid : resp.msg.userid,
                                                        fcm_token : device_info.fcm_token,
                                                        os_type : device_info.os_type,
                                                        usertoken : resp.msg.usertoken,
                                                        is_finish_guide : 'y',
                                                        lang : device_info.lang,
                                                        name : resp.msg.name
                                                    };
                                                    var json_string_data = JSON.stringify(set_data);
                                                    alert(json_string_data);
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
                                                }else{
                                                    alert(resp.msg);
                                                }
                                            }
                                        });
                                    });

                                    // 약관보기
                                    $('.show-rules').on('click', function(e){
                                        ProgressBar.show_progress();
                                        e.preventDefault();
                                        var m = $(this).data("id");

                                        // panel
                                        var panel_setting = app.docs[m];
                                        var panel = Panel.onStart(panel_setting);

                                        // url
                                        UrlUtil.pushState(m, '', app.service_root_dir+'?'+$.param({mode:m})+'#'+m);
                                        DocAsyncTask.doGetContents(panel_setting, {}, {
                                            success: function(tpl, resp) {
                                                ProgressBar.close_progress();
                                            }
                                        });
                                    });

                                    // 전체 약관
                                    $('#chkall').on('click', function(){
                                        if( $(this).hasClass('active') ){ //전체선택
                                            $(this).removeClass('active');

                                            $('.chkid').each(function() {
                                                var data_id = $(this).data('id');
                                                $(this).removeClass('active');
                                                $('#'+data_id).val('n');
                                            });
                                        }else{ // 전체선택            
                                            $(this).addClass('active');
                                            $('.chkid').each(function() {
                                                var data_id = $(this).data('id');
                                                $(this).addClass('active');
                                                $('#'+data_id).val('y');
                                            });
                                        }
                                    });

                                    // 개별체크
                                    $('.chkid').on('click', function(e)
                                    {
                                        var data_id = $(this).data('id');
                                        if($(this).hasClass('active')){
                                            $(this).removeClass('active');
                                            $('#'+data_id).val('n');
                                        }else{
                                            $(this).addClass('active');
                                            $('#'+data_id).val('y');
                                        }

                                        // 전체동의 버튼 활성화 여부
                                        var chk_count = 0;
                                        $('.chkid').each(function() {
                                            if( $(this).hasClass('active') ){
                                                chk_count++;
                                            }
                                        });

                                        if(chk_count==3){
                                            $('#chkall').addClass('active');
                                        }else{
                                            $("#chkall").removeClass('active');
                                        }
                                    });

                                    // 문자인증번호 요청
                                    $('#btn-sms-authreq').on('click', function(e)
                                    {
                                        ProgressBar.show_progress();

                                        var mEvent = e || window.event;
                                        var mPressed = mEvent.keyCode || mEvent.which;

                                        var this_cellphone = $('#cellphone').val();
                                        if(this_cellphone ==''){
                                            ProgressBar.close_progress();
                                            alert(app.lang.w_empty_cellphone);
                                            return;
                                        }

                                        DocAsyncTask.doPostMessage(app.src+"/auth/sms_auth", {
                                            auth_token : device_info.auth_token,
                                            cellphone : this_cellphone
                                        }, {
                                            success : function(resp){
                                                ProgressBar.close_progress();

                                                if ( (typeof window.android !=='undefined') ) {
                                                    if (isMobile.Android()) {
                                                        // 메세지내용, 위치[ bottom | center } top ], 시간[ short | long ]
                                                        window.android.showToast(resp.msg,'short', 'center');
                                                    }
                                                }
                                                $('#sms_authno').removeAttr('readonly');
                                                $('#ssid_authno').val(resp.ssid_authno);

                                                if(!_.isUndefined(mPressed)){
                                                    // swiper
                                                    swiper.allowSlideNext = true;
                                                    swiper.slideNext();
                                                    swiper.allowSlideNext = false;
                                                }
                                            },
                                            fail : function(resp){
                                                ProgressBar.close_progress();
                                                alert(resp.msg);
                                            }
                                        });
                                    });

                                    DocAsyncTask.doSubmit("#theJoinForm", function(params){
                                        var send_params = {
                                            lang : device_info.lang,
                                            fcm_token : device_info.fcm_token,
                                            os_type : device_info.os_type
                                        };
                                        _.extend(send_params,params);
                                        DocAsyncTask.doPostMessage(app.src+"/member/join_insert", send_params, {
                                            success : function(resp){
                                                ProgressBar.close_progress();

                                                var set_data = {
                                                    userid : resp.msg.userid,
                                                    fcm_token : device_info.fcm_token,
                                                    os_type : device_info.os_type,
                                                    usertoken : resp.msg.usertoken,
                                                    is_finish_guide : 'y',
                                                    lang : device_info.lang,
                                                    name : resp.msg.name
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

                                    // close progress
                                    Handler.post(function(){
                                        ProgressBar.close_progress();
                                    }, 200);
                                });
                            });
                        },

                        fail : function(resp){
                            ProgressBar.close_progress();
                        }
                    });
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
    });

    // layout
    Activity.onCreate();

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

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
}

function callbackSetSharedPreferences(jsonStr){
    ProgressBar.close_progress();

    app.go_url('family.html');
}

// callback 디바이스 SharedPreferences
function callbackGetSharedPreferences(jsonStr) 
{
    app.log(jsonStr);
    if(jsonStr && jsonStr !='')
    {
        var data = $.parseJSON(jsonStr);

        // 언어설정
        device_info.lang = data.lang;
        Activity.onCreateView();

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
            device_info.fcm_token = data.fcm_token;
            device_info.os_type = push_os;
        }
    }
}