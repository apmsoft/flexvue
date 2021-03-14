const Activity = {
    version : '1.0',

    onCreate() {
    },

    // View 설정
    onCreateView() {
    },

    // scroll changed
    onScrollStateChanged (target, callback){
        let _callback = ((typeof callback !=='undefined') && (typeof callback ==='function')) ? callback : null;
        document.querySelector(target).addEventListener('scroll', function(el) {
            let scrollTop = el.scrollTop;
            if (_callback !== null) {
                _callback(el, scrollTop);
            }
        });
    },

    // 특정 클래스가 정의 되어 있는 스크콜위치 스캔
    // Activity.onScrollStateChanged('#left .fvue--layout--main', function(view, position) {
    //     Activity.runScanSpyCapture('#left', '.spy', position, function(obj, spyid){
    //         $(obj).animateCss('fadeInUp');
    //     });
    // });
    // <div class="spy" data-spyid="chart"></div>
    runScanSpyCapture (panel_id, classname, position, callback){
        var self = this;
        Runnable(function(){
            $(classname).each(function(){
                var spyid = $(this).data("spyid");
                if (!$(this).hasClass('spyed')){
                    var pos = $(this).offset().top;
                    if (pos < position) {
                        app.log('spyid :'+spyid+'/ pos : '+pos+' / '+position);
                        if(!_.isUndefined(callback)){
                            $(this).removeClass(classname).addClass('spyed');
                            callback($(this),spyid);
                        }
                    }
                }
            });
        },0);
    }, 

    // <a class="hash-link" href="#hash">클릭</a>
    // <div id="hash"></div>
    onEnableHash (classname, panel_id, callback){
        $(classname).on('click',function(e){
            e.preventDefault();

            var _obj = $(this);
            var hash = $(this).attr('href');

            Runnable(function(){
                if($(panel_id+' .fvue--layout--main '+hash).length>0){
                    if(!_.isUndefined($(panel_id+' .fvue--layout--main '+hash).get(0).offsetTop)){
                        var _top = $(panel_id+' .fvue--layout--main '+hash).get(0).offsetTop;
                    }else{
                        var _top = $(panel_id+' .fvue--layout--main '+hash).get(0).offset;
                    }
                    
                    // var nav_height = $(panel_id+" .mdl-layout__header-row").height();
                    // var position = _top - nav_height;
                    var position = _top;

                    app.log(hash+' / '+position);
                    $(panel_id+" .fvue--layout--main").animate({
                        scrollTop: position
                    }, 500, "swing");
                }

                if(!_.isUndefined(callback)){
                    callback(_obj, hash);
                }
            },100);
        });
    },

    // SCREEN 왼쪽 오른쪽 SWIPE 제스쳐
    setTouchSwipe(options, callback) {
        let _callback = ((typeof callback !=='undefined') && (typeof callback ==='function')) ? callback : null;
        let _options = Object.assign({
            target: '',
            gesture: '',
            threshold: 0
        }, options);

        // swipe
        require(['touchSwipe'],
            function() {
                var swipe_config = {};
                switch (_options.gesture) {
                    case 'right':
                        swipe_config = {
                            swipeRight: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (_callback !== null) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'left':
                        swipe_config = {
                            swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (_callback !== null) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'up':
                        swipe_config = {
                            swipeUp: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (_callback !== null) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'down':
                        swipe_config = {
                            swipeDown: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (_callback !== null) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'all':
                        swipe_config = {
                            swipe: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (_callback !== null) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                }

                // enable
                let _config = Object.assign({
                    excludedElements: "label, button, input, select, textarea, pre, .noSwipe, .note-editable",
                    threshold: options.threshold
                }, swipe_config);

                $(_options.target).swipe(_config);
            }
        );
    },

    // lazyload 이미지 불러오기\
    // @ target : 대상
    // @ remove_class : lazyload에서 제외시키기(한번읽어 들였으면 더 이상 읽을 필요없음)
    onLazyLoad (target, options, remove_class){
        let _options = {
            load : function(){
                if(remove_class !== null){
                    document.querySelector(target).classList.remove(remove_class.replace('.',''));
                }
            }
        };

        _options = Object.assign(_options, options);
        require(['lazyload'],
            function(lazyload) {
                // run lazyload
                window.requestAnimationFrame(function(){
                    $(target).lazyload(_options);
                });
            });
    },

    // 뒤로가기 제어 활성화
    onBackPressed (callback) {
        // 뒤로가기
        window.onpopstate = function(event) {
            var pre_state = '';
            var is_Trustred = false;
            if (typeof event.isTrusted !=='undefined' && event.isTrusted) {
                is_Trustred = true;
            } else if (typeof event.state !=='undefined' && event.state != 'null') {
                is_Trustred = true;
            }

            if (is_Trustred) 
            {
                // 이전경로 do 체크
                if(window.history.state !== null && window.history.state){
                    pre_state = window.history.state;
                }else if (typeof UrlUtil._url_params.do !== 'undefined' && UrlUtil._url_params.do !=''){
                    pre_state = UrlUtil._url_params.do;
                }

                if (document.querySelector('#bottomthird').classList.contains('bottomthird_transitioned')) {
                    document.querySelector('#bottomthird_docs_contents').innerHTML ='';
                    document.querySelector("#bottomthird").classList.toggle('bottomthird_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#bottomside').classList.contains('bottomside_transitioned')) {
                    document.querySelector('#bottomside_docs_contents').innerHTML ='';
                    document.querySelector("#bottomside").classList.toggle('bottomside_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#bottom').classList.contains('bottom_transitioned')) {
                    document.querySelector('#bottom_docs_contents').innerHTML ='';
                    document.querySelector("#bottom").classList.toggle('bottom_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#rightthird').classList.contains('rightthird_transitioned')) {
                    document.querySelector('#rightthird_docs_contents').innerHTML ='';
                    document.querySelector("#rightthird").classList.toggle('rightthird_transitioned');
       
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#rightside').classList.contains('rightside_transitioned')) {
                    document.querySelector('#rightside_docs_contents').innerHTML ='';
                    document.querySelector("#rightside").classList.toggle('rightside_transitioned');
       
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else if (document.querySelector('#right').classList.contains('right_transitioned')) {
                    document.querySelector('#right_docs_contents').innerHTML ='';
                    document.querySelector("#right").classList.toggle('right_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                }else if (document.querySelector('#drawer_menu').classList.contains('drawer_menu_transitioned')) {
                    document.querySelector("#drawer_menu").classList.toggle('drawer_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }
                } else { 
                  
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (typeof callback !==undefined && typeof callback ==='function') {
                        callback(pre_state);
                    }else{
                        history.go(-1);
                    }
                }
            }
        };
    }
    
};
