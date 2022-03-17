import AsyncTask from '../../flexvue/core/asynctask.class.js';

const onReady = () => 
{
    // application/json
    const json_params = JSON.stringify({
        page:1,
        q:encodeURIComponent('테스트')
    });

    // get 
    // test.php?new URLSearchParams({page:1,q:encodeURIComponent('테스트')}).toString();

    // application/x-www-form-urlencoded
    const formData = new FormData();
    formData.append("name", "홍길동");
    const post_params = new URLSearchParams(formData);
    // 
    new AsyncTask().execute('POST','http://testhomeage.com/member/info'
        ,json_params
        ,{
//             mode : 'cors', // no-cors, cors, *same-origin
//             redirect : 'follow'
        }
        ,{
            'Content-Type' : 'application/json',
//             'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization-Access-Token':'Y29tZmFuY3l1cHN'
        }
    )
    .then( resp =>{
        Log.d('resp >>> ',resp);
        alert(JSON.stringify(resp));
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);