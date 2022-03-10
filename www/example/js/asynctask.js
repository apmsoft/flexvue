import AsyncTask from '../../flexvue/core/asynctask.class.js';

const onReady = () => 
{
    // application/json
    const json_params = JSON.stringify({
        page:1,
        q:encodeURIComponent('테스트')
    });

    // application/x-www-form-urlencoded
    const formData = new FormData();
    formData.append("name", "홍길동");
    const post_params = new URLSearchParams(formData);
    
    // 
    new AsyncTask().execute('POST','접속주소'
        ,json_params
        ,{
            // mode : 'no-cors', // no-cors, cors, *same-origin
            // redirect : 'follow'
        }
        ,{
            'Content-Type' : 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Authorization-Access-Token':'Y29tZmFuY3l1cHNvZnQ6Y01HR0o3c'
        }
    )
        .then( resp =>{
            Log.d('resp >>> ',resp);
        });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);