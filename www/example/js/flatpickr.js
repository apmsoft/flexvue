/** flatpickr */
import {} from '../../flexvue/plugins/flatpickr/l10n/ko.js';
import {} from '../../flexvue/plugins/flatpickr/flatpickr.min.js';

const onReady = () => 
{
    flatpickr("#start_date", {
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d",
        enableTime: true,
        'local' : ko
    });
    flatpickr.localize(flatpickr.l10ns.ko);
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);