"use strict";

// 01011112222 -> 010-1111-2222, 15881234 -> 1588-1234
const phone_format = (str) => {
    let result = ('' + str).replace(/\D/g, '');
    let match1 = result.match(/^(\d{3})(\d{4})(\d{4})$/);
    let match2 = result.match(/^(\d{4})(\d{4})$/);
    if (match1) {
        result = [match1[0],match1[1],match1[2]].join('-');
    }else if (match2) {
        result = [match2[0],match2[1]].join('-');
    }
return result;
}

// 10000 -> 10,000
const number_format  = (num, locale = 'ko-KR') => {
    let result = '';
    let nb = num.replace(/[^0-9]/g, '');
    if(nb > 0){
        result = new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(num);
    }
return result;
}

// 8000 -> 8 KB
const filesize_format = (bytes) => {
    if (bytes == 0) return '0 Byte';
    let k = 1000;
    let dm = 3;
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// youtube url 주소에서 id 추출
const find_youtube_id = (url) => {
    let result = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length == 11) {
        result = match[2]; 
    }
return result;
}

// 랜덤 숫자
const random_number = (min,max) =>{
    return Math.floor(Math.random()*(max-min+1)+min);
}

export {phone_format, number_format, filesize_format, find_youtube_id, random_number};