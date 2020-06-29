// auto-complate
var autoComplate = {
  data: {
    randomNum: 0,
    mockList: [],
    oautoComplate: null,
    oinput: null,
    odropdown: null,
    oul: null,
    ocomplateList: null,
    osearch: null,
    queryList: [],
    flag: true,
    itemHeight: 32,
    searchValue: "",
    tagsList: [],
    isSelect: false,
  },
  /* 初始化
   * @method init
   * @return void
   */
  init: function () {
    this.data.randomNum = Math.floor(Math.random() * (1000 - 100)) + 100;
    this.data.mockList = this.getMockList(this.data.randomNum);
    // 首次加载新闻列表数据
    renderList.data.queryList = this.data.mockList;
    // Dom of input
    this.data.oinput = document.querySelector(".auto-complate-search-input");
    // Dom of dropdown
    this.data.odropdown = document.querySelector(".auto-complate-dropdown");
    // Dom of dropdown list
    this.data.oul = document.querySelector(".auto-complate-dropdown-list");
    // Dom of auto complate list
    this.data.ocomplateList = document.querySelector(".auto-complate-list");
    // Dom of auto complate
    this.data.oautoComplate = document.querySelector(
      ".auto-complate-show-search"
    );
    // Dom of submit btn
    this.data.osearch = document.querySelector(".auto-complate-btn");
    this.bindEvent();
  },
  /* 绑定dom事件
   * @method bindEvent
   * @return void
   */
  bindEvent: function () {
    this.data.oautoComplate.onclick = this.handleComonentClick.bind(this);
    this.data.oinput.onfocus = this.handleInputFocus.bind(this);
    this.data.oinput.oninput = this.handleInput.bind(this);
    this.data.oul.onscroll = this.debonce(
      this.handleListScroll.bind(this),
      300
    );
    this.data.oul.onclick = this.handleDropdownItemClick.bind(this);
    this.data.osearch.onclick = this.handleSearch.bind(this);
    window.addEventListener("click", this.windowClick.bind(this));
  },
  /* 防抖
   * @method debonce
   * @param {Function} fn 需要进行防抖的方法
   * @return {wait} 延迟多少秒后执行
   */
  debonce: function debounce(fn, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  },
  /* 搜索
   * @method handleSearch
   * @return void
   */
  handleSearch() {
    if (!this.data.isSelect) return;
    // 渲染列表
    renderList.data.queryList = this.data.queryList.concat();
    renderList.handleSearch(this.data.searchValue);
  },
  handleComonentClick(e) {
    if (e.target.className === "auto-complate-btn") return;
    this.data.oinput.focus();
  },
  /* Input focus
   * @method handleInputFocus
   * @return void
   */
  handleInputFocus: function (e) {
    this.data.odropdown.style.height = "256px";
    this.data.queryList = this.getQueryList("");
    if (this.data.flag) {
      this.insertToDropdown(1, 16, true);
    }
    this.data.flag = false;
  },
  /* Input input
   * @method handleInput
   * @return void
   */
  handleInput: function (e) {
    this.data.searchValue = e.target.value;
    this.data.isSelect = this.data.searchValue ? false : true;
    this.data.queryList = this.getQueryList(this.data.searchValue);
    this.insertToDropdown(1, 16, true);
  },
  /* window click
   * @method windowClick
   * @return void
   */
  windowClick: function (e) {
    e.preventDefault();
    if(e.target.className === "auto-complate-btn") {
        this.data.odropdown.style.height = "0px";
    }
    if (
      e.target.className === "auto-complate-search-input" ||
      e.target.className === "auto-complate-dropdown-list-item" ||
      e.target.className ===
        "auto-complate-dropdown-list-item auto-complate-dropdown-list-item-selected" ||
      e.target.className === "auto-complate" ||
      e.target.className === "auto-complate-list" ||
      e.target.className === "auto-complate-item-remove" ||
      e.target.className === "auto-complate-item-content" ||
      e.target.className === "auto-complate-item" ||
      e.target.className === "auto-complate-btn"
    )
      return;
    if (this.data.isSelect) {
    } else {
      this.data.oinput.value = "";
    }
    this.data.flag = true;
    this.data.odropdown.style.height = "0px";
  },
  /* dropdown list scroll
   * @method handleListScroll
   * @return void
   */
  handleListScroll(e) {
    var itemHeight = this.data.itemHeight;
    var screenHeight = this.data.oul.clientHeight;
    // 视区数量
    var visibleCount = Math.ceil(screenHeight / itemHeight);
    // 滚动高度
    var scrollHeight = this.data.oul.scrollHeight;
    var scrollTop =
      this.data.oul.scrollTop || document.documentElement.scrollTop;
    if (scrollTop + itemHeight * visibleCount >= scrollHeight) {
      this.insertToDropdown(
        Math.ceil(scrollHeight / (itemHeight * visibleCount)) + 1,
        visibleCount
      );
    }
  },
  /* 查询列表点击
   * @method handleDropdownItemClick
   * @return void
   */
  handleDropdownItemClick(e) {
    this.data.isSelect = true;
    this.data.oinput.value = e.target.innerText;
    this.data.searchValue = e.target.innerText;
    // var oItem = e.target;
    // var key = oItem.getAttribute("data-key");
    // this.data.searchKey = key;
    // var item = null;
    // var len = this.data.queryList.length;
    // for (var i = 0; i < len; i++) {
    //   if (this.data.queryList[i].key === key) {
    //     item = this.data.queryList[i];
    //   }
    // }
    //   var key = oItem.getAttribute("data-key");
    //   if (oItem.classList.contains("auto-complate-dropdown-list-item-selected")) {
    //     oItem.className = "auto-complate-dropdown-list-item";
    //     this.renderTagsList(key, "remove");
    //   } else {
    //     oItem.className =
    //       "auto-complate-dropdown-list-item auto-complate-dropdown-list-item-selected";
    //     this.renderTagsList(key, "add");
    //   }
  },
  /* 渲染标签栏
   * @method renderTagsList
   * @param {String} key 当前点击的item key值
   * @param {String} add：新增节点 remove：删除节点
   * @return void
   */
  renderTagsList(key, method) {
    var item = null;
    var len = this.data.queryList.length;
    for (var i = 0; i < len; i++) {
      if (this.data.queryList[i].key === key) {
        item = this.data.queryList[i];
      }
    }
    if (method === "add") {
      this.data.tagsList.push(item);
      var ospan = document.createElement("span");
      ospan.setAttribute("class", "auto-complate-item");
      ospan.setAttribute("data-key", item.key);
      var childSpan1 = document.createElement("span");
      childSpan1.innerText = item.value;
      childSpan1.setAttribute("class", "auto-complate-item-content");
      ospan.append(childSpan1);
      var childSpan2 = document.createElement("span");
      childSpan2.setAttribute("class", "auto-complate-item-remove");
      childSpan2.innerText = "x";
      childSpan2.setAttribute("data-key", item.key);
      ospan.append(childSpan2);
      childSpan2.onclick = this.handleTagsRemove.bind(this);
      this.data.ocomplateList.appendChild(ospan);
    } else {
      var newList = [];
      for (var i = 0; i < this.data.tagsList.length; i++) {
        if (item.key === this.data.tagsList[i].key) {
        } else {
          newList.push(this.data.tagsList[i]);
        }
      }
      this.data.tagsList = newList;
      var childs = this.data.ocomplateList.children;
      for (var i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("data-key") === key) {
          this.data.ocomplateList.removeChild(childs[i]);
        }
      }
    }
    var height = this.data.oautoComplate.offsetHeight;
    this.data.odropdown.style.top = height + 5 + "px";
  },
