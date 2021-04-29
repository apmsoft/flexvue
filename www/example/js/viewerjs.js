import Viewer from '../../flexvue/plugins/viewerjs/viewer.esm.js';

const onReady = () => 
{
    document.querySelectorAll('.viewerzoom').forEach(el => {
        el.addEventListener('click', function(){
            let image_src = el.dataset.original;
            
            let image = new Image();
            image.src = image_src;

            let viewer = new Viewer(image, {
                hidden: function () {
                    viewer.destroy();
                },
                navbar : false,
                title : false,
                toolbar : false,
                fullscreen : true,
                movable : true
            });
            viewer.show();
        });
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);