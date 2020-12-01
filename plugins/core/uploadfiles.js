
define(['jquery','underscore','backbone','css!uploadfiles/jquery.uploadfile.css','jqueryform','uploadfiles/jquery.uploadfile.min','libs/js/function/image_manager.min'],
function($, _, Backbone,css,jqueryform,uploadfile,fun) 
{
    var UploadableActivity = {
        params : {
            showDownload : false,
            previewWidth : '40px',
            previewHeight: '40px'
        },
        doc_id : '',
        target_id : '',
        initialize : function(target_id, doc_id, params){
            var self = this;

            self.target_id = target_id;
            self.doc_id = doc_id;
            _.extend(self.params, params);
        },
        run : function() {
            var self = this;

            var is_print_file = [];

            // console.log('------------->');
            console.log(app.docs[self.doc_id]);
            var feature = app.docs[self.doc_id]['uploadfiles_edit'];

            // set _urlRoot
            var _urlRoot = feature.value;
            if(!_.isNull(app.server_language) && app.server_language !=''){
                _urlRoot += app.server_language;
            }

            var upfilename = self.target_id;

            var settings ={
                url:            _urlRoot,
                formData:       {'upfilename':upfilename,doc_id:self.doc_id,token:self.params.token},
                dragDrop:       true,    // true | false
                fileName:       upfilename,       // input type name="upfilename"
                maxFileCount:   self.params.number_files_allowed,
                acceptFiles:    self.params.default,
                returnType:     'json',
                previewHeight:  self.params.previewHeight,
                previewWidth:   self.params.previewWidth,
                showDownload    :self.params.showDownload,
                showFileCounter:false,
                onLoad:function(obj)
                {
                    DocAsyncTask.doGetContents(app.docs[self.doc_id]['uploadfiles_load'], {
                        token: self.params.token,
                        doc_id: self.doc_id,
                        cache : false
                    }, {
                        success : function(tpl, resp){
                            _.each(resp.msg, function(files) {
                                obj.createProgress(
                                    files['hosturl'],
                                    files['sfilename'],
                                    files['ofilename'],
                                    files['fullname'].replace('/s/', '/'),
                                    files['file_size'],
                                    files['file_type'],
                                    files['image_size']
                                );
                            });

                            $('.ajax-file-upload-preview').unbind('click');
                            $('.ajax-file-upload-preview').on('click', function(e) {
                                e.preventDefault();
                                var this_url = app.host_url + $(this).attr('src');
                                this_url = this_url.replace('/m/', '/');
                                var wndowOpen = window.open("about:blank");
                                wndowOpen.location.href = this_url;
                            });
                        },
                        fail : function(resp){
                            alert(resp.msg);
                        }
                    });
                },
                onSuccess:function(files,data,xhr)
                {
                    // result false
                    if(typeof(data.result) != 'undefined'){
                        if(data.result == 'false'){
                            alert(data.msg);
                            $(target_id).focus();
                            return;
                        }
                    }

                    // $('.ajax-file-upload-preview').unbind('click');
                    // $('.ajax-file-upload-preview').on('click', function(e) {
                    //     e.preventDefault();
                    //     var this_url = $(this).attr('src');
                    //     this_url = this_url.replace('/m/', '/');
                    //     var wndowOpen = window.open("about:blank");
                    //     wndowOpen.location.href = app.host_url + this_url;
                    // });

                    $('.ajax-file-upload-preview').unbind('click');
                    $('.ajax-file-upload-preview').on('click', function() {
                        var data_filename = $(this).data('filename');
                        if (!_.contains(is_print_file, data_filename)) {
                            var data_width = $(this).data('width');
                            var data_height = $(this).data('height');
                            var img_src = $(this).attr('src');
                            var image_resize = calculateAspectRatioFit(data_width, data_height, 400, 400);

                            var image_contents = '<div><a href="' + app.host_url+img_src + '" target="_blank"><img class="data-gallery lazy" data-filename="' + data_filename + '" data-original="' + img_src + '" src=' + img_src + ' style="width:' + image_resize.width + 'px; height:' + image_resize.height + 'px;"></a></div>';

                            // ckEditor
                            if ($("#cke_description iframe").hasClass("cke_wysiwyg_frame")) {
                                $('.cke_wysiwyg_frame').contents().find('body').append(image_contents);
                            }
                            // sommernote
                            else if ($("div").hasClass("note-editable")) {
                                $('.note-editable').append(image_contents);
                            }

                            is_print_file.push(data_filename);
                        }
                    });

                    console.log(data);

                    // // ani
                    // $('#body_middle_contents button[type="submit"]').animateCss('flash');

                    // $("#body_middle_contents #theCompanyForm").submit(function(){return true;});
                },
                showDelete:true,
                deleteCallback: true,
                deleteCallback: function(data, pd)
                {
                    var data_count = data.length;
                    for(var i=0;i<data_count;i++)
                    {
                        var ofilename =data[i]['ofilename'];
                        var file_type =data[i]['file_type'];
                        var fullname  =data[i]['fullname'];
                        var sfilename =data[i]['sfilename'];

                        // 첨부파일삭제
                        DocAsyncTask.doPostMessage(app.src+"/uploadfiles/delete",{
                            token: self.params.token,
                            doc_id: self.doc_id,
                            op: 'delete',
                            name: sfilename
                        }, {
                            success : function(resp){
                            },
                            fail : function(resp){
                                alert(resp.msg);
                            }
                        });
                    }
                },
                downloadCallback:function(data,pd){
                    var this_url = data[0].fullname;
                    this_url = this_url.replace('/m/', '/');
                    var wndowOpen = window.open("about:blank");
                    wndowOpen.location.href = app.host_url+this_url;
                }
            };
            // <div id="#mulitplefileuploader"></div>
            $(self.target_id).uploadFile(settings);
        }
    };

    return UploadableActivity;
});
