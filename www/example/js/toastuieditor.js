import Forms from '../../flexvue/core/forms.class.min.js';
import {} from '../../flexvue/plugins/@toast-ui/editor/dist/toastui-editor.js';
import {ColorPicker} from '../../flexvue/plugins/@toast-ui/editor/plugin/tui-color-picker.min.js';

// const Editor = toastui.Editor;
const onReady = () => 
{
    // const {Editor} = toastui;
    // const {colorPicker} = Editor.plugin;
    const editor = new toastui.Editor({
        el: document.querySelector('#description'),
        height: '500px',
        previewStyle: 'vertical',
        initialEditType: 'markdown',
        plugins:[colorPicker]
    });
    
    // submit
    new Forms('#theForm').doSubmit((form_params)=>
    {
        const content = editor.getMarkdown();
        form_params['description'] = encodeURIComponent( editor.getMarkdown() );
        let send_params = Object.assign({}, form_params);
        Log.d (send_params);

        // const v = document.querySelector('#v');
        // v.innerHTML = editor.getMarkdown();

        const viewer = new toastui.Editor.factory({
            el: document.querySelector('#v'),
            viewer : true,
            initialValue: content
        });
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);