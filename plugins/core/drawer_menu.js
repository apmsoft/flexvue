// contents
var DrawerNavigation = {
    version: '0.8',
    // @ res_menu_file : 메뉴json 파일
    // @ target : 출력 대상 ID
    // @ feature: 기능
    // @ params : 파라메터
    // @ callback: 콜백함수
    initialize: function(res_menu_file, target, feature, callback)
    {
        var self = this;
        if (_.isUndefined(res_menu_file) || _.isNull(res_menu_file) || res_menu_file == '') {
            return;
        }

        $.getJSON(app.res + '/' + res_menu_file + '.json')
        .done(function(menuItems, textStatus, jqXHR) {
            feature.value = {
                result:'true',
                msg:menuItems
            };
            DocAsyncTask.doGetContents(feature, {}, {
                success : function(tpl, resp){
                    $(target).html(tpl).promise().done(function() {
                        // click event
                        $('.drawer_menu_item').unbind('click');
                        $('.drawer_menu_item').on('click', function() {
                            var item_id = $(this).data('id');
                            if (!_.isNull(callback) && _.isFunction(callback)) {
                                callback(item_id);
                            }
                        });
                    });
                }
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            app.log(textStatus);
        });
    },

    // 메뉴오픈
    drawer_menu_opened: function() {
        $("#drawer_menu").toggleClass('drawer_transitioned');
        // animation
        Handler.post(function(){
            var ddelay_time = 0;
            $('#drawermenu_quicm button').each(function(){
                var _this = $(this);
                setTimeout( function(){ 
                    $(_this).animateCss('slideInLeft'); 
                }, ddelay_time);
                ddelay_time += 300;
            });
        },10);
    },

    // 메뉴닫기
    drawer_menu_closed: function() {
        $('#drawer_menu').removeClass("drawer_transitioned");
    }
};
