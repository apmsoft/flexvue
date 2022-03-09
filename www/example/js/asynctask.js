import AsyncTask from '../../flexvue/core/asynctask.class.js';

const onReady = () => 
{
    new AsyncTask().execute('GET','http://홈페이지주소', {page:1},{},{
        AccessToken:'sdfdsfssdfds'
    })
        .then( resp =>{
            Log.d('resp >>> ',resp);
        });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);