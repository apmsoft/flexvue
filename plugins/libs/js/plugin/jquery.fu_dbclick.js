/*
require(['fu_dbclick'],function(fu_dbclick){
  $("#test").fu_dbclick({
    click : function(obj, event){
      alert('one click');
    },
    dbclick : function(obj, event){
      alert('db click');
    }
  });
});
 */
// on click || double click
$.fn.fu_dbclick = function(callback, delay) {
    return this.each(function() {
        var self = this;
        var oneClickCallback = callback.click;
        var dbClickCallback = callback.dbclick;
        var clicks = 0;

        $(this).on('click', function(event) {
            clicks++;
            if (clicks == 1) {
                setTimeout(function() {
                    if (clicks == 1) {
                        if (!_.isNull(oneClickCallback) && _.isFunction(oneClickCallback)) {
                            oneClickCallback(self, event);
                        }
                    } else {
                        if (!_.isNull(dbClickCallback) && _.isFunction(dbClickCallback)) {
                            dbClickCallback(self, event);
                        }
                    }
                    clicks = 0;
                }, delay || 300);
            }
        });
    });
}
