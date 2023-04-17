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
        // clone
        lay_cource.classList.remove('dropzone');
    });
    sortable.on('sortable:stop', () => {
        // clone
        lay_cource.classList.add('dropzone');
    });

    // clone ---->
    let initialDropzone = null;
    let clonedNode = null;

    function dragStart(e) {
        // Record the initial dropzone because we want to use it in droppable:dropped.
        initialDropzone = e.data.dropzone;

        // Clone the source node and insert after the original node. Adding a class for
        // some styling.
        const originalNode = e.data.dragEvent.data.source;
        clonedNode = originalNode.cloneNode(true);
        clonedNode.classList.add("draggable-clone");  
        originalNode.parentNode.insertBefore(clonedNode, originalNode.nextSibling);
    }

    function dragDropped(e) {
        if (!clonedNode) return;

        // If the current dropzone is our initial one, then hide the cloned Node
        // because otherwise you have the cloned node plus the dropped node.
        const dropzone = e.data.dropzone;
        if (initialDropzone === dropzone) clonedNode.style.display = "none";
        else clonedNode.style.display = "inherit";

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
    }
    //<----- end clone */

    // 드랍존
    const droppable = new Droppable.default(document.querySelectorAll('.drop-container'), {
        draggable: '.draggable-item',
        dropzone: '.dropzone',
        plugins: [Collidable.default,Plugins.ResizeMirror]
    });

    // clone --->
    droppable.on("droppable:start", dragStart);
    droppable.on("droppable:dropped", dragDropped);
    // <-- clone
    
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