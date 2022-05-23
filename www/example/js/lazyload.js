/** lazyload */
import LazyLoad from '../../flexvue/plugins/lazyload/lazyload.esm.min.js';

const onReady = () => 
{
    // lazyload
    window.lazyLoadInstance = new LazyLoad({
        // container: document.querySelector("#left")
    });

    // lazyload
    lazyLoadInstance.update();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);