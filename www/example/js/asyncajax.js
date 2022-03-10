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
                xhr.setRequestHeader('Authorization-Access-Token', 'Y29tZmFuY3l1cHNvZnQ6Y01HR0o3c202NlhaQVFEUmhNb3AxUQ%3D%3D');
            }
        }
    )
        .then( resp =>{
            Log.d('resp >>> ',resp);
        });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);