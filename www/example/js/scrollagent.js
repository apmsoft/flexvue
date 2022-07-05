"use strict";
import UrlManager from '../../flexvue/core/urlmanager.class.js';
import AsyncTask from '../../flexvue/core/asynctask2.class.min.js';
import TplPage1 from '../tp/page1.js';
import TplPage2 from '../tp/page2.js';
import TplPage3 from '../tp/page3.js';

// 콜백함수
const onReady = () => 
{
    // 앱 정보
    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);

    // set
    // config.debug = ['i'];

    // activity
    new Activity().onBackPressed((state)=>{
        Log.d('onBackPressed : >> '+ JSON.stringify(state));
    });

    // url
    const urlManager = new UrlManager(document.location);

    // scroll Observer
    new ScrollObserver([
        'page1','page2','page3'
    ]);

    // routes
    const routes = {
        'page1': `../../page1.class.js`,
        'page2': `../../page2.class.js`,
        'page3': `../../page3.class.js`
    };
    
    // Router
    new Router(urlManager.hash).filter(function(pathinfo)
    {
        if(pathinfo.url ==''){
            return;
        }

        // make module path
        let path = (pathinfo.path=='/') ? pathinfo.path : pathinfo.parse_path[0];

        // find mymodule path
        const mymodule_path = routes[ path ];
        if(mymodule_path !==null)
        {
            // dynamic import mymodule
            new AsyncTask().doImport( mymodule_path )
            .then(Module => 
            {
                const componentActivity = new Module.ComponentActivity();
                componentActivity.do();
            });
        }
    });

    ProgressBar.close();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);