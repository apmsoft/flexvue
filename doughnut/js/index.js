var device_info = {
    lang : ''
};

var userinfo = {
    usertoken : '',
    name : '',
    fid : '',
    userid : '',
    authtoken : '',
    nickname : '',
    profile_image : ''
};

// 현재 탭메뉴 위치
var pre_menu_id = '';

// 탭메뉴 새로 고침을 위한 스크롤 포지션
var scroll_top = 0;
var MySwiper = null;
var MyChart = null;
var is_loading_product = false;

// trading view
var playerIntervalObj =null;
var playerHistoryEnter = 0; // 운동뷰 진입위치[0:최근운동이력, 1:운동하기]
var playerIntervalInfo = {
    id : 0,
    cpercent : 0, // 진행률(%)
    ctime : 0,  // 총소요시간(초)
    panic_before : -1, // 운동전 통증
    panic_after : -1 // 운동후 통증
};

// 콜백함수
function onReady($, _, Backbone) {
    
    // urlutil init
    UrlUtil.initialize(UrlUtil.getURL2JSON());
    UrlUtil.pushState('index','',app.service_root_dir);

    // progress init
    ProgressBar.initialize('');

    // init
    app.initialize({});

    _.extend(Activity, {
        onCreate: function() {
            var self = this;

            // require(['swiper','chartjs'], function(Swiper, Chart)
            // {
            //     MySwiper = Swiper;
            //     MyChart = Chart;
            // });

            // // 정보 가져오기
            // if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.getSharedPreferences) ) {
            //     if (isMobile.Android()) {
            //         window.android.getSharedPreferences('callbackGetSharedPreferences');
            //     }else if (isMobile.iOS()) {
            //         webkit.messageHandlers.getSharedPreferences.postMessage("callbackGetSharedPreferences");
            //     }
            // }

            // 디바이스 정보
            // if ( (window.webkit && window.webkit.messageHandlers.getDevice) ) {
            //     if (isMobile.iOS()) {
            //         webkit.messageHandlers.getDevice.postMessage('callbackDevice');
            //     }
            // }

            // 내 정보 가져오기
            Activity.onCreateView();
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
            $('#rightthird_back_button, #rightthird_title').on('click', function() {
                history.go(-1);
            });

            // set language
            app.language = ''; //(device_info.lang != 'ko' ) ? device_info.lang : '';

            // load layout
            Runnable(function(){
                // 시스템 메세지
                app.parserResource ('/values/sysmsg', function(sysmsg)
                {
                    _.extend(app.lang, sysmsg);
                });

                // layout
                app.parserResource ('/layout/index', function(layout_info)
                {
                    _.extend(app.docs, layout_info);

                    // panel
                    var panel_setting = app.docs.index.frame; // SETTING VALUE
                    var panel = Panel.onStart(panel_setting);

                    // core
                    DocAsyncTask.doGetContents(panel_setting, {},{
                        success: function(tpl, resp) {
                            $('#left_docs_contents').html(tpl).promise().done(function(){

                            });
                        },

                        fail : function(resp){
                            ProgressBar.close_progress();
                            alert(resp.msg);
                        }
                    });
                });
            });

            // 사용자 선택
            $('#btn-right').on('click', function(){
                require([app.assets+'/setting/setting.js'], function(SettingActivity) {
                    SettingActivity.init();
                });
            });

            $('#btn-bottom').on('click', function(){
                
            });

            // 알람
            $('#btn_alarm').on('click', function()
            {
                // require([app.assets+'/alarm/alarm.min.js'], function( AlarmActivity) 
                // {
                //     AlarmActivity.init(function(){
                //         AlarmActivity.doListDialog({page : 1},function(resp){
                //             $('.alarm-dialog-row').on('click',function(e){
                //                 e.preventDefault();

                //                 var this_param = $(this).data('param');
                //                 history.go(-1);
    
                //                 Handler.post(function(){
                //                     if(this_param == 'fu3_bbs_notice'){
                //                         require([app.assets+'/notice/notice.min.js'], function(NoticeActivity) {
                //                             NoticeActivity.init();
                //                         });
                //                     }
                //                 },100);
                //             });
    
                //             AlarmActivity.doUpdateRead();
                //         });
                //     });
                // });
            });

            // popup
            // Handler.post(function(){
            //     require([app.assets+'/popup/popup.min.js'], function(PopupActivity) {
            //         PopupActivity.initialize();
            //     });
            // },700);

            // scroll
            Activity.onScrollStateChanged('#left .fvue--layout--main', function(view, position) {
                // Activity.runScanSpyCapture('#left', '.spy', position, function(obj, spyid){
                //     var cur = obj;
                //     Handler.post(function(){
                //         $(cur).animateCss('bounceIn');
                //     },500);
                // });
                app.log(position);
                
                // if (position < 5) {
                // }else if (position > 90) {
                //     if(!is_loading_product){
                //         // app.log('call do product --> '+position);
                //         is_loading_product = true;
                //         self.doProduct();
                //     }
                // }
            });
        }
    });

    // layout
    Activity.onCreate();

    // back key
    Activity.onBackPressed(function(k){
        app.log('이전' +k+'/ 현재 : '+UrlUtil.current_id);
    });

    // swipe
    Activity.setTouchSwipe({target: '#left','gesture': 'right',threshold: 130}, function() {
        DrawerNavigation.drawer_menu_opened();
    });
    
    Activity.setTouchSwipe({target: '#rightthird, #rightside, #right, #bottom','gesture': 'right',threshold: 100}, function() {
        history.go(-1);
    });

    // alarm
    // AlarmCount.initialize(userinfo);
    // AlarmCount.run(function(resp){
        // Handler.post(function(){
        //     if (!_.isUndefined(resp.total) && resp.total > 0) {
        //         // $('#alarm_count').text(resp.total).css('display', 'block');
        //         $('#alarm_count').css('display', 'block');
        //     }else{
        //         // $('#alarm_count').text('0').css('display', 'none');
        //         $('#alarm_count').css('display', 'none');
        //     }
        // },10);
    // });

    // close progress
    Handler.post(function(){
        ProgressBar.close_progress();
    }, 200);
}

