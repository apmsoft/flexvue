/** ZingTouch */
import ZingTouch from '../../flexvue/plugins/zingtouch/ZingTouch.min.js';

const onReady = () => 
{
    // 터치
    var myRegion = new ZingTouch.Region(document.body);
    var myElement = document.getElementById('touch');
    myRegion.bind(myElement, 'tap', function(e) {
        Log.i('ZingTouch >> '+e.detail.interval);
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);