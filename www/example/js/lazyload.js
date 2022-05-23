/** lazyload */
import LazyLoad from '../../flexvue/plugins/lazyload/lazyload.esm.min.js';

const onReady = () => 
{
    function logElementEvent(eventName, element) {
        console.log(Date.now(), eventName, element.getAttribute("data-src"));
      }

    var callback_exit = function (element) {
        logElementEvent("🚪 EXITED", element);
    };
    var callback_loading = function (element) {
        logElementEvent("⌚ LOADING", element);
    };
    var callback_loaded = function (element) {
        logElementEvent("👍 LOADED", element);
    };
    var callback_error = function (element) {
        logElementEvent("💀 ERROR", element);
        element.src ="https://via.placeholder.com/440x560/?text=Error+Placeholder";
    };
    var callback_finish = function () {
        logElementEvent("✔️ FINISHED", document.documentElement);
    };
    var callback_cancel = function (element) {
        logElementEvent("🔥 CANCEL", element);
    };

    function executeLazyScript(element) {
        logElementEvent("🔑 ENTERED", element);
        var lazyFunctionName = element.getAttribute("data-lazy-function");
        var lazyFunction = lazyFunctions[lazyFunctionName];
        if (!lazyFunction) return;
        lazyFunction(element);
    }


    window.lazyFunctions = {
        foo: function (element) {
            element.style.color = "red";
            console.log("foo");
        },
        bar: function (element) {
            element.remove(element);
            console.log("bar");
        },
        buzz: function (element) {
            var span = document.createElement("span");
            span.innerText = " - buzz!";
            element.appendChild(span);
            console.log("buzz");
        },
        booya: function (element) {
            element.classList.add("boo");
            console.log("booya");
        }
    };

    var ll = new LazyLoad({
        unobserve_entered: true, // <- To avoid executing the script multiple times
        callback_enter: executeLazyScript, // Assigning the function defined above
        callback_exit: callback_exit,
        callback_cancel: callback_cancel,
        callback_loading: callback_loading,
        callback_loaded: callback_loaded,
        callback_error: callback_error,
        callback_finish: callback_finish
    });

    // lazyload
    // window.lazyLoadInstance = new LazyLoad({
        // container: document.querySelector("#left")
    // });
    // lazyLoadInstance.update();
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);