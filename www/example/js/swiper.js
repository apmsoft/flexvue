/** swiperjs */
import Swiper from '../../flexvue/plugins/swiper/swiper-bundle.esm.browser.min.js';

const onReady = () => 
{
    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'vertical',
        loop: true,
      
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar',
        },
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);