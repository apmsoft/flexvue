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
    new AsyncTask().execute('POST','http://115.68.73.85:15000/md1/sms/createtoken'
    // new AsyncTask().execute('POST','http://speeditem.kr/test/asynctast.php?page=1', 
        ,json_params
        ,{
            // mode : 'no-cors', // no-cors, cors, *same-origin
            // redirect : 'follow'
        }
        ,{
            'Content-Type' : 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Authorization-Access-Token':'Y29tZmFuY3l1cHNvZnQ6Y01HR0o3c202NlhaQVFEUmhNb3AxUQ%3D%3D'
        }
    )
        .then( resp =>{
            Log.d('resp >>> ',resp);
        });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);