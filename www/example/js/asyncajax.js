import AsyncTask from '../../flexvue/core/asyncajax.class.js';

const onReady = () => 
{
    // json 
    const json_params = {
        page:1,
        q:encodeURIComponent('테스트')
    };

    new AsyncTask().execute('POST','접속경로'
        ,json_params
        ,{
            dataType : "json",
            cache:false,
            crossOrigin: true
        }
        ,{
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization-Access-Token', 'Y29tZmFu');
            }
        }
    )
        .then( resp =>{
            Log.d('resp >>> ',resp);
        });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);