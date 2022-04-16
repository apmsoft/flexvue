import {} from '../../flexvue/plugins/rellax/rellax.min.js';

const onReady = () => 
{
    var rellax = new Rellax('.rellax', {
        wrapper:'#left_docs_contents',
        center: false,
        vertical: true,
        // center: true
        callback: function(position) {
            // callback every position change
            console.log(position);
        }
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);