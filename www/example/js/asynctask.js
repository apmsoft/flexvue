import AsyncTask from '../../flexvue/core/asynctask.class.js';

const onReady = () => 
{
    new AsyncTask().execute('POST','홈페이지주소', 
        {
            page:1,
            q:encodeURIComponent('테스트')
        }
        ,{}
        ,{
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization-Access-Token':'Y29tZmFuY3l1cH'
        }
    )
        .then( resp =>{
            Log.d('resp >>> ',resp);
        });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);