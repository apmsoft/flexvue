var scrollcap = {
    'version' : '0.5',

    // scroll
    'current_positiion':0,
    'is_capture':true,
    is_running : false,
    bottom_postion : 50,

    successCallback : null,

    // Application Constructor
    initialize: function(success) {
        this.successCallback = success;

        $(document).scroll(function(){
            var pageHeight = Math.max(document.body.scrollHeight || document.body.offsetHeight);
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            var scroll_height = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var sposition=pageHeight - viewportHeight - scroll_height;
           console.log('is_capture : '+scrollcap.is_capture);
           console.log('is_running : '+scrollcap.is_running);
           console.log('sposition : '+sposition);
            if(scrollcap.is_capture){
                if(!scrollcap.is_running){
                    if(sposition<scrollcap.bottom_postion){
                        scrollcap.is_running = true;
                        scrollcap.successCallback();
                    }
                }
            }
        });
    },

    // position :
    scrollPositionTo:function (position){
        window.setTimeout(function() {
            $(document).scrollTop(position);
        }, 10);
    },
    scrollPositionHeight : function(){
        scrollcap.current_positiion = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
};
