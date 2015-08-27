'use strict';
var json__els = require('./../data/els.json');
var json__strings = require('./../data/strings.json');

var empty_els = json__els.empty;
function is_empty(el) {
  return empty_els.indexOf(el) != -1;
}
function rand(total) {
  return Math.floor((Math.random() * total));
}

module.exports = function (el) {
  var markup_txt = json__strings.words[rand(100)];
  var markup_array = ['<',el,'>',markup_txt,'</',el,'>'];
  if (is_empty(el)) {
    markup_array = markup_array.slice(0,3);
  }
  if (el === "script") {
    markup_array[3] = "";
  }
  return markup_array.join('');
};
