// 콜백함수
function onReady($, _, Backbone) {
    // progress init
    ProgressBar.initialize('');

    // init
    app.initialize({});

    _.extend(Activity, {
        onCreate: function() {
            var self = this;

            // 정보 가져오기
            if ( (typeof window.android !=='undefined') || (window.webkit && window.webkit.messageHandlers.getSharedPreferences) ) {
                if (isMobile.Android()) {
                    window.android.getSharedPreferences('callbackGetSharedPreferences');
                }else if (isMobile.iOS()) {
                    webkit.messageHandlers.getSharedPreferences.postMessage("callbackGetSharedPreferences");
                }
            }
        },
        onCreateView: function(lang) {
            var self = this;

            // set language
            app.language = (lang != 'ko' ) ? lang : '';

            // load layout
            Runnable(function(){
                // 시스템 메세지
                app.parserResource ('/values/sysmsg', function(sysmsg)
                {
                    _.extend(app.lang, sysmsg);
                });

                // layout
                app.parserResource ('/layout/guide', function(layout_info)
                {
                    _.extend(app.docs, layout_info);

                    // core
                    DocAsyncTask.doGetContents(app.docs.guide, {},{
                        success: function(tpl, resp) {
                            $('#guide_list').html(tpl).promise().done(function(){
                                require(['swiper'], function(Swiper)
                                {
                                    var swiper = new Swiper('.guide-container', {
                                        pagination: {
                                            el: '#guide_list .swiper-pagination',
                                            dynamicBullets: false
                                        },
                                        observer: true,  
                                        observeParents: true
                                    });

                                    // start
                                    $('#btn-anybaro-start').on('click', function(){
                                        app.go_url('join.html?lang='+app.language);
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
            
        }
    });

    // layout// 
    Activity.onCreate();

    // back key
    Activity.onBackPressed(function(k){
        
    });
}

// callback 디바이스 SharedPreferences
function callbackGetSharedPreferences(jsonStr) 
{
    if(jsonStr && jsonStr !=''){
        var data = $.parseJSON(jsonStr);
        
        // 언어
        Activity.onCreateView(data.lang);
    }
}

// device ready
function onDeviceReady(){
    console.log('onDeviceReady');
}