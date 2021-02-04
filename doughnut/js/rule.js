define(['jquery','underscore','backbone'],
    function($,_,Backbone) {

        _.extend(app.docs, {
            "rule" : {
                "rule1" : {
                    "panel": "bottom",
                    "title": "이용약관",
                    "frame": app.assets+"/rule1#bottom_docs_contents",
                    "template": null,
                    "value": null
                },
                "rule2" : {
                    "panel": "bottom",
                    "title": "개인정보처리방침",
                    "frame": app.assets+"/rule2#bottom_docs_contents",
                    "template": null,
                    "value": null
                },
                "rule3" : {
                    "panel": "bottom",
                    "title": "위치정보약관",
                    "frame": app.assets+"/rule3#bottom_docs_contents",
                    "template": null,
                    "value": null
                },
                "rule4" : {
                    "panel": "bottom",
                    "title": "이메일무단수입거부",
                    "frame": app.assets+"/rule4#bottom_docs_contents",
                    "template": null,
                    "value": null
                }
            }
        });

        // contents
        const RuleActivity = {
            doRule(rule)
            {
                const self = this;

                ProgressBar.show_progress();

                // panel
                let panel_setting = app.docs.rule[rule]; // SETTING VALUE
                let panel = Panel.onStart(panel_setting);

                // history
                // make url
                UrlUtil.pushUrlParams({
                    mode : rule
                });
                UrlUtil.pushState(rule, '', app.service_root_dir+'?'+$.param(UrlUtil._url_params));

                DocAsyncTask.doGetContents(panel_setting, {},{
                    success: function(tpl, resp) {
                        // 스크롤포지션
                        $(panel.id+" .mdl-layout__content").animate({scrollTop: 0}, 100, "swing");
                        ProgressBar.close_progress();
                    },

                    fail : function(resp){
                        ProgressBar.close_progress();
                    }
                });
            }
        };

        return RuleActivity;
    });
