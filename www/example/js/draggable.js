import {} from '../../flexvue/plugins/draggable/lib/draggable.js';
import {} from '../../flexvue/plugins/draggable/lib/droppable.js';
import {} from '../../flexvue/plugins/draggable/lib/sortable.js';
import {} from '../../flexvue/plugins/draggable/lib/plugins/collidable.js';
import {} from '../../flexvue/plugins/draggable/lib/plugins.js';

const onReady = () => 
{
    // sortable
    const sortable = new Sortable.default(document.querySelector('#lay_cource'), {
        draggable: '.dragable-sort-item',
        sortAnimation: {
            duration: 200,
            easingFunction: 'ease-in-out',
        }
    });
    sortable.on('sortable:start', () => {
        // lay_cource.classList.remove('dropzone');
    });
    sortable.on('sortable:stop', () => {
        // lay_cource.classList.add('dropzone');
    });

    // 드랍존
    const droppable = new Droppable.default(document.querySelectorAll('.drop-container'), {
        draggable: '.draggable-item',
        dropzone: '.dropzone',
        plugins: [Collidable.default,Plugins.ResizeMirror]
    });
    droppable.on('droppable:stop', () => 
    {
        // 박스1 -> dragable-sort-item
        Handler.post(function(){
            lay_cource.querySelectorAll('.draggable-item').forEach(el =>{
                if(!el.classList.contains('dragable-sort-item')){
                    el.classList.add('dragable-sort-item');
                }
            });
        },50);

        // 박스2 remove -> dragable-sort-item
        Handler.post(function(){
            if(lay_train){
                lay_train.querySelectorAll('.dragable-sort-item').forEach(el =>{
                    if(el.classList.contains('dragable-sort-item')){
                        el.classList.remove('dragable-sort-item');
                    }
                });
            }
        },50);

        // 계속 박스1 로 드랍할 수 있도록 활성화
        Handler.post(function(){
            lay_cource.classList.remove('draggable-dropzone--occupied');
        },10);
    });

    // sort 순번 바뀌기 활성화
    document.querySelector('#enable-cource-sort').addEventListener('click', function(){
        let _checked = this.checked;
        if(_checked) {
            document.querySelector('#lay_cource').classList.remove('dropzone');
            document.querySelector('#lay_cource').querySelectorAll('.cursor-move').forEach(el => {
                el.classList.remove('cursor-move');
                el.classList.add('cursor-ns-resize');
            });
        }else{
            document.querySelector('#lay_cource').classList.add('dropzone');
            document.querySelector('#lay_cource').querySelectorAll('.cursor-ns-resize').forEach(el => {
                el.classList.remove('cursor-ns-resize');
                el.classList.add('cursor-move');
            });
        }
    },false);
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);