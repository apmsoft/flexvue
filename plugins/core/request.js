define(['jquery', 'underscore', 'backbone', 'backbone-fetch-cache'], function($, _, Backbone) {
    var initialize = function(argv, callback) {
        app.log(argv);

        var version       = '1.2';
        var feature       = argv[0];
        var params        = argv[1];
        var frame         = feature.frame;
        var template_html = feature.template;
        var template_id   = '';

        var Model = Backbone.Model.extend({
            urlRoot: '',
            initialize: function(options) {
                app.log('request : initialize');
                this.urlRoot = feature.value;
                if (!_.isNull(app.server_language) && app.server_language != '') {
                    this.urlRoot += app.server_language;
                }

                // 경로 자동설정
                if (!_.isObject(feature.value)){
                    if((!_.isNull(app.src) && app.src !="")){
                        if((!_.isNull(feature.value) && feature.value !="")){
                            this.urlRoot = app.src+'/'+this.urlRoot;
                        }
                    }
                }
            },
            url: function() {
                var return_url = this.urlRoot + '?' + $.param(params);
                app.log('url : '+return_url);
                return return_url;
            },
            getCacheKey: function(options) {
                return 'cache_id:' + (!_.isUndefined(params.cache_id)) ? params.cache_id : self.url();
            }
        });

        var View = Backbone.View.extend({
            _cache_load : false,
            initialize: function() {
                var self = this;
                _.bindAll(this, "render");

                // back-end 경로가 null 인지 체크 후 행동
                if (feature.value == null) {
                    this.render(null, {
                        result: 'true',
                        msg: ''
                    });
                }
                // json Object 데이터 인지 확인
                else if (_.isObject(feature.value)) {
                    this.render(null, _.extend({
                        result: 'true',
                        msg: ''
                    }, feature.value));
                } else {
                    // set cache enabled
                    var is_cache = app.cache;
                    var cache_id = '';
                    if(!_.isUndefined(params.cache) && app.cache) {
                        is_cache = (params.cache) ? true : false;
                    }

                    this.model.fetch({
                        // headers: {
                        //     'Content-Type' : 'application/json',
                        //     'Authorization' :'Bearer '+app.token
                        // },
                        prefill: is_cache,
                        prefillExpires: app.cache_time,
                        prefillSuccess: function(){
                            app.log('load cache_: '+self.model.getCacheKey({}));
                            self._cache_load = true;
                            var cache_data = Backbone.fetchCache.getCache(self.model.getCacheKey({})).value;
                            self.render(null, cache_data);
                        },
                        success:function(context,data){
                            if(!self._cache_load){
                                app.log('fetch');
                                self.render(null, data);
                            }
                        },
                        error:this.error
                    });
                }
            },
            render: function(model, data) {
                var self = this;
                app.log("render------------");
                app.log(JSON.stringify(data));
                if(data.result == 'false'){
                    callback(null, data);
                    return;
                }

                // frame
                if (!_.isNull(frame)) {
                    if (frame.indexOf("#") > -1) {
                        var arr = frame.split('#');
                        var frame_src = arr[0];
                        var frame_id = arr[1];
                        require(['text!' + frame_src + '.html'], function(frame_html) {
                            $('#' + frame_id).html(frame_html).promise().done(function() {
                                self.render_template(data);
                            });
                        });
                    }
                } else {
                    self.render_template(data);
                }
            },
            render_template: function(data) {
                // HTML Template 모드 인지 확인
                if (!_.isNull(template_html)) {
                    // template 아이디 찾기
                    if (template_html.indexOf("#") > -1) {
                        var arr = template_html.split('#');
                        template_html = arr[0];
                        template_id = arr[1];
                    }

                    // 템플릿이 HTML 에서 포함된 상태
                    if (template_html == 'included') {
                        var template = _.template($("script#" + template_id).html());
                        callback(template(data), data);
                    } else {
                        var count = _.size(app.template);
                        var is_resource = false;
                        for (var i = 0; i < count; i++) {
                            if (app.template[i] != null && app.template[i] == template_html) {
                                is_resource = true;
                                break;

                            }
                        }

                        if (!is_resource) {
                            require(['text!' + template_html + '.html'], function(html) {
                                app.template[count] = template_html;
                                $('body').append(html);

                                var template = _.template($("script#" + template_id).html());
                                callback(template(data), data);
                            });
                        }else{
                            var template = _.template($("script#" + template_id).html());
                            callback(template(data), data);
                        }
                    }
                } else {
                    callback(null, data);
                }
            },
            error: function(model, e) {
                if(!_.isUndefined( e.responseText)){
                    try {
                        callback(null,JSON.parse(e.responseText));
                    } catch(e) {
                        app.log(e);
                    }
                }
            }
        });

        new View({
            model: new Model(feature)
        });
    };
    return {
        initialize: initialize
    };
});
