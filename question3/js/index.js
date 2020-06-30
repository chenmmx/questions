var unique = require('uniq');
var autoComplate = require('./autoComplate');
var lazyloadImages = require('./lazyLoad');
var renderList = require('./renderList');

window.onload = function () {
  autoComplate.init();
  renderList.init();
  window.onscroll = function () {
    lazyloadImages.init();
  };
};
