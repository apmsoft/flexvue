import {} from '../../flexvue/plugins/rellax/rellax.min.js';
import {ScrollOut} from '../../flexvue/plugins/scroll-out/scroll-out.min.js';
import {} from '../../flexvue/plugins/typeit/typeit.min.js';

const onReady = () => 
{
    const tx_left = document.querySelector('#tx-left');
    let tx_in = false;
    let scroll_top = 0;
    let tx_in_y = 0;
    const tx_position = {
        'tx_left' : 0
    };

    var rellax = new Rellax('.rellax', {
        wrapper:'#left_docs_contents',
        center: false,
        vertical: true,
        // center: true
        callback: function(position) {
        }
    });

    // 스크롤 좌표 구하기
    document.querySelector('#left_docs_contents').addEventListener('scroll', function(e) {
        Log.d(this.scrollTop);
        scroll_top = this.scrollTop;
        
        if(tx_in){
            tx_position.tx_left = (scroll_top - tx_in_y -500);
            Log.d(`**** scroll_top : ${scroll_top} ---- tx_in_y: ${tx_in_y}  **** ${tx_position.tx_left}px`);
            document.getElementById("tx-left").style.transform = `translateX(${tx_position.tx_left}px)`;
        }
    });

    const instance2 = new TypeIt("#text-2", {
        strings: "",
        speed: 75,
        loop: false,
    });


    const instance4 = new TypeIt("#text-4", {
        strings: "",
        speed: 75,
        loop: false,
    });

    ScrollOut({
        scrollingElement: "#left_docs_contents",
        onShown: function(el, ctx) {
            if(el.classList.contains('icon-gad')){
                // Log.d('icon-gad');
                el.classList.add('animate__zoomIn');
            }
            if (el.classList.contains('icon-second')){
                // Log.d('icon-second');
                Handler.post(function(){
                    el.classList.add('animate__rotateIn');
                },500);
                
            }
            if (el.classList.contains('icon-one')){
                // Log.d('icon-one');
                Handler.post(function(){
                    el.classList.add('animate__slideInUp');
                },500);
            }
            if(el.classList.contains('text-2')){
                // Log.d('text-2');
                instance2.go();
            }
            if(el.classList.contains('type-text-3')){
                Log.d('type-text-3');
                Handler.post(function(){
                    el.classList.add('animate__fadeInDown');
                },500);
            }
            
            if(el.classList.contains('text-4')){
                // Log.d('text-4');
                instance4.go();
            }

            if(el.classList.contains('tx-left')){
                Log.d('>> in >> tx-left');
                Log.d(ctx);
                Log.d('ctx.offsetX >> '+ctx.offsetX);
                if(ctx.offsetX){
                    tx_in_y = scroll_top;
                    Log.d('>>>>>>> '+tx_in_y);
                    tx_in = true;
                    Log.d(tx_in+ '>>>> ');
                }
            }
        },
        onHidden: function(el) {
            if(el.classList.contains('icon-gad')){
                // Log.d('hidden icon-gad');
                el.classList.remove('animate__zoomIn');
            }
            if (el.classList.contains('icon-second')){
                // Log.d('hidden icon-second');
                el.classList.remove('animate__rotateIn');
            }
            if (el.classList.contains('icon-one')){
                // Log.d('hidden icon-one');
                Handler.post(function(){
                    el.classList.remove('animate__slideInUp');
                },500);
            }
            if(el.classList.contains('text-2')){
                // Log.d('hidden text-2');
                if(instance2.is('started')){
                    instance2.reset();
                }
            }
            if(el.classList.contains('type-text-3')){
                Log.d('hidden type-text-3');
                el.classList.remove('animate__fadeInDown');
            }
            if(el.classList.contains('text-4')){
                // Log.d('hidden text-4');
                if(instance4.is('started')){
                    instance4.reset();
                }
            }

            if(el.classList.contains('tx-left')){
                Log.d('>> in >> tx-left');
                // Log.d(ctx.offsetX);
                // Log.d('ctx.offsetX >> '+ctx.offsetX);
                tx_in = false;
                tx_position.tx_left = 0;
            }
        }
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);