//   handleTagsRemove(e) {
//     var parentNode = e.target.parentNode;
//     var key = parentNode.getAttribute("data-key");
//     var newList = [];
//     for (var i = 0; i < this.data.tagsList.length; i++) {
//       if (key === this.data.tagsList[i].key) {
//       } else {
//         newList.push(this.data.tagsList[i]);
//       }
//     }
//     this.data.tagsList = newList;
//     this.data.ocomplateList.removeChild(parentNode);
//     var height = this.data.oautoComplate.offsetHeight;
//     this.data.odropdown.style.top = height + 5 + "px";
//     this.insertToDropdown(1, 16, true);
//   },
  /* 将查询条件插入列表
   * @method insertToDropdown
   * @param {Number} curentIdex 当前index
   * @return {Number} size 加载数量
   */
  insertToDropdown(curentIdex, size, isRerender) {
    isRerender = isRerender || false;
    if (isRerender) {
      this.data.oul.scrollTop = 0;
      var childs = this.data.oul.childNodes;
      for (var i = childs.length - 1; i >= 0; i--) {
        this.data.oul.removeChild(childs.item(i));
      }
    }
    if (curentIdex < 3) {
      var insertList = this.getQueryListByPage(curentIdex, size);
      var length = insertList.length;
      for (var i = 0; i < length; i++) {
        var li = document.createElement("li");
        li.innerText = insertList[i].value;
        if (this.getKeyInTags(insertList[i].key)) {
          li.setAttribute(
            "class",
            "auto-complate-dropdown-list-item auto-complate-dropdown-list-item-selected"
          );
        } else {
          li.setAttribute("class", "auto-complate-dropdown-list-item");
        }
        li.setAttribute("data-key", insertList[i].key);
        this.data.oul.appendChild(li);
      }
      return;
    }
    var insertList = this.getQueryListByPage(curentIdex, size);
    var length = insertList.length;
    for (var i = 0; i < length; i++) {
      var li = document.createElement("li");
      li.innerText = insertList[i].value;
      if (this.getKeyInTags(insertList[i].key)) {
        li.setAttribute(
          "class",
          "auto-complate-dropdown-list-item auto-complate-dropdown-list-item-selected"
        );
      } else {
        li.setAttribute("class", "auto-complate-dropdown-list-item");
      }
      li.setAttribute("data-key", insertList[i].key);
      this.data.oul.appendChild(li);
    }
  },
  /* 判断当前key是否存在于tagsList
   * @method getKeyInTags
   * @param {String} key 当前item key值
   * @return {Boolean} 是否存在
   */
  getKeyInTags(key) {
    let flag = false;
    for (var i = 0; i < this.data.tagsList.length; i++) {
      if (this.data.tagsList[i].key === key) {
        flag = true;
      }
    }
    return flag;
  },
  /* 获取条件查询后的列表
   * @method getQueryListByPage
   * @param {String} query 查询字段
   * @return {Array} 查询后的数据
   */
  getQueryList: function (query) {
    query = query + "" || "";
    if (query === "") return this.data.mockList;
    var list = [];
    var newList = this.data.mockList.concat();
    var len = newList.length;
    for (var i = 0; i < len; i++) {
      if (newList[i].value.indexOf(query) !== -1) {
        list.push(newList[i]);
      }
    }
    return list;
  },
  /* 分页获取条件查询后的列表
   * @method getQueryListByPage
   * @param {String} query 查询字段
   * @param {Number} pageIndex 当前页
   * @param {Number} pageSize 当前页显示长度
   * @return {Array} 查询后的数据
   */
  getQueryListByPage: function (pageIndex, pageSize) {
    var list = this.data.queryList.concat();
    var startRow = (pageIndex - 1) * pageSize;
    var endRow = pageIndex * pageSize;
    return list.slice(startRow, endRow);
  },
  /* 获取虚拟数据列表
   * @method getMockList
   * @param {Number} length 虚拟数据列表长度
   * @return {Array} 虚拟数据列表
   */
  getMockList: function (length) {
    var list = [];
    for (var i = 1; i <= length; i++) {
      list.push({
        key: i.toString(36) + i,
        value: i.toString(36) + i,
      });
    }
    return list;
  },
  /* 分页获取虚拟数据列表
   * @method getMockListByPage
   * @param {Number} pageIndex 当前页
   * @param {Number} pageSize 当前页显示长度
   * @return {Array} 分页后的数据
   */
  getMockListByPage: function (pageIndex, pageSize) {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 10;
    var startRow = (pageIndex - 1) * pageSize;
    var endRow = pageIndex * pageSize;
    var newList = this.data.mockList.concat();
    return newList.slice(startRow, endRow);
  },
};

