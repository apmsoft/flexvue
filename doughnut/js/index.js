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

            require(['swiper','chartjs'], function(Swiper, Chart)
            {
                MySwiper = Swiper;
                MyChart = Chart;
            });

            // 정보 가져오기
            if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.getSharedPreferences) ) {
                if (isMobile.Android()) {
                    window.android.getSharedPreferences('callbackGetSharedPreferences');
                }else if (isMobile.iOS()) {
                    webkit.messageHandlers.getSharedPreferences.postMessage("callbackGetSharedPreferences");
                }
            }

            // 디바이스 정보
            // if ( (window.webkit && window.webkit.messageHandlers.getDevice) ) {
            //     if (isMobile.iOS()) {
            //         webkit.messageHandlers.getDevice.postMessage('callbackDevice');
            //     }
            // }
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
            app.language = (device_info.lang != 'ko' ) ? device_info.lang : '';

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
                            $('#left_docs_contents').html(tpl).promise().done(function()
                            {
                                // 운동하기
                                $('#btn-start-trading').on('click', function(){
                                    ProgressBar.show_progress();
                                    
                                    // 운동뷰 진입위치[0:최근운동이력, 1:운동하기]
                                    playerHistoryEnter = 1;

                                    // 운동시작
                                    require([app.assets+'/trading/trading.min.js'], function(TradingActivity) {
                                        TradingActivity.init(function(){
                                            TradingActivity.doStart();
                                        });
                                    });
                                });

                                // run
                                self.doMyTradingInfo();
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
            $('#btn_select_user').on('click', function(){
                app.go_url('family.html');
            });

            $('#btn_setting').on('click', function(){
                require([app.assets+'/setting/setting.min.js'], function(SettingActivity) {
                    SettingActivity.init();
                });
            });

            // 알람
            $('#btn_alarm').on('click', function()
            {
                require([app.assets+'/alarm/alarm.min.js'], function( AlarmActivity) 
                {
                    AlarmActivity.init(function(){
                        AlarmActivity.doListDialog({page : 1},function(resp){
                            $('.alarm-dialog-row').on('click',function(e){
                                e.preventDefault();

                                var this_param = $(this).data('param');
                                history.go(-1);
    
                                Handler.post(function(){
                                    if(this_param == 'fu3_bbs_notice'){
                                        require([app.assets+'/notice/notice.min.js'], function(NoticeActivity) {
                                            NoticeActivity.init();
                                        });
                                    }
                                },100);
                            });
    
                            AlarmActivity.doUpdateRead();
                        });
                    });
                });
            });

            // popup
            Handler.post(function(){
                require([app.assets+'/popup/popup.min.js'], function(PopupActivity) {
                    PopupActivity.initialize();
                });
            },700);

            // scroll
            Activity.onScrollStateChanged('#left .mdl-layout__content', function(view, position) {
                // Activity.runScanSpyCapture('#left', '.spy', position, function(obj, spyid){
                //     var cur = obj;
                //     Handler.post(function(){
                //         $(cur).animateCss('bounceIn');
                //     },500);
                // });
                app.log(position);
                
                if (position < 5) {
                }else if (position > 90) {
                    if(!is_loading_product){
                        // app.log('call do product --> '+position);
                        is_loading_product = true;
                        self.doProduct();
                    }
                }
            });
        },
        doMyTradingInfo : function(){
            var self = this;

            // panel
            var panel_setting = app.docs.index.trading; // SETTING VALUE
            var panel = Panel.onStart(panel_setting);

            // send params
            var send_params = userinfo;
            _.extend(send_params, {
                cache : false
            });

            // core
            DocAsyncTask.doGetContents(panel_setting, send_params,{
                success: function(tpl, resp) {
                    $('#history_trading').html(tpl).promise().done(function()
                    {
                        // 일일평균
                        if(resp.day_average > 0){
                            $('#day_average_lay').removeClass('d-none');
                            $('#day_average').text(resp.day_average_str);
                        }

                        // 운동기록
                        $('#btn-go-tradinghistory').unbind('click');
                        $('#btn-go-tradinghistory').on('click', function(){
                            require([app.assets+'/graph/graph.min.js'], function(GraphActivity) {
                                GraphActivity.init(function(){
                                    GraphActivity.doRun();
                                });
                            });
                        });

                        // 주간 운동 통계 기록
                        var chart1 = null;
                        var ctx1 = document.getElementById('chart1').getContext('2d');
                        var gradient = ctx1.createLinearGradient(0,0,0,400);
                        gradient.addColorStop(0, '#C0D75E');
                        gradient.addColorStop(0.5, '#ADCD59');
                        gradient.addColorStop(1, '#97C355');

                        var chart_data = [
                            {
                                data: resp.week_logs,
                                backgroundColor: gradient
                            }
                        ];

                        var chart_options = {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false,
                                text: ""
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display:false
                                    },
                                    barThickness:35
                                }],
                                yAxes: [{
                                    gridLines: {
                                        drawBorder: false,
                                        display:true
                                    },
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: app.lang['trading_graph_ylabel']
                                    }
                                }]
                            }
                        };
                        
                        // app.log (chart_options);
                        Handler.post(function(){
                            chart1 = new MyChart(ctx1, {
                                type: 'bar',
                                data: {
                                    labels: app.lang['week_title'],
                                    datasets: chart_data
                                },
                                options: chart_options
                            });
                        },130);

                        // 운동최근 기록
                        var swiper_top5 = new MySwiper('.swiper-tradingtop5-container', {
                            spaceBetween: 30,
                            autoplay: {
                                delay: 3500,
                                disableOnInteraction: false
                            },
                            loop:false,
                            pagination: {
                                el: '.tradingtop5-swiper-pagination',
                                clickable: true,
                            }
                        });

                        $('.hs-trading-raw').on('click', function()
                        {
                            var this_id = $(this).data('id');
                            var this_chk_pain = $(this).data('pain');

                                // 운동뷰 진입위치[0:최근운동이력, 1:운동하기]
                                playerHistoryEnter = 0;

                                // reset
                                playerIntervalInfo = {
                                    id : this_id,
                                    cpercent : 0, // 진행률(%)
                                    ctime : 0,  // 총소요시간(초)
                                    panic_before : -1, // 운동전 통증
                                    panic_after : -1 // 운동후 통증
                                };
                                
                                // 통증 운동전 통증 체크
                                if(this_chk_pain == 'y')
                                {
                                    require([app.assets+'/trading/trading.min.js'], function(TradingActivity) {
                                        TradingActivity.init(function(){
                                            TradingActivity.doChkPain('panic_before',function(){
                                                TradingActivity.doView({
                                                    id : this_id
                                                });
                                            });
                                        });
                                    });
                                    
                                }else {
                                    require([app.assets+'/trading/trading.min.js'], function(TradingActivity) {
                                        TradingActivity.init(function(){
                                            TradingActivity.doView({
                                                id : this_id
                                            });
                                        });
                                    });
                                }
                        });
                    });
                },

                fail : function(resp){
                    ProgressBar.close_progress();
                    alert(resp.msg);
                }
            });
        },
        doProduct : function(){            
            require([app.assets+'/product/product.min.js'], function(ProductActivity) {
                ProductActivity.init(function(){
                    ProductActivity.doList();
                });
            });
        }
    });

    // layout
    Activity.onCreate();

    // back key
    Activity.onBackPressed(function(k){
        app.log('이전' +k+'/ 현재 : '+UrlUtil.current_id);

        // youtube player end
        if(!_.isNull(playerIntervalObj))
        {
            // 화면잠금
            if ( (typeof window.android !=='undefined')){
                screen.orientation.lock('portrait');

                // 스크린 켜짐 상태 해제
                window.android.screenOnOff("off");
                app.log('스크린 켜짐 상태 해제');
            }

            // clear 플레이 정보
            app.log(playerIntervalInfo);
            playerIntervalObj = null;
            clearInterval(playerIntervalObj);

            // 통증이 있을 경우
            if(playerIntervalInfo.panic_before > -1)
            {
                require([app.assets+'/trading/trading.min.js'], function(TradingActivity) {
                    TradingActivity.doChkPain('panic_after', function(){
                        history.go(-1);
                        Handler.post(function(){
                            TradingActivity.doTradingDataSubmit();
                        },360);
                    });
                });
            }else{
                require([app.assets+'/trading/trading.min.js'], function(TradingActivity) {
                    TradingActivity.doTradingDataSubmit();
                });
            }
        }

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