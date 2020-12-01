// alarm
var AlarmCount = {
    obj: null,
    initialize: function(params) {
        var AlarmModel = Backbone.Model.extend({
            urlRoot: app.src + '/alarm/alarm_new_count.php',
            initialize: function(options) {
                // app.log('document : initialize');
            },
            url: function() {
                var return_url = this.urlRoot + '?' + $.param(params);
                // app.log(return_url);
                return return_url;
            }
        });

        this.obj = new AlarmModel();
    },
    run: function(callback) {
        var alarmcount_params = {
            userid : userinfo.userid,
            authtoken : userinfo.authtoken
        };
        // _.extend(alarmcount_params, myLocation);
        AlarmCount.obj.save(alarmcount_params, {

            success: function(model, response) {
                // app.log(response);
                callback(response);

                // 반복탐색 주기
                window.setTimeout(function(callback){
                    app.log(alarmcount_params);
                    AlarmCount.run(callback);
                },15000,callback);
            },
            error: function(model, e) {
                app.log(e.responseText);
                // app.log(JSON.stringify(e));
            }
        });
    }
};