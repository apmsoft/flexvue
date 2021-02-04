// 콜백함수
const onReady = ($, _, Backbone) => 
{
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());

    // progress init
    ProgressBar.initialize('');

    // init
    app.initialize({
    });

    _.extend(Activity, {
        onCreate: function() {
            const self = this;

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
            const self = this;

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

            // 전송
            DocAsyncTask.doSubmit('#theFindPWDForm', function(form_params){
                let send_params = {
                };
                _.extend(send_params, form_params);
        
                ProgressBar.show_progress();
                DocAsyncTask.doPostMessage(app.src+"/auth/findpwd", send_params, 
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
                        app.go_url('/?act=login');
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
                        
                        $('#theFindPWDForm #'+resp.fieldname).focus();
                    }
                });
            });
        }
    });

    // layout
    Activity.onCreate();

    // close progress
    Handler.post(()=>{
        ProgressBar.close_progress();
    }, 200);
}

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
}