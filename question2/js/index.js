(function () {
  // 因环境不支持commonjs，模拟一个
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};

  var util = {
    extend: function (target) {
      for (var i = 1, len = arguments.length; i < len; i++) {
        for (var prop in arguments[i]) {
          if (arguments[i].hasOwnProperty(prop)) {
            target[prop] = arguments[i][prop];
          }
        }
      }

      return target;
    },
  };

  function LazyloadImages(opts) {
    this.opts = util.extend({}, this.constructor.defaultOpts, opts);
    this.init(opts.node);
  }

  LazyloadImages.defaultOpts = {
    node: "",
  };

  var proto = LazyloadImages.prototype;
  /* 初始化
   * @method init
   * @return void
   */
  proto.init = function (node) {
    this.oimgs = document.querySelectorAll(node);
    this.lazyLoad(this.oimgs);
  };
  /* 绑定dom事件
   * @method bindEvent
   * @return void
   */
  (proto.bindEvent = function () {}),
    /* 获取页面顶部
     * @method getTop
     * @return void
     */
    (proto.getTop = function (e) {
      var T = e.offsetTop;
      while ((e = e.offsetParent)) {
        T += e.offsetTop;
      }
      return T;
    });
  /* 懒加载图片
   * @method lazyLoad
   * @param {Dom} imgs 懒加载img dom
   * @return void
   */
  proto.lazyLoad = function (imgs) {
    var H = document.documentElement.clientHeight; //获取可视区域高度
    var S = document.documentElement.scrollTop || document.body.scrollTop;
    for (var i = 0; i < imgs.length; i++) {
      if (
        H + S > this.getTop(imgs[i]) &&
        this.getTop(imgs[i]) > S - imgs[i].height
      ) {
        if (imgs[i].src) {
        } else {
          imgs[i].src = imgs[i].getAttribute("data-src");
        }
      }
    }
  };

  // 判断当前环境是否支持模块导出
  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = LazyloadImages;
    }
    exports.LazyloadImages = LazyloadImages;
  } else {
    root.LazyloadImages = LazyloadImages;
  }
})();

window.onload = window.onscroll = function () {
  new LazyloadImages({
    node: 'img'
  })
};
