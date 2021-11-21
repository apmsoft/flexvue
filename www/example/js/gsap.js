import { gsap } from "../../flexvue/plugins/gsap/esm/core.min.js";

import { CSSRulePlugin } from "../../flexvue/plugins/gsap/esm/CSSRulePlugin.min.js";
import { Draggable } from "../../flexvue/plugins/gsap/esm/Draggable.min.js";
import { EaselPlugin } from "../../flexvue/plugins/gsap/esm/EaselPlugin.min.js";
import { MotionPathPlugin } from "../../flexvue/plugins/gsap/esm/MotionPathPlugin.min.js";
import { PixiPlugin } from "../../flexvue/plugins/gsap/esm/PixiPlugin.min.js";
import { TextPlugin } from "../../flexvue/plugins/gsap/esm/TextPlugin.min.js";
import { ScrollToPlugin } from "../../flexvue/plugins/gsap/esm/ScrollToPlugin.min.js";
import { ScrollTrigger } from "../../flexvue/plugins/gsap/esm/ScrollTrigger.min.js";


const onReady = () => 
{
    // regi plugins
    gsap.registerPlugin(CSSRulePlugin, Draggable, EaselPlugin, MotionPathPlugin, PixiPlugin, TextPlugin, ScrollToPlugin, ScrollTrigger);

    // default
    Handler.post(function(){
        gsap.to(".box", {rotation: 27, x: 100, duration: 1});
    },100);

    // timeline
    Handler.post(function(){
        let tl = gsap.timeline(); //create the timeline
        tl.to("#box1", {x: 100}) //start sequencing
        .to("#box2", {y: 100, ease: "bounce"})
        .to("#box3", {rotation: 180});
    },2000);

    // motion path 
    Handler.post(function(){
        gsap.set(".astronaut", {scale: 0.5, autoAlpha: 1});

        gsap.to(".astronaut", {
            duration: 2.5, 
            ease: "power2.inOut",
            immediateRender: true,
            motionPath: {
                path: "#path",
                align: "#path",
                alignOrigin: [0.5, 0.5],
                autoRotate: 90
            }
        });

        // MotionPathHelper.create(".astronaut");
    },5000);
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);