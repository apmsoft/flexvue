import {ScrollOut} from '../../flexvue/plugins/scroll-out/scroll-out.min.js';

const onReady = () => 
{
    ScrollOut({
        scrollingElement: "#left_docs_contents"
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);