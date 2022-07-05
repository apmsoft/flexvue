import UrlManager from '../../flexvue/core/urlmanager.class.js';
import AsyncTask from '../../flexvue/core/asynctask2.class.min.js';
import Forms from '../../flexvue/core/forms.class.min.js';
import ScrollAgent from '../../flexvue/core/scrollagent.class.js';

class ComponentActivity 
{
    constructor(){
    }

    doList(params){
        ProgressBar.show();

        let self = this;

        // send params
        let send_params = {};
        send_params = Object.assign(send_params, params);

        // panel
        Activity.onStart('#left');

        // multiout
        Promise.all([
            new AsyncTask().execute('GET',`${config.src}/myfitem/list.php?${new URLSearchParams(send_params).toString()}`), 
            new AsyncTask().doImport( new URL(`../favitem/tpl/list${App.getLocale()}.js`, import.meta.url).href )
        ]).then((data) => {
            const resp = data[0];
            const template = new data[1].Template();
// Log.d(resp);
            // result
            if(resp.result == 'false'){
                throw resp;
            }

            document.querySelector('#left').innerHTML = template.render(resp);
            return true;
        })
        .then((ok)=>
        {
            // 스크롤포지션
            // vertical
            const scrollAgent = new ScrollAgent('page1');
            const preTopPos = scrollAgent.getPos();
            // scrollAgent.addFloatListener('#btn-go-top', 500, function(el){
            //     el.addEventListener('click', function(e){
            //         scrollAgent.scrollTo({top: 0, behavior: 'smooth'});
            //     });
            // });
            scrollAgent.addScrollListener('vertical', '#left--layout--main');
            scrollAgent.scrollTo({top: preTopPos});
        })
        .catch((e)=>{
            alert(e.msg);
            if(e.msg_code == 'w_not_have_permission'){
                window.location.hash = '#login/do/';
                return;
            }
        })
        .finally(()=>{ 
            ProgressBar.close(); 
        });
    }
}

export {ComponentActivity};