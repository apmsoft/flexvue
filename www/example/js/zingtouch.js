/** ZingTouch */
import ZingTouch from '../../flexvue/plugins/zingtouch/ZingTouch.min.js';
// import Gesture from '../../flexvue/plugins/zingtouch/gestures/Gesture.js';

const onReady = () => 
{
    // // 터치
    // var myRegion = new ZingTouch.Region(document.body);
    // var myElement = document.getElementById('touch');
    // myRegion.bind(myElement, 'Gesture', function(e) {
    //     Log.i('ZingTouch >> '+e.detail.interval);
    //     Log.d(e.detail);
    // });

    /** @test {Gesture} */
    // describe('Gesture', function () {
    //     it('should be instantiated', function () {
    //     expect(Gesture).to.not.equal(null);
    //     });
    // });
    
    /** @test {Gesture.getType} */
    // describe('Gesture.getType', function () {
    //     it('should return null for a generic gesture', function () {
        // var _gesture = new Gesture();
        // Log.d(_gesture.getType());
        // });
    // });

    // var myElement = document.getElementById('touch');
    // var myRegion = new ZingTouch.Region(myElement);
    // var chainableObject = myRegion.bind(myElement);

    // chainableObject
    //     .tap(function(e){
    //         console.log(e.detail);
    //     })
    //     .swipe(function(e){
    //         console.log(e.detail);
    //     }, true);


    var myElement = document.getElementById('touch');
    // var myRegion = new ZingTouch.Region(document.body);
    // var myTapGesture = new ZingTouch.Tap({ maxDelay : 100 });
    
    // myRegion.bind(myElement, myTapGesture, function(e) {
    //     console.log(e)
    // });

    // var parentTouchArea = document.getElementById('left')
    // var touchArea = document.getElementById('touch')
    // var myRegion = new ZingTouch.Region(document.body);

    // myRegion.bind(touchArea, 'swipe', function(e){
    //     console.log(e.detail.data[0]);
    // });

    myElement.addEventListener('touchstart', handleTouchStart, false);        
    myElement.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* right swipe */ 
                Log.d('right swipe');
            } else {
                /* left swipe */
                Log.d('left swipe');
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
            } else { 
                /* up swipe */
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };

}

// document ready
document.addEventListener("DOMContentLoaded",onReady);