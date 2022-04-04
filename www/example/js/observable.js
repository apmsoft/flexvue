const onReady = () => 
{
  class A {
    constructor(el){
      this.$target = el;
    }

    // notify update
    update(message){
      document.querySelector( this.$target).innerHTML = `CLASS A : ${message}`;
    }
  }

  class B {
    constructor(el){
      this.$target = el;
    }

    // notify update
    update(message){
      document.querySelector( this.$target).innerHTML = `CLASS B : ${message}`;
    }
  }

  const observable = new Observable(['public','sub']);
  observable.subscribe('public', new A('#public_a'));
  observable.subscribe('public', new B('#public_b'));
  observable.subscribe('sub', new B('#sub_a'));
  observable.subscribe('sub', new B('#sub_b')); // 같은 채널의 중복 클래스 제거

  observable.notify('public', 'public 채널 message 테스트');
  observable.notify('sub', 'sub 채널 message 테스트');
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);