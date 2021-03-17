"use strict";
class TextUtil {
    // 01011112222 -> 010-1111-2222
    static phone_format(num) {
        let result = num.replace(/[^0-9]/g, '');
        if (num.length < 4) {
            result = num;
        } else if (num.length < 7) {
            result = `${num.substr(0, 3)}-${num.substr(3)}`;
        } else if (num.length < 11) {
            result = `${num.substr(0, 3)}-${num.substr(3, 3)}-${num.substr(6)}`;
        } else {
            result = `${num.substr(0, 3)}-${num.substr(3, 4)}-${num.substr(7)}`;
        }
    return result;
    }

    // 8000 -> 8 KB
    static filesize_format(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        let k = 1000;
        let dm = decimals + 1 || 3;
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // youtube url 주소에서 id 추출
    static get_youtube_id(url) {
        let result = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            result = match[2]; 
        }
    return result;
    }

    // 랜덤 숫자
    randomNumber(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}

export {TextUtil};