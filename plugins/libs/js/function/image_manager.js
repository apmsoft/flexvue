// 이미지 원하는 사이즈로 리사이징 하기
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
	var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	return { width: srcWidth*ratio, height: srcHeight*ratio };
}

// 이미지 스캔해서 원하는 사이즈로 변경하기
//{target_id : '.thumbnail', width:'200px', height:'200px'}
function findImageResize(obj){
	var maxWidth  = obj.width;
	$(obj.target_id).each(function()
	{
		if(maxWidth=='100%'){
			$(this).css("width", '100%');
			$(this).css("height", 'auto');
		}else{
			var maxHeight = obj.height;
			var ratio     = 0;
			var srcWidth  = $(this).width();
			var srcHeight = $(this).height();

		    var image_resize = calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight);
		    $(this).css('width', image_resize.width+'px');
		    $(this).css('height', image_resize.height+'px');
		}
	});
}

// 이미지 삭제하기
function findRemoveImage(obj,filename){
	$(obj).each(function()
	{
		var infilename  = $(this).data('filename');
		//alert(infilename+' == '+filename);
		if(filename==infilename){
			$(this).remove();
		}
	});
}
