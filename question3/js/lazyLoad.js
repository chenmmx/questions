(function () {
  // 若环境不支持commonjs，模拟一个
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};

  var lazyloadImages = {
    data: {
      oimgs: null,
    },
    /* 初始化
     * @method init
     * @return void
     */
    init: function () {
      this.data.oimgs = document.querySelectorAll("img");
      this.lazyLoad(this.data.oimgs);
    },
    /* 绑定dom事件
     * @method bindEvent
     * @return void
     */
    bindEvent: function () {},
    /* 获取页面顶部
     * @method getTop
     * @return void
     */
    getTop: function (e) {
      var T = e.offsetTop;
      while ((e = e.offsetParent)) {
        T += e.offsetTop;
      }
      return T;
    },
    /* 懒加载图片
     * @method lazyLoad
     * @param {Dom} imgs 懒加载img dom
     * @return void
     */
    lazyLoad: function (imgs) {
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
    },
  };

  // 判断当前环境是否支持模块导出
  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = lazyloadImages;
    }
    exports.lazyloadImages = lazyloadImages;
  } else {
    root.lazyloadImages = lazyloadImages;
  }
})();