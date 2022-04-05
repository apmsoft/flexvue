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

  class C {
    constructor(){
      this.history = [];
    }

    // notify update
    update(message){
      this.history.push(message);
      Log.d(this.history);
    }
  }

  window.observable = new Observable(['public','sub','dds']);
  observable.subscribe('public', new A('#public_a'));
  observable.subscribe('public', new B('#public_b'));
  observable.subscribe('public', new C());

  observable.subscribe('sub', new B('#sub_a'));
  observable.subscribe('sub', new B('#sub_b')); // 같은 채널의 중복 클래스 제거

  observable.subscribe('dds', new A('#public_a'));

  // observable.notify('public', {chart:-1, monitor:0});
  observable.notify('sub', 'sub 채널 message 테스트');

  document.getElementById('ddd').addEventListener('change', function(e) {
    Log.d(this.value);
    // observable.notify('public', this.value);
    observable.notify('public', this.value);
  });
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);