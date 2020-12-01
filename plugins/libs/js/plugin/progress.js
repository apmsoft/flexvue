// 프로그레스바
var ProgressBar = {
    progressObj: null,
    initialize: function(name) {
        // var loading = '<div id="p2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded" style="width:100vw;" data-upgraded=",MaterialProgress"><div class="progressbar bar bar1" style="width: 0%;"></div><div class="bufferbar bar bar2" style="width: 100%;"></div><div class="auxbar bar bar3" style="width: 0%;"></div></div>';
        var loading ='<svg width="40px"  height="40px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#55ad15" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(347.727 50.0001 50.0001)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';
        if (name && name != '') {
            loading = name;
        }

        $('body').append('<div id="loading" class="loading">' + loading + '</div>').promise().done(function() {
            progressObj = $('#loading');
        });
    },
    show_progress: function() {
        window.setTimeout(function() {
            progressObj.css('display', 'block');
        }, 10);
    },
    close_progress: function() {
        window.setTimeout(function() {
            progressObj.css('display', 'none');
        }, 500);
    }
};
