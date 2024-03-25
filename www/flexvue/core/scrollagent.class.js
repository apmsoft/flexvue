export default class ScrollAgent {
    constructor(channel) {
      this.TAG = 'ScrollAgent';
      this.version = '1.3';
      this.channel = channel;
      this.scrollerVertical = null;
      this.scrollerHorizontal = null;
      this.keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
      this.supportsPassive = false;
      this.wheelOpt = false;
      this.wheelEvent = 'mousewheel';
      this.floatEl = null;
      this.floatElScrollPos = 500;
    }
    addFloatListener(elId, pos, callback) {
      const self = this;
      this.floatEl = document.querySelector(elId);
      if (this.floatEl) {
        self.floatElScrollPos = pos || 500;
        Handler.post(function () {
          if (!self.floatEl.classList.contains('hidden')) {
            self.floatEl.classList.add('hidden');
          }
        }, 1);
        if (typeof callback === 'function') {
          callback(this.floatEl);
        }
      }
    }
    addScrollListener(mode, scrollTarget, callback = null) {
      const self = this;
      if (mode === 'vertical') {
        this.scrollerVertical = document.querySelector(scrollTarget);
        if (this.scrollerVertical) {
          this.scrollerVertical.dataset.scrollch = this.channel;
          this.startVertical(function (pos) {
            if (typeof callback === 'function') {
              callback(pos);
            }
          });
        }
      } else
      if (mode === 'horizontal') {
        this.scrollerHorizontal = document.querySelector(scrollTarget);
        if (this.scrollerHorizontal) {
          this.scrollerHorizontal.dataset.scrollch = this.channel;
          this.startHorizontal(function (pos) {
            if (typeof callback === 'function') {
              callback(pos);
            }
          });
        }
      }
    }
    startVertical(callback) {
      // 스크롤 캡쳐
      if (this.scrollerVertical) {
        this.scrollerVertical.addEventListener("scroll", (event) => {
          const target = event.target;
          const _ch = target.dataset.scrollch;
          let tpos = target.scrollTop;
          if (_ch !== 'undefined' && _ch === this.channel) {
            ScrollObserver._setPos(this.channel, tpos);
          }
          // float Layout
          if (this.floatEl) {
            if (tpos < this.floatElScrollPos) {
              if (!this.floatEl.classList.contains('hidden')) {
                this.floatEl.classList.add('hidden');
              }
            } else
            {
              if (this.floatEl.classList.contains('hidden')) {
                this.floatEl.classList.remove('hidden');
              }
            }
          }
          callback(tpos);
        });
        // try {
        //     window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        //         get: () => { this.supportsPassive = true; }
        //     }));
        // } catch (e) { }
        this.wheelOpt = this.supportsPassive ? { passive: false } : false;
        this.wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
      }
    }
    startHorizontal(callback) {
      const self = this;
      if (this.scrollerHorizontal) {
        this.scrollerHorizontal.addEventListener("scroll", (event) => {
          const target = event.target;
          const _ch = target.dataset.scrollch;
          const lpos = this.scrollerHorizontal.scrollLeft;
          if (_ch === self.channel) {
            // Log.d("+++++ >" + _ch + ' ' + tpos);
            ScrollObserver._setPos(this.channel, lpos);
          }
          callback(lpos);
        });
      }
    }
    getPos() {
      let pos = 0;
      try {
        pos = ScrollObserver._getPos(this.channel);
      }
      catch (e) {
        Log.d(e);
      }
      return pos;
    }
    getPosById(target) {
      let pos = 0;
      const obj = document.querySelector(`#${target}`);
      if (obj) {
        pos = obj.offsetTop;
      }
      return pos;
    }
    resetPos() {
      ScrollObserver._setPos(this.channel, 0);
    }
    scrollTo(params, delaytime) {
      const self = this;
      const dtime = delaytime || 0;
      Handler.post(function () {
        if (self.scrollerVertical) {
          self.scrollerVertical.scrollTo(params);
        }
      }, dtime);
    }
    scrollToLeft(params, delaytime) {
      const self = this;
      const dtime = delaytime || 0;
      Handler.post(function () {
        if (self.scrollerHorizontal) {
          self.scrollerHorizontal.scrollTo(params);
        }
      }, dtime);
    }
    scrollToBottom(delaytime) {
      const self = this;
      const dtime = delaytime || 0;
      if (self.scrollerVertical) {
        Handler.post(function () {
          var _a, _b;
          const pos = (_a = self.scrollerVertical) === null || _a === void 0 ? void 0 : _a.scrollHeight;
          (_b = self.scrollerVertical) === null || _b === void 0 ? void 0 : _b.scrollTo({ top: pos });
        }, dtime);
      }
    }
    preventDefault(e) {
      try {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      catch (e) {
      }
    }
    preventDefaultForScrollKeys(e) {
      if (this.keys[e.keyCode]) {
        this.preventDefault(e);
        return false;
      }
    }
    disableScroll() {
      if (this.scrollerVertical) {
        this.scrollerVertical.addEventListener('DOMMouseScroll', this.preventDefault, false); // older FF
        this.scrollerVertical.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); // modern desktop
        // this.scrollerVertical.addEventListener('touchmove', this.preventDefault, this.wheelOpt); // mobile
        this.scrollerVertical.addEventListener('touchmove', this.preventDefault, false); // mobile
        this.scrollerVertical.addEventListener('keydown', this.preventDefaultForScrollKeys, false);
      }
    }
    enableScroll() {
      if (this.scrollerVertical) {
        this.scrollerVertical.removeEventListener('DOMMouseScroll', this.preventDefault, false);
        this.scrollerVertical.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
        // this.scrollerVertical.removeEventListener('touchmove', this.preventDefault, this.wheelOpt);
        this.scrollerVertical.removeEventListener('touchmove', this.preventDefault);
        this.scrollerVertical.removeEventListener('keydown', this.preventDefaultForScrollKeys, false);
      }
    }
  }