// callback 디바이스 SharedPreferences
function callbackGetSharedPreferences(jsonStr) 
{
    if(jsonStr && jsonStr !=''){
        var data = $.parseJSON(jsonStr);
        
        // 푸시토큰
        if (!_.isUndefined(data.userid)){
            userinfo.usertoken     = data.usertoken;
            userinfo.name          = data.name;
            userinfo.userid        = data.userid;
            userinfo.fid           = data.fid;
            userinfo.authtoken     = data.authtoken;
            userinfo.nickname      = data.nickname;
            userinfo.profile_image = data.profile_image;

            // 디바이스 정보
            device_info.lang      = data.lang;

            // 내 정보 가져오기
            Activity.onCreateView();

            // 프로필이미지 변경
            Handler.post(function(){
                $('#btn_select_user').css('backgroundImage', "url("+userinfo.profile_image+")");
            },0);
        }
    }
}

// device info
// function callbackDevice(jsonStr){
//     app.log('----js -- : '+callbackDevice);
//     app.log(jsonStr);
//     if(jsonStr && jsonStr !=''){
//         var data = $.parseJSON(jsonStr);
//         device_info.device_uuid = data.uuid;
//         device_info.device_model = data.model;
//     }
// }

if ( (typeof window.android !=='undefined')){
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
    if ( (typeof window.android !=='undefined')){
        screen.orientation.lock('portrait');

        window.addEventListener("orientationchange", function(){
             // e.g. portrait
            if(screen.orientation.type.indexOf('landscape') !== -1){
                console.log('landscape');
            }else{
                console.log('portrait');
            }
        });
    }
}