// Image lazyload
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
      if (H + S > this.getTop(imgs[i])) {
        imgs[i].src = imgs[i].getAttribute("data-src");
      }
    }
  },
};

// render news list
var renderList = {
  data: {
    queryList: [],
    onews: null,
    oprev: null,
    onext: null,
    pageIndex: 1,
    pageSize: 10,
  },
  /* 初始化
   * @method init
   * @return void
   */
  init: function () {
    this.data.onews = document.querySelector(".main");
    this.data.oprev = document.querySelector(".footer .pagination-prev");
    this.data.onext = document.querySelector(".footer .pagination-next");
    this.renderNewsListByPage();
    this.bindEvent();
  },
  /* 绑定dom事件
   * @method bindEvent
   * @return void
   */
  bindEvent: function () {
    this.data.oprev.onclick = this.handlePrevClick.bind(this);
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
  handlePrevClick() {
    this.data.pageIndex--;
    if (this.data.pageIndex <= 1) {
      this.data.oprev.style.display = "none";
    }
    this.renderNewsListByPage(this.data.pageIndex, this.data.pageSize);
  },
  /* 上一页
   * @method handleNextClick
   * @return void
   */
  handleNextClick() {
    this.data.pageIndex++;
    if (this.data.pageIndex > 1) {
      this.data.oprev.style.display = "block";
    }
    var length = this.data.queryList.length;
    if(Math.floor(length / this.data.pageSize) <= this.data.pageIndex) {
        this.data.onext.style.display = "none";
    }
    this.renderNewsListByPage(this.data.pageIndex, this.data.pageSize);
  },
  /* 分页渲染虚拟数据列表
   * @method getMockListByPage
   * @param {Number} pageIndex 当前页
   * @param {Number} pageSize 当前页显示长度
   * @param {String} query 查询字段
   * @return {Array} 分页后的数据
   */
  renderNewsListByPage(pageIndex, pageSize, query) {
    this.data.onews.innerHTML = "";
    pageIndex = pageIndex || this.data.pageIndex;
    pageSize = pageSize || this.data.pageSize;
    var startRow = (pageIndex - 1) * pageSize;
    var endRow = pageIndex * pageSize;
    var newList = [];
    if (query) {
      this.data.oprev.style.display = "none";
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
      var newList = this.data.queryList.concat();
      newList = newList.slice(startRow, endRow);
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
};

window.onload = function () {
  autoComplate.init();
  renderList.init();
  //   lazyloadImages.init();
  window.onscroll = function () {
    lazyloadImages.init();
  };
};
