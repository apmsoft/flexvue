const onReady = () => 
{
    const app = new App();
    Log.i(App.browser, App.version, App.os, App.lang);
    
    // activity
    new Activity().onCreateView();
    Activity.onBackPressed((state)=>{
        Log.i('onBackPressed : '+state);
    });

    // progress init
    new ProgressBar();

    // show progress
    ProgressBar.show();

    // nav click event
    document.querySelectorAll('a').forEach((el)=>{
        el.addEventListener('click', (e)=>{
            e.preventDefault();
    
            Log.d(el.getAttribute("href"));
        },false);
    });

    // close pregress
    ProgressBar.close();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);