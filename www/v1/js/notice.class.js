import {UrlManager} from '../../flexvue/core/urlmanager.class.min.js';
import {Template} from '../../flexvue/core/template.class.min.js';
import {Forms} from '../../flexvue/core/forms.class.min.js';
import {AsyncTask} from '../../flexvue/core/asynctask.class.min.js';

class Notice {
    constructor(){
    }

    doList(params)
    {
        // show progress
        ProgressBar.show();

        // self
        const self = this;

        // panel
        Activity.onStart('#right');

        // url
        const urlManager = new UrlManager(document.location);
        urlManager.mergeURLParams({page:1});
        urlManager.pushState('notice_list','notice', `${urlManager.pathname}?${urlManager.makeJSON2URL({})}`);

        document.querySelector('#right_title').innerText = R.strings('app_name');
        // multiout
        Promise.all([
            new AsyncTask().doGet(`${config.res}/values/strings${App.getLocale()}.json`, {}), 
            new Template().readFile(`${config.asset}/tpl/test2.html`, '#tpl_test2')
        ]).then((data) => {
            const tpl = data[1];
            const resp = data[0];

            new Promise((resolve)=>{
                document.querySelector('#right_docs_contents').innerHTML = new Template().render(tpl,resp);
                resolve(true);
            }); 
        }).then(()=>{
            document.querySelector('p').addEventListener('click',(el)=>{
                alert(el.innerText);
            });

            flatpickr("#end_date", {});

            // editor
            ClassicEditor.create( document.querySelector( '#description2' ),{
                toolbar: {
                    items: [
                        'heading','|','bold','italic','link','|','blockQuote','insertTable','mediaEmbed','undo','redo'
                    ]
                },
                language: 'ko'
            })
            .then(editor => {
                window.editor = editor;
                window.editor.editing.view.focus();

                // $('.ck-editor').addClass('noSwipe');
            })
            .catch( error => {
                console.error( error );
            });
        }).finally(()=>{ ProgressBar.close(); } );
    }
}

export {Notice};