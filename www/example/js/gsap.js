import { gsap } from "../../flexvue/plugins/gsap/esm/all.js";
// import { PixiPlugin } from "gsap/PixiPlugin.js";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
const onReady = () => 
{
    Handler.post(function(){
        gsap.to(".box", {rotation: 27, x: 100, duration: 1});
    },100);
    
    Handler.post(function(){
        let tl = gsap.timeline(); //create the timeline
        tl.to("#box1", {x: 100}) //start sequencing
        .to("#box2", {y: 100, ease: "elastic"})
        .to("#box3", {rotation: 180});
    },2000);
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);