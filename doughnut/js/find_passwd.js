var http_referer = 'login.html';

var device_info = {
    auth_token  : 'dPtncjsekqnstlswlddfsferewfsfs939flslfdhrgkskslawprpdmsgPfmfqpvntldjdmsgPdmldmsgPfmfejgkthth'
};

// 콜백함수
function onReady($, _, Backbone) {
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());
    UrlUtil.pushState('fwd','',app.service_root_dir);

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
            $('#left_back_button, #left_title').on('click', function() {
                history.go(-1);
            });
            $('#btn_bottom_close, #bottom_title').on('click', function() {1
                history.go(-1);
            });
            $('#right_back_button, #right_title').on('click', function() {
                history.go(-1);
            });
            $('#rightside_back_button, #rightside_title').on('click', function() {
                history.go(-1);
            });

            $('#btn-sms-authreq').on('click', function()
            {
                ProgressBar.show_progress();

                var this_cellphone = $('#cellphone').val();
                if(this_cellphone ==''){
                    ProgressBar.close_progress();
                    alert('휴대전화번호를 입력하세요');
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
                        }else{
                            alert(resp.msg);
                        }
                        $('#sms_authno').removeAttr('readonly');
                        $('#ssid_authno').val(resp.ssid_authno);
                        $('#new_passwd').removeAttr('readonly');
                        $('#re_new_passwd').removeAttr('readonly');
                    },
                    fail : function(resp){
                        ProgressBar.close_progress();
                        alert(resp.msg);
                    }
                });
            });

            DocAsyncTask.doSubmit("#theFindPasswdForm", function(params){
                var send_params = {
                };
                _.extend(send_params,params);
                DocAsyncTask.doPostMessage(app.src+"/member/user_find_pwd.regi", send_params, {
                    success : function(resp){
                        ProgressBar.close_progress();
                        alert("비밀번호 찾기를 성공하셨습니다.");
                        app.go_url(http_referer);
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

            $('#name').focus();
        },
    });

    // layout
    Activity.onCreate();
    Activity.onCreateView();

    // back key
    Activity.onBackPressed(function(){
        history.go(-1);
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

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
}