import {} from '../../flexvue/plugins/typeit/typeit.min.js';

const onReady = () => 
{
    new TypeIt("#text-4", {
        strings: "",
        speed:105,
        loop: true,
    }).go();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);