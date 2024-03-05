/** flatpickr */
import {} from '../../flexvue/plugins/flatpickr/flatpickr.min.js';
import {} from '../../flexvue/plugins/flatpickr/l10n/ko.js';

const onReady = () => 
{
    const sd = flatpickr("#start_date", {
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d",
        enableTime: false,
        locale : 'ko'
    });

    flatpickr.localize(flatpickr.l10ns.ko);

    document.querySelectorAll('.btn-todate').forEach(el =>{
        el.addEventListener('click', function(e){
            const _todate = el.dataset.todate;
            document.querySelector('#start_date').value = _todate;
            sd.setDate(_todate);
        },false);
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);