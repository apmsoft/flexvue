import {} from '../../flexvue/plugins/jquery/jquery.js';

const onReady = () => 
{
    Log.i ( ' Welcome to FlexVue ');

    $('#welcome').text('FlexVue World!!');
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);