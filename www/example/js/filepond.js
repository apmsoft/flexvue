/** filepond */
import {} from '../../flexvue/plugins/filepond/dist/filepond-plugin-file-validate-size.min.js';
import {} from '../../flexvue/plugins/filepond/dist/filepond-plugin-file-validate-type.min.js';
import {} from '../../flexvue/plugins/filepond/dist/filepond-plugin-image-preview.min.js';
import * as FilePond from '../../flexvue/plugins/filepond/dist/filepond.esm.min.js';

const onReady = () => 
{
    // filepond
    FilePond.registerPlugin(
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );

    const inputElement = document.querySelector('input[type="file"]');
    const pond = FilePond.create( inputElement,{
        name: inputElement,
        maxFiles: 1,
        allowBrowse: true,
        allowImagePreview: true,
        // server: {
        //     url: config.src+'/popup/upload',
        //     process: {
        //         url: '/process.php',
        //         method: 'POST',
        //         withCredentials: false,
        //         headers: {},
        //         timeout: 7000,
        //         onload: (response) => {
        //             console.log('onload');
        //             console.log(response);
        //             return response.key;
        //         },
        //         onerror: (response) => {
        //             console.log('onerror');
        //             console.log(response);
        //             return response.data;
        //         },
        //         ondata: (formData) => {
        //             formData.append('extract_id', resp.msg.extract_id);
        //             return formData;
        //         }
        //     },
        //     revert : null,
        //     load : null,
        //     fetch : null,
        //     restore : null
        // }
    });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);