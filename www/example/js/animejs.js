import anime from '../../flexvue/plugins/anime/anime.es.min.js';

const onReady = () => 
{
    anime({
        targets: '.css-selector-demo .el',
        translateX: 250,
        backgroundColor: '#FFF',
        borderRadius: ['0%', '50%'],
        delay: 400,
        easing: 'easeInOutQuad',
        loop : true
    });

    anime({
        targets: '.function-based-values-demo .el',
        translateX: function(el) {
            return el.getAttribute('data-x');
        },
        translateY: function(el, i) {
          return 50 + (-5 * i);
        },
        scale: function(el, i, l) {
            return (l - i) + .25;
        },
        rotate: function() { return anime.random(-360, 360); },
        borderRadius: function() { return ['50%', anime.random(10, 35) + '%']; },
        duration: function() { return anime.random(1200, 1800); },
        delay: function() { return anime.random(0, 400); },
        direction: 'alternate',
        loop: true
    });

    var tl = anime.timeline({
        direction: 'alternate',
        loop: true,
        duration: 500,
        easing: 'easeInOutSine',
        update: function(anim) {
            Log.d(anim);
        }
    });

    tl.add({
        targets: '.timeline-controls-demo .el',
        translateX: 50,
        borderRadius: 0
    })
    .add({
        targets: '.timeline-controls-demo .el',
        translateX: 200,
        scale: 0.5,
        duration: 750,
        backgroundColor: '#e4e4e4',
        rotate :'65deg'
    }, '-=100')
    .add({
        targets: '.timeline-controls-demo .el',
        translateX: 470,
        backgroundColor: '#A5199B',
        borderRadius: function() { return ['50%', anime.random(10, 35) + '%']; },
    }, '-=100');
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);