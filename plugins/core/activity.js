var Activity = {
    version : '1.0',

    onCreate: function(docs) {
    },

    // View 설정
    onCreateView: function() {
    },

    // scroll changed
    onScrollStateChanged : function(target, callback){
        var _callback = (!_.isUndefined(callback) && _.isFunction(callback)) ? callback : null;
        $(target).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            if (!_.isNull(_callback)) {
                _callback($(this), scrollTop);
            }
        });
    },

    // 특정 클래스가 정의 되어 있는 스크콜위치 스캔
    // Activity.onScrollStateChanged('#left .mdl-layout__content', function(view, position) {
    //     Activity.runScanSpyCapture('#left', '.spy', position, function(obj, spyid){
    //         $(obj).animateCss('fadeInUp');
    //     });
    // });
    // <div class="spy" data-spyid="chart"></div>
    runScanSpyCapture : function(panel_id, classname, position, callback){
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
    onEnableHash : function(classname, panel_id, callback){
        $(classname).on('click',function(e){
            e.preventDefault();

            var _obj = $(this);
            var hash = $(this).attr('href');

            Runnable(function(){
                if($(panel_id+' .mdl-layout__content '+hash).length>0){
                    if(!_.isUndefined($(panel_id+' .mdl-layout__content '+hash).get(0).offsetTop)){
                        var _top = $(panel_id+' .mdl-layout__content '+hash).get(0).offsetTop;
                    }else{
                        var _top = $(panel_id+' .mdl-layout__content '+hash).get(0).offset;
                    }
                    
                    // var nav_height = $(panel_id+" .mdl-layout__header-row").height();
                    // var position = _top - nav_height;
                    var position = _top;

                    app.log(hash+' / '+position);
                    $(panel_id+" .mdl-layout__content").animate({
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
    setTouchSwipe: function(options, callback) {
        var _callback = (!_.isUndefined(callback) && _.isFunction(callback)) ? callback : null;
        var _options = _.extend({
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
                                if (!_.isNull(_callback)) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'left':
                        swipe_config = {
                            swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (!_.isNull(_callback)) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'up':
                        swipe_config = {
                            swipeUp: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (!_.isNull(_callback)) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'down':
                        swipe_config = {
                            swipeDown: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (!_.isNull(_callback)) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                    case 'all':
                        swipe_config = {
                            swipe: function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) {
                                if (!_.isNull(_callback)) {
                                    _callback(event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                                }
                            }
                        }
                        break;
                }

                // enable
                $(_options.target).swipe(_.extend({
                    excludedElements: "label, button, input, select, textarea, pre, .noSwipe, .note-editable",
                    threshold: options.threshold
                }, swipe_config));
            }
        );
    },

    // lazyload 이미지 불러오기\
    // @ target : 대상
    // @ remove_class : lazyload에서 제외시키기(한번읽어 들였으면 더 이상 읽을 필요없음)
    onLazyLoad : function(target, options, remove_class){
        var _options = {
            load : function(){
                if(!_.isNull(remove_class)){
                    $(this).removeClass(remove_class);
                }
            }
        };

        _options = _.extend(_options, options);
        require(['lazyload'],
            function(lazyload) {
                // run lazyload
                window.requestAnimationFrame(function(){
                    $(target).lazyload(_options);
                });
            });
    },

    // 뒤로가기 제어 활성화
    onBackPressed: function(callback) {
        // 뒤로가기
        window.onpopstate = function(event) {
            var pre_state = '';
            var is_Trustred = false;
            if (!_.isUndefined(event.isTrusted) && event.isTrusted) {
                is_Trustred = true;
            } else if (!_.isUndefined(event.state) && event.state != 'null') {
                is_Trustred = true;
            }

            if (is_Trustred) {
                
                // 이전경로 do 체크
                if(_.isNull(window.history.state) && window.history.state){
                    pre_state = window.history.state;
                }else if (typeof UrlUtil._url_params.do !== 'undefined' && UrlUtil._url_params.do !=''){
                    pre_state = UrlUtil._url_params.do;
                }

                if ($('#bottomthird').hasClass("bottomthird_transitioned")) {
                    $('#bottomthird_docs_contents').html('');
                    $("#bottomthird").toggleClass('bottomthird_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                } else if ($('#bottomside').hasClass("bottomside_transitioned")) {
                    $('#bottomside_docs_contents').html('');
                    $("#bottomside").toggleClass('bottomside_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                } else if ($('#bottom').hasClass("bottom_transitioned")) {
                    $('#bottom_docs_contents').html('');
                    $("#bottom").toggleClass('bottom_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                } else if ($('#rightthird').hasClass("rightthird_transitioned")) {
                    $('#rightthird_docs_contents').html('');
                    $("#rightthird").toggleClass('rightthird_transitioned');
       
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                } else if ($('#rightside').hasClass("rightside_transitioned")) {
                    $('#rightside_docs_contents').html('');
                    $("#rightside").toggleClass('rightside_transitioned');
       
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                } else if ($('#right').hasClass("transitioned")) {
                    $('#right_docs_contents').html('');
                    $("#right").toggleClass('transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                }else if ($('#drawer_menu').hasClass("drawer_transitioned")) {
                    $("#drawer_menu").toggleClass('drawer_transitioned');

                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }
                } else { 
                  
                    // url auto set
                    UrlUtil.initialize(UrlUtil.getURL2JSON());

                    // callback
                    if (!_.isUndefined(callback)) {
                        callback(pre_state);
                    }else{
                        history.go(-1);
                    }
                }
            }
        };
    }
};
