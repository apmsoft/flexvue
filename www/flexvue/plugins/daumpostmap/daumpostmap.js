"use strict";
import UrlManager from '../../core/urlmanager.class.min.js';
// import Template from '../../core/template.class.min.js';
import Template from '../../plugins/daumpostmap/daumpostmap.tpl.js';

class DaumPostMap 
{
    constructor(target_id, map_x ,map_y){
        this.target_id = target_id;
        this.map_x = map_x || 127.489093909065;
        this.map_y = map_y || 36.6423200323081;
        this.map = null;
        this.doPrintMap({});
    }

    doPrintMap (params){
        let self = this;

        if( typeof params.lat !=='undefined' ){
            self.map_y = params.lat;
        }
        if( typeof params.lon !=='undefined' ){
            self.map_x = params.lon;
        }
        
        var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new daum.maps.LatLng( self.map_y,  self.map_x), // 지도의 중심좌표
            level: 2 // 지도의 확대 레벨
        };  

        // 지도를 생성합니다    
        self.map = new daum.maps.Map(mapContainer, mapOption);

        // 마커가 표시될 위치입니다 
        var markerPosition  = new daum.maps.LatLng(self.map_y, self.map_x); 

        var marker = new daum.maps.Marker({
            position: markerPosition
        });

        marker.setMap(self.map);
    }


    doPostCodeAddress (target_postcode, target_address,jubun_address)
    {
        let self = this;

        // 우편번호찾기
        document.querySelector(this.target_id).addEventListener('click',function()
        {
            // panel
            Activity.onStart('#bottomthird');

            // url
            const urlManager = new UrlManager(document.location);
            urlManager.pushState('postcode','postcode', `${urlManager.pathname}?${urlManager.makeJSON2URL({mode :'postcode'})}`);

            // 템플릿 파일 가지고 오기
            new Template().render( {} )
            .then(tpl =>
            {
                const outhtml_el = document.querySelector('#bottomthird');
                outhtml_el.innerHTML = tpl;

                return true;
            })
            .then(() =>{
                // target_id
                var postcode_layer = document.getElementById('bottomthird_daumpostmap');
                        
                //load함수를 이용하여 core스크립트의 로딩이 완료된 후, 우편번호 서비스를 실행합니다.
                daum.postcode.load(function()
                {
                    new daum.Postcode(
                    {
                        oncomplete: function(data) 
                        {
                            Log.d(data);

                            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                            let fullAddr = ''; // 최종 주소 변수
                            let extraAddr = ''; // 조합형 주소 변수

                            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
                            if(data.userSelectedType === 'R')
                            {
                                //법정동명이 있을 경우 추가한다.
                                if(data.bname !== ''){
                                    extraAddr += data.bname;
                                }
                                // 건물명이 있을 경우 추가한다.
                                if(data.buildingName != ''){
                                    extraAddr += (extraAddr != '') ? `, ${data.buildingName}` : data.buildingName;
                                }
                                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                                fullAddr += (extraAddr !== '' ? ` (${extraAddr})` : '');
                            }

                            // set postcode value
                            let area = '';
                            if(document.querySelector('#post_area'))
                            {
                                area = data.sido;
                                // if(area == '서울'){
                                //     area = area+'/'+data.sigungu;
                                // }else if(area == '제주특별자치도'){
                                //     area = area+'/'+data.sigungu;
                                // }else if(area == '경기' 
                                //     || area == '강원'
                                //     || area == '충북'
                                //     || area == '충남'
                                //     || area == '전북'
                                //     || area == '전남'
                                //     || area == '경북'
                                //     || area == '경남'
                                // ){
                                //     var sg_argv = data.sigungu.split('시');
                                //     area = data.sido+'/'+sg_argv[0];
                                // }else {
                                //     area = data.sido
                                // }

                                document.querySelector('#post_area').value = area;
                            }
                            
                            document.querySelector(target_postcode).value = data.zonecode;
                            document.querySelector(target_address).value = `${data.roadAddress} ${fullAddr}`;

                            // $('#'+ids[0]+'_postcode').val(data.postcode1+''+data.postcode2);
                            if(jubun_address !== null && jubun_address !=''){
                                if(typeof data.jibunAddress !=='undefined'){
                                    document.querySelector(jubun_address).value = `${data.jibunAddress} ${fullAddr}`;
                                }else{
                                    document.querySelector(jubun_address).value = `${data.sido} ${data.sigungu} ${data.query} ${fullAddr}`;
                                }
                            }

                            // 주소로 좌표값 얻기;
                            geocoder.addressSearch(data.jibunAddress+' '+fullAddr, function(result, status) 
                            {
                                Log.d(result);

                                if(status === daum.maps.services.Status.OK) 
                                {
                                    document.querySelector('#lat').value = result[0].y;
                                    document.querySelector('#lon').value = result[0].x;

                                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                                    // LatLngBounds 객체에 좌표를 추가합니다
                                    var bounds = new daum.maps.LatLngBounds();

                                    var marker = new daum.maps.Marker({
                                        map: self.map,
                                        position: new daum.maps.LatLng(result[0].y, result[0].x) 
                                    });
                                    bounds.extend(new daum.maps.LatLng(result[0].y, result[0].x));

                                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                                    self.map.setBounds(bounds);
                                }
                            });

                            // close panel
                            Activity.onStop('#bottomthird');
                            // history.go(-2);
                        },
                        width : '100%',
                        height : '500px',
                        maxSuggestItems : 5
                    }).embed(postcode_layer);
                });
            });
        });
    }
}

export {DaumPostMap};