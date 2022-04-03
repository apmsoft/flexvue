import {} from '../../flexvue/plugins/draggable/lib/draggable.js';
import {} from '../../flexvue/plugins/draggable/lib/droppable.js';
import {} from '../../flexvue/plugins/draggable/lib/sortable.js';

const onReady = () => 
{

    const sortable = new Sortable.default(document.querySelector('#lay_cource'), {
        draggable: '.dragable-sort-item'
    });
    sortable.on('sortable:start', () => {
        // lay_cource.classList.remove('dropzone');
    });
    sortable.on('sortable:stop', () => {
        // lay_cource.classList.add('dropzone');
    });

    // 운동 드랍존으로 움직추가하기
    const droppable = new Droppable.default(document.querySelectorAll('.drop-container'), {
        draggable: '.draggable-item',
        dropzone: '.dropzone'
    });
    droppable.on('droppable:stop', () => 
    {
        // 테마운동 add -> dragable-sort-item
        Handler.post(function(){
            lay_cource.querySelectorAll('.draggable-item').forEach(el =>{
                if(!el.classList.contains('dragable-sort-item')){
                    el.classList.add('dragable-sort-item');
                }
            });
        },50);

        // 운동목록의 remove -> dragable-sort-item
        Handler.post(function(){
            if(lay_train){
                lay_train.querySelectorAll('.dragable-sort-item').forEach(el =>{
                    if(el.classList.contains('dragable-sort-item')){
                        el.classList.remove('dragable-sort-item');
                    }
                });
            }
        },50);

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