import Forms from '../../flexvue/core/forms.class.min.js';

/** ckeditor5 */
import {} from '../../flexvue/plugins/ckeditor5/ckeditor.js';

const onReady = () => 
{
    // editor
    ClassicEditor.create( document.querySelector( '#description' ),{
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo'
            ]
        },
        language: 'ko',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
    })
    .then(editor => {
        window.editor = editor;
        window.editor.editing.view.focus();

        // $('.ck-editor').addClass('noSwipe');
    })
    .catch( error => {
        Log.e( error );
    });


    // submit
    new Forms('#theForm').doSubmit((form_params)=>
    {
        form_params['description'] = encodeURIComponent( window.editor.getData());
        let send_params = Object.assign({}, form_params);
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);