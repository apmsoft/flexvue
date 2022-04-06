// class
export default class Template 
{
    constructor(){
    }

    async render(message) { // 비동기
        return await(`
        <div class="fvue--layout--container rounded-lg bg-white dark:bg-transport w-full !max-w-screen-sm !mx-auto !h-3/6 !max-h-screen-lg !min-h-2/3vh" >
        <div class="fvue--layout--header">
            <div class="fvue--layout--header--row py-3 px-3">
                <div class="fvue--layout--icon cursor-pointer text-gray-400" onclick="history.go(-1);return false;">
                    <i class="fas fa-arrow-left fa-2x"></i>
                </div>
                <div id="bottomthird_title" class="fvue--layout--title pl-3 text-2xl">
                    우편번호 검색
                </div>
                <div class="fvue--layout--spacer"></div>
                <div class="fvue--layout--navigation"></div>
              </div>
        </div>
        <div class="fvue--layout--main">
            <div class="!xl:container !xl:mx-auto" id="bottomthird_daumpostmap">
    
            </div>
        </div>
    </div>
        `);
    }
}