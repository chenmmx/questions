var lazyloadImages = require("./lazyLoad");

(function () {
  // 若环境不支持commonjs，模拟一个
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};

  // render news list
  var renderList = {
    data: {
      queryList: [],
      onews: null,
      // oprev: null,
      onext: null,
      pageIndex: 1,
      pageSize: 10,
      cacheList: [],
    },
    /* 初始化
     * @method init
     * @return void
     */
    init: function () {
      this.data.onews = document.querySelector(".main");
      // this.data.oprev = document.querySelector(".footer .pagination-prev");
      this.data.onext = document.querySelector(".footer .pagination-next");
      this.renderNewsListByPage(
        this.data.pageIndex,
        this.data.pageSize,
        "",
        true
      );
      this.bindEvent();
    },
    /* 绑定dom事件
     * @method bindEvent
     * @return void
     */
    bindEvent: function () {
      // this.data.oprev.onclick = this.handlePrevClick.bind(this);
      this.data.onext.onclick = this.handleNextClick.bind(this);
    },
    /* 搜索
     * @method handleSearch
     * @param {String} query 查询字段
     * @return void
     */
    handleSearch: function (query) {
      this.data.pageIndex = 1;
      this.data.pageSize = 10;
      this.renderNewsListByPage(this.data.pageIndex, this.data.pageSize, query);
    },
    /* 上一页
     * @method handlePrevClick
     * @return void
     */
    // handlePrevClick() {
    //   this.data.pageIndex--;
    //   if (this.data.pageIndex <= 1) {
    //     this.data.oprev.style.display = "none";
    //   }
    //   this.renderNewsListByPage(this.data.pageIndex, this.data.pageSize);
    // },
    /* 上一页
     * @method handleNextClick
     * @return void
     */
    handleNextClick() {
      this.data.pageIndex++;
      // if (this.data.pageIndex > 1) {
      //   this.data.oprev.style.display = "block";
      // }
      var length = this.data.queryList.length;
      if (Math.floor(length / this.data.pageSize) <= this.data.pageIndex) {
        this.data.onext.style.display = "none";
      }
      this.renderNewsListByPage(
        this.data.pageIndex,
        this.data.pageSize,
        "",
        true
      );
    },
    /* 分页渲染虚拟数据列表
     * @method getMockListByPage
     * @param {Number} pageIndex 当前页
     * @param {Number} pageSize 当前页显示长度
     * @param {String} query 查询字段
     * @param {Boolean} isCache 是否需要缓存
     * @return void
     */
    renderNewsListByPage(pageIndex, pageSize, query, isCache) {
      isCache = isCache || false;
      this.data.onews.innerHTML = "";
      pageIndex = pageIndex || this.data.pageIndex;
      pageSize = pageSize || this.data.pageSize;
      var startRow = (pageIndex - 1) * pageSize;
      var endRow = pageIndex * pageSize;
      var newList = [];
      if (query) {
        // this.data.oprev.style.display = "none";
        this.data.onext.style.display = "none";
        var item = null;
        var len = this.data.queryList.length;
        for (var i = 0; i < len; i++) {
          if (this.data.queryList[i].value === query) {
            item = this.data.queryList[i];
          }
        }
        newList = [item];
      } else {
        this.data.onext.style.display = "block";
        var newList = [];
        if (
          isCache &&
          this.data.cacheList.length <= this.data.pageIndex * this.data.pageSize
        ) {
          var list = this.fetchList(startRow, endRow);
          for (var i = 0; i < list.length; i++) {
            this.data.cacheList.push(list[i]);
          }
          newList = list;
        } else {
          newList = this.data.cacheList.concat().slice(startRow, endRow);
          console.log("from cache list", newList);
        }
      }
      var length = newList.length;
      for (var i = 0; i < length; i++) {
        var section = document.createElement("section");
        section.innerHTML = `
          <section class="news-item">
              <div class="news-item-text">
                  <h4 class="news-item-text-title">${newList[i].key}</h4>
                  <p class="news-item-text-content">嗟夫！予尝求古仁人之心，或异二者之为，何哉？不以物喜，不以己悲；居庙堂之高则忧其民；处江湖之远则忧其君。是进亦忧，退亦忧。然则何时而乐耶？其必曰：“先天下之忧而忧，后天下之乐而乐”乎！噫！微斯人，吾谁与归？</p>
                  <p class="news-item-text-time">1个月前</p>
              </div>
              <img class="news-item-img" data-src="./assets/${Math.floor(
                Math.random() * 10 + 1
              )}.jpg" alt="" />
          </section>`;
        this.data.onews.appendChild(section);
      }
      lazyloadImages.init();
    },
    /* 模拟获取列表
     * @method fetchList
     * @param {Number} pageIndex 当前页
     * @param {Number} pageSize 当前页显示长度
     * @return {Array} 获取的数据
     */
    fetchList(pageIndex, pageSize) {
      console.log("from fetch list");
      return this.data.queryList.concat().slice(pageIndex, pageSize);
    },
  };

  // 判断当前环境是否支持模块导出
  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = renderList;
    }
    exports.renderList = renderList;
  } else {
    root.renderList = renderList;
  }
})();
