"use strict";
export default class ScrollAgent {
    /**
     * Global
     * @param ['notice','setting'] channel 
     */
    
    constructor (channel){
        this.TAG = 'ScrollAgent';
        this.version = '1.1';
        this.channel = channel;
        this.scrollerVertical = null;
        this.scrollerHorizontal = null;
        this.keys = {37: 1, 38: 1, 39: 1, 40: 1};
        this.supportsPassive = false;
        this.wheelOpt = false;
        this.wheelEvent = 'mousewheel';
        this.floatEl = null;
        this.floatElScrollPos = 500;
    }

    /**
     * 
     * @param {#button-go-top} elId 
     * @param {500} pos 
     * @param {콜백함수} callback 
     */
    addFloatListener (elId, pos, callback){
        const self = this;

        this.floatEl = document.querySelector(elId);
        if(this.floatEl)
        {
            Log.d(`${this.TAG} :: addFloatListener ----->`,'elId : '+elId, 'pos : '+pos, '<---------//');
            self.floatElScrollPos = pos || 500;
            Handler.post(function(){
                if(!self.floatEl.classList.contains('hidden')){
                    self.floatEl.classList.add('hidden');
                }
            },1);
            
            if(typeof callback === 'function'){
                callback(this.floatEl);
            }
        }
    }

    /**
     * 
     * @param [vertical || horizontal] mode 
     * @param '#left--layout-main' scrollTarget 
     */
    addScrollListener(mode, scrollTarget){
        Log.d(`${this.TAG} :: addScrollListener ----->`,'mode : '+mode, 'channel : '+this.channel, 'scrollTarget : '+ scrollTarget, '<---------//');
        if(mode == 'vertical'){
            this.scrollerVertical = document.querySelector(scrollTarget);
            this.scrollerVertical.dataset.scrollch = this.channel;
            this.startVertical();
        }else if(mode == 'horizontal'){
            this.scrollerHorizontal = document.querySelector(scrollTarget);
            this.scrollerHorizontal.dataset.scrollch = this.channel;
            this.startHorizontal();
        }
    }

    /**
     * 
     * @param {'notice || setting'} channel 
     * @param {'#left--layout-main'} scrollElId 
     */
    startVertical ()
    {
        // Log.d(`${this.TAG} :: startVertical ----->`);
        const self = this;

        // 스크롤 캡쳐
        if(this.scrollerVertical)
        {
            this.scrollerVertical.addEventListener("scroll", function(event)
            {
                const _ch = event.target.dataset.scrollch;
                let tpos = this.scrollTop;
                if(_ch == self.channel){
                    // Log.d("+++++ >"+_ch+' '+tpos);
                    ScrollObserver._setPos(self.channel,tpos);
                }

                // float Layout
                if(self.floatEl)
                {
                    // Log.d(tpos +'<'+ this.floatElScrollPos);
                    if(tpos < self.floatElScrollPos){
                        if(!self.floatEl.classList.contains('hidden')){
                            self.floatEl.classList.add('hidden');
                        }
                    }else{
                        if(self.floatEl.classList.contains('hidden')){
                            self.floatEl.classList.remove('hidden');
                        }
                    }
                }
            });

            try {
                window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                    get: function () { self.supportsPassive = true; } 
                }));
            } catch(e) {}

            self.wheelOpt = self.supportsPassive ? { passive: false } : false;
            self.wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        }
    }

    startHorizontal(){
        Log.d(`${this.TAG} :: startHorizontal ----->`);
        const self = this;

        if(self.scrollerHorizontal){
            self.scrollerHorizontal.addEventListener("scroll", function(event){
                const _ch = event.target.dataset.scrollch;
                if(_ch == self.channel){
                    // Log.d("+++++ >"+_ch+' '+tpos);
                    ScrollObserver._setPos(self.channel,this.scrollLeft);
                }
            });
        }
    }

    // 해당채널 스크롤 포지션 값 가져오기
    getPos (){
        let pos = 0;
        try{
            pos = ScrollObserver._getPos (this.channel);
            Log.d(`${this.TAG} :: getPos ----->`,'pos : '+pos, '<---------//');
        }catch(e){
            Log.d(e);
        }
    return pos;
    }

    // 좌표값 구하려는 대상 #id
    getPosById (target){
        let pos = 0;
        const obj = document.querySelector(`#${target}`);
        if(obj){
            pos = obj.offsetTop;
        }
    return pos;
    }

    // 해달 채널 포지션 초기화
    resetPos (){
        Log.d(`${this.TAG} :: resetChannelTopPos ----->`,'channel : '+this.channel+', position : 0', '<---------//');
        ScrollObserver._setPos(this.channel,0);
    }

    // 스크롤 이동시키기
    scrollTo(params,delaytime =null){
        Log.d(`${this.TAG} :: scrollTo`);
        const self = this;
        const dtime = delaytime || 0;

        Handler.post(function(){
            if(self.scrollerVertical){
                self.scrollerVertical.scrollTo(params);
            }
        },dtime);
    }

    // 스크롤 left 이동
    scrollToLeft (params,delaytime =null){
        Log.d(`${this.TAG} :: scrollLeft`);

        const self = this;
        const dtime = delaytime || 0;
        Handler.post(function(){
            if(self.scrollerHorizontal){
                self.scrollerHorizontal.scrollTo(params);
            }
        },dtime);
    }

    // 스크롤 맨아래로 이동시키기 bottom
    scrollToBottom (delaytime =null){
        const self = this;
        const dtime = delaytime || 0;

        if(self.scrollerVertical){
            Handler.post(function(){
                const pos = self.scrollerVertical.scrollHeight;
                self.scrollerVertical.scrollTo({top: pos});
            },dtime);
        }
    }

    preventDefault(e) {
        try{
            e.stopImmediatePropagation();
            e.preventDefault();
        }catch(e){

        }
    }

    preventDefaultForScrollKeys(e) {
        if (this.keys[e.keyCode]) {
            this.preventDefault(e);
            return false;
        }
    }

    // 스크롤 캡쳐 멈추기
    disableScroll() {
        Log.d(`${this.TAG} :: disableScroll`);
        if(this.scrollerVertical){
            this.scrollerVertical.addEventListener('DOMMouseScroll', this.preventDefault, false); // older FF
            this.scrollerVertical.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); // modern desktop
            // this.scrollerVertical.addEventListener('touchmove', this.preventDefault, this.wheelOpt); // mobile
            this.scrollerVertical.addEventListener('touchmove', this.preventDefault, false); // mobile
            this.scrollerVertical.addEventListener('keydown', this.preventDefaultForScrollKeys, false);
        }
    }
    
    // 스크롤 캡쳐 활성화
    enableScroll() {
        Log.d(`${this.TAG} :: enableScroll`);
        if(this.scrollerVertical){
            this.scrollerVertical.removeEventListener('DOMMouseScroll', this.preventDefault, false);
            this.scrollerVertical.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); 
            // this.scrollerVertical.removeEventListener('touchmove', this.preventDefault, this.wheelOpt);
            this.scrollerVertical.removeEventListener('touchmove', this.preventDefault);
            this.scrollerVertical.removeEventListener('keydown', this.preventDefaultForScrollKeys, false);
        }
    }
}