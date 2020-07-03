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

  // auto-complate
  function AutoComplate(opts) {
    this.opts = util.extend({}, this.constructor.defaultOpts, opts);
    this.init(opts.node, opts.data);
  }

  AutoComplate.defaultOpts = {
    node: '',
    data: []
  }

  var proto = AutoComplate.prototype;

  // 变量存储
  proto.onode = null;
  proto.mockList = [];
  proto.oautoComplate = null;
  proto.oinput = null;
  proto.odropdown = null;
  proto.oul = null;
  proto.ocomplateList = null;
  proto.queryList = [];
  proto.flag = true;
  proto.itemHeight = 32;
  proto.searchValue = "";
  proto.tagsList = [];

  /* 初始化
   * @method init
   * @return void
   */
  proto.init = function (elem, data) {
    this.mockList = this.mockList.concat();
    this.queryList = this.queryList.concat();
    this.tagsList = this.tagsList.concat();
    this.onode = elem;
    var oelem = document.querySelector(elem);
    this.mockList = data || [];
    oelem.innerHTML = `
    <div class="auto-complate-show-search" style="width:100%">
      <div class="auto-complate">
        <div class="auto-complate-list"></div>
        <span class="auto-complate-search" style="width:40px;">
            <input class="auto-complate-search-input" autocomplete="off" type="text">
            <span class="auto-complate-search-mirror" aria-hidden="true">&nbsp;</span>
        </span>
        <div class="auto-complate-dropdown" style="height: 0;">
            <ul class="auto-complate-dropdown-list" style="width: 100%;">
            </ul>
        </div>
      </div>
    </div>`;
    // Dom of input
    this.oinput = document.querySelector(`${elem} .auto-complate-search-input`);
    // Dom of dropdown
    this.odropdown = document.querySelector(`${elem} .auto-complate-dropdown`);
    // Dom of dropdown list
    this.oul = document.querySelector(`${elem} .auto-complate-dropdown-list`);
    // Dom of auto complate list
    this.ocomplateList = document.querySelector(`${elem} .auto-complate-list`);
    // Dom of auto complate
    this.oautoComplate = document.querySelector(
      `${elem} .auto-complate-show-search`
    );
    console.log(this);
    this.bindEvent();
  };

  /* 绑定dom事件
   * @method bindEvent
   * @return void
   */
  proto.bindEvent = function () {
    this.oautoComplate.onclick = this.handleComonentClick.bind(this);
    this.oinput.onfocus = this.handleInputFocus.bind(this);
    this.oinput.oninput = this.handleInput.bind(this);
    this.oul.onscroll = this.debonce(this.handleListScroll.bind(this), 300);
    this.oul.onclick = this.handleDropdownItemClick.bind(this);
    window.addEventListener("click", this.windowClick.bind(this));
  };

  /* 防抖
   * @method debonce
   * @param {Function} fn 需要进行防抖的方法
   * @return {wait} 延迟多少秒后执行
   */
  proto.debonce = function debounce(fn, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  };
  proto.handleComonentClick = function (e) {
    this.oinput.focus();
  };
  /* Input focus
   * @method handleInputFocus
   * @return void
   */
  proto.handleInputFocus = function (e) {
    this.odropdown.style.height = "256px";
    this.queryList = this.getQueryList("");
    if (this.flag) {
      this.insertToDropdown(1, 16, true);
    }
    this.flag = false;
  };
  /* Input input
   * @method handleInput
   * @return void
   */
  proto.handleInput = function (e) {
    this.searchValue = e.target.value;
    this.queryList = this.getQueryList(this.searchValue);
    this.insertToDropdown(1, 16, true);
  };
  /* window click
   * @method windowClick
   * @return void
   */
  proto.windowClick = function (e) {
    e.preventDefault();
    if (
      e.target.className === "auto-complate-search-input" ||
      e.target.className === "auto-complate-dropdown-list-item" ||
      e.target.className ===
        "auto-complate-dropdown-list-item auto-complate-dropdown-list-item-selected" ||
      e.target.className === "auto-complate" ||
      e.target.className === "auto-complate-list" ||
      e.target.className === "auto-complate-item-remove" ||
      e.target.className === "auto-complate-item-content" ||
      e.target.className === "auto-complate-item"
    )
      return;
    this.oinput.value = "";
    this.flag = true;
    this.odropdown.style.height = "0px";
  };
  /* dropdown list scroll
   * @method handleListScroll
   * @return void
   */
  proto.handleListScroll = function (e) {
    var itemHeight = this.itemHeight;
    var screenHeight = this.oul.clientHeight;
    // 视区数量
    var visibleCount = Math.ceil(screenHeight / itemHeight);
    // 滚动高度
    var scrollHeight = this.oul.scrollHeight;
    var scrollTop = this.oul.scrollTop || document.documentElement.scrollTop;
    if (scrollTop + itemHeight * visibleCount >= scrollHeight) {
      this.insertToDropdown(
        Math.ceil(scrollHeight / (itemHeight * visibleCount)) + 1,
        visibleCount
      );
    }
  };
  /* 查询列表点击
   * @method handleDropdownItemClick
   * @return void
   */
  proto.handleDropdownItemClick = function (e) {
    this.oinput.value = "";
    var oItem = e.target;
    var key = oItem.getAttribute("data-key");
    if (oItem.classList.contains("auto-complate-dropdown-list-item-selected")) {
      oItem.className = "auto-complate-dropdown-list-item";
      this.renderTagsList(key, "remove");
    } else {
      oItem.className =
        "auto-complate-dropdown-list-item auto-complate-dropdown-list-item-selected";
      this.renderTagsList(key, "add");
    }
  };
  /* 渲染标签栏
   * @method renderTagsList
   * @param {String} key 当前点击的item key值
   * @param {String} add：新增节点 remove：删除节点
   * @return void
   */
  proto.renderTagsList = function (key, method) {
    var item = null;
    var len = this.queryList.length;
    for (var i = 0; i < len; i++) {
      if (this.queryList[i].key === key) {
        item = this.queryList[i];
      }
    }
    if (method === "add") {
      this.tagsList.push(item);
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
      this.ocomplateList.appendChild(ospan);
    } else {
      var newList = [];
      for (var i = 0; i < this.tagsList.length; i++) {
        if (item.key === this.tagsList[i].key) {
        } else {
          newList.push(this.tagsList[i]);
        }
      }
      this.tagsList = newList;
      var childs = this.ocomplateList.children;
      for (var i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("data-key") === key) {
          this.ocomplateList.removeChild(childs[i]);
        }
      }
    }
    var height = this.oautoComplate.offsetHeight;
    this.odropdown.style.top = height + 5 + "px";
  };
  proto.handleTagsRemove = function (e) {
    var parentNode = e.target.parentNode;
    var key = parentNode.getAttribute("data-key");
    var newList = [];
    for (var i = 0; i < this.tagsList.length; i++) {
      if (key === this.tagsList[i].key) {
      } else {
        newList.push(this.tagsList[i]);
      }
    }
    this.tagsList = newList;
    this.ocomplateList.removeChild(parentNode);
    var height = this.oautoComplate.offsetHeight;
    this.odropdown.style.top = height + 5 + "px";
    this.insertToDropdown(1, 16, true);
  };
  /* 将查询条件插入列表
   * @method insertToDropdown
   * @param {Number} curentIdex 当前index
   * @return {Number} size 加载数量
   */
  proto.insertToDropdown = function (curentIdex, size, isRerender) {
    isRerender = isRerender || false;
    if (isRerender) {
      this.oul.scrollTop = 0;
      var childs = this.oul.childNodes;
      for (var i = childs.length - 1; i >= 0; i--) {
        this.oul.removeChild(childs.item(i));
      }
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
      this.oul.appendChild(li);
    }
  };
  /* 判断当前key是否存在于tagsList
   * @method getKeyInTags
   * @param {String} key 当前item key值
   * @return {Boolean} 是否存在
   */
  proto.getKeyInTags = function (key) {
    let flag = false;
    for (var i = 0; i < this.tagsList.length; i++) {
      if (this.tagsList[i].key === key) {
        flag = true;
      }
    }
    return flag;
  };
  /* 获取条件查询后的列表
   * @method getQueryListByPage
   * @param {String} query 查询字段
   * @return {Array} 查询后的数据
   */
  proto.getQueryList = function (query) {
    query = query + "" || "";
    if (query === "") return this.mockList;
    var list = [];
    var newList = this.mockList.concat();
    var len = newList.length;
    for (var i = 0; i < len; i++) {
      if (newList[i].value.indexOf(query) !== -1) {
        list.push(newList[i]);
      }
    }
    return list;
  };
  /* 分页获取条件查询后的列表
   * @method getQueryListByPage
   * @param {String} query 查询字段
   * @param {Number} pageIndex 当前页
   * @param {Number} pageSize 当前页显示长度
   * @return {Array} 查询后的数据
   */
  proto.getQueryListByPage = function (pageIndex, pageSize) {
    var list = this.queryList.concat();
    var startRow = (pageIndex - 1) * pageSize;
    var endRow = pageIndex * pageSize;
    return list.slice(startRow, endRow);
  };
  /* 分页获取虚拟数据列表
   * @method getMockListByPage
   * @param {Number} pageIndex 当前页
   * @param {Number} pageSize 当前页显示长度
   * @return {Array} 分页后的数据
   */
  proto.getMockListByPage = function (pageIndex, pageSize) {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 10;
    var startRow = (pageIndex - 1) * pageSize;
    var endRow = pageIndex * pageSize;
    var newList = this.mockList.concat();
    return newList.slice(startRow, endRow);
  };

  // 判断当前环境是否支持模块导出
  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = AutoComplate;
    }
    exports.AutoComplate = AutoComplate;
  } else {
    root.AutoComplate = AutoComplate;
  }
})();

var randomNum = Math.floor(Math.random() * (1000 - 100)) + 100;

var getMockList = function (length) {
  var list = [];
  for (var i = 1; i <= length; i++) {
    list.push({
      key: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }
  return list;
};

window.onload = function () {
  var component2 = new AutoComplate({
    node: ".demo1",
    data: [{key:'111', value: '1111'}, {key: '22', value:'2222'}],
  });
  var mockList = getMockList(randomNum)
  console.log(mockList)
  var component1 = new AutoComplate({
    node: ".demo",
    data: mockList
  });
};
