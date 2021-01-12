var http_referer = 'index.html';

// 콜백함수
function onReady($, _, Backbone) {
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());

    // progress init
    ProgressBar.initialize('');

    // init
    app.initialize({
    });

    _.extend(Activity, {
        onCreate: function() {
            var self = this;

            // back key
            self.onBackPressed();

            // swipe
            // self.setTouchSwipe({target: '#left','gesture': 'right',threshold: 130}, function() {
            //     DrawerNavigation.drawer_menu_opened();
            // });
            
            self.setTouchSwipe({target: '#rightthird, #rightside, #right, #bottomside, #bottom','gesture': 'right',threshold: 100}, function() {
                history.go(-1);
            });

            // 뷰 실행
            self.onCreateView();
        },
        onCreateView: function() {
            var self = this;

            // event
            $('#drawer_menu_back_button, #drawer_menu_title, #drawer_menu').on('click', function() {
                history.go(-1);
            });
            $('#bottom_back_button, #bottom_title').on('click', function() {
                history.go(-1);
            });
            $('#bottomside_back_button, #bottomside_title').on('click', function() {
                history.go(-1);
            });
            $('#bottomthird_back_button, #bottomthird_title').on('click', function() {
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
            $('#left_back_button, #left_title').on('click', function() {
                history.go(-1);
            });

            // 약관
            // 전체 약관
            $('#chkall').on('click', function()
            {
                var _chk_flag = false;
                if($(this).is(":checked")){
                    _chk_flag = true;
                }
                
                $('.chkrule').each(function() {
                    var cur = $(this);
                    if( _chk_flag ){
                        $(cur).prop("checked", true);
                        $(cur).val('y');
                    }else{
                        $(cur).prop("checked", false);
                        $(cur).val('n');
                    }
                });
            });

            // 개별체크
            var chkrule_total = $('.chkrule').length;
            $('.chkrule').on('click', function(e)
            {
                var cur = $(this);
                if($(cur).is(":checked")){
                    $(cur).val('y');
                }else{
                    $(cur).val('n');
                }

                // 전체동의 버튼 활성화 여부
                var chk_count = 0;
                $('.chkrule').each(function() {
                    if( $(this).is(":checked") ){
                        chk_count++;
                    }
                });

                if(chk_count == chkrule_total){
                    $('#chkall').prop("checked", true);
                }else{
                    $("#chkall").prop("checked", false);
                }
            });

            // 약관보기
            $('.show-rules').on('click', function(e){
                var this_id = $(this).data('id');
                require([app.assets+'/js/rule.js'], function(RuleActivity) {
                    // var rkey = this_id.replace('cp-','');
                    RuleActivity.doRule(this_id);
                });
            });

            // 전송
            DocAsyncTask.doSubmit('#theJoinForm', function(form_params){
                var send_params = {
                };
                _.extend(send_params, form_params);
        
                ProgressBar.show_progress();
                DocAsyncTask.doPostMessage(app.src+"/auth/join", send_params, 
                {
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
                        app.go_url('./?act=login');
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
                        
                        $('#theJoinForm #'+resp.fieldname).focus();
                    }
                });
            });
        }
    });

    // layout
    Activity.onCreate();

    // close progress
    Handler.post(function(){
        ProgressBar.close_progress();
    }, 200);
}

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
}