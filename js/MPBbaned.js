/**
 * 下面这个字面量存放着一些被我废弃的方法。
 * 舍不得删除，这些都是我思考过的记录。
 */
var MPBbaned = {
  /**
   * 对应MPB中的Timer
   * 采用了一种更明了的对象构建
   */
  "timeOut": function (abort, time) {
    if (typeof abort != "function") {
      console.log("使用计时器对象至少需要一个方法！");
      return undefined;
    }
    var init = {
      abort: abort,
      time: time || 0
    }
    var Timer = function () {
      this.abort = init.abort;
      this.time = init.time;
      this.async = false;
      this.timer = null;
      this.asyncArr = [];
    }
    // 新增一个计时器
    Timer.prototype.open = function (bool) {
      var async = bool || this.async;
      if (async) {
        // async 为true 则直接使用计时器，异步调用
        this.timer = setTimeout(this.abort, this.time);
      } else {
        // async 为false 则将新增的计时器添加到队列中，用来同步执行
        this.asyncArr.push(this.abort);
      }
      // 如果队列里出现了第一个计时器，则开始递归执行out
      if (this.asyncArr.length == 1) {
        this.out();
      }
    }
    Timer.prototype.out = function () {
      //只要队列还有计时器，就继续调用。
      if (this.asyncArr.length > 0) {
        this.timer = setTimeout(() => {
          this.asyncArr.shift()();//先移出队列再调用
          this.out();//递归
        }, this.time);
      }
    }
    Timer.prototype.close = function () {
      clearTimeout(this.timer);
      this.asyncArr = [];
    }
    return new Timer;
  },
  /**
   * 废弃这个ajax请求的原因：我想把输入的req的对象字面量与发送请求解耦
   * 将ajax拆分成了ajax和sendRequset两部分 
   */
  "ajax": function (req) {
    var ajax = {
      method: req.method || "get",
      url: req.url || (() => { throw new Error('地址都不给人家！') })(),
      data: req.data || null,
      contentType: req.contentType || "application/x-www-form-urlencoded",
      dataType: req.dataType || "",
      async: req.async || true,
      cache: req.cache || true,
      timeout: req.timeout || null,
      beforeSend: req.beforeSend || function () { },
      success: req.success || (() => { throw new Error('给我一个成功回调函数嘛！') })(),
      error: req.error || function () { console.log("服务器返回错误！") }
    }
    var xhr = MPB.XMLHttpRequest();
    xhr.open(ajax.method, ajax.url, ajax.async);
    xhr.setRequestHeader("Content-type", ajax.contentType);
    ajax.beforeSend();
    xhr.send(ajax.data);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var responseText = xhr.responseText;//返回结果
          var obj = JSON.parse(responseText);
          if (obj[0].id > 0) {
            ajax.success(obj);
          } else {
            ajax.error();
          }
        } else if (error) {
          ajax.error();
        }
      }
    }
  }
}

var SaomdIndex = {
  /**
   * 滚动条到一定距离，元素调用方法
   * @param {string} node  需要绑定的目标节点的class或id
   * @param {number} scrollTop  滚动多少距离触发
   * @param {function} callback  回调函数
   */
  "scroll": function (node, callback = null, scrollTop) {
    var scrollEvent = SaomdIndex.debounce(callback, 200);
    if (typeof node == 'string') {
      if (typeof scrollTop == 'number') {
        window.addEventListener('scroll', function () {
          var theNode = document.querySelector(node);
          if (Scroll.getScrollTop() >= scrollTop && callback) {
            scrollEvent(theNode, true)
          } else {
            scrollEvent(theNode, false);
          }
        });
        return;
      }
    }
    throw new Error("Index 的方法 scrollFixed(node, scrollTop, where) 参数类型错误！");
  },
  "debounce": function (callback, delay) {
    return function (node, bool) {
      clearTimeout(callback.id);
      callback.id = setTimeout(() => {
        callback(node, bool);
      }, delay);
    }
  },
  /**
   * ajax请求方法
   * @param {string} Method get还是post还是其他 
   * @param {string} url 请求的地址 
   * @param {string} data 发送的数据
   * @param {boolean} Aysnc 是否同步
   * @param {function} callback 成功回调函数
   * @param {function} errorback 失败回调函数
   */
  "ajaxRequest": function (Method, url, data, Aysnc, callback = null, errorback = null) {
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!callback) {
      console.log('不要回调函数是不行的哦!');
      return;
    }
    xhr.open(Method, url, Aysnc);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var responseText = xhr.responseText;//返回结果
          var obj = JSON.parse(responseText);
          if (obj[0].id > 0) {
            callback(obj);
          } else {
            errorback();
          }
        } else if (errorback) {
          errorback();
        }
      }
    }
  },
  /**
   * 标签懒加载,将需要添加入html的标签分批加载
   * @param {array} data json对象数组
   * @param {number} num 你希望每批加载多少
   * @param {function} callback 数据加载方法
   */
  "tagLazyload": class {
    constructor(data) {
      this.data = data;
    }
    lazyload(num, callback) {
      if (this.data.length < num && this.data.length > 0) {
        num = this.data.length;
      }
      for (var i = num; i-- && this.data.length > 0;) {
        callback(this.data.shift());
      }
      return this.data.length === 0;
    }
  },
  /** 
   * 串联加载指定的脚本
   * 串联加载[异步]逐个加载，每个加载完成后加载下一个
   * 全部加载完成后执行回调
   * @param {array} scripts string 指定的脚本们
   * @param {function} callback 成功后回调的函数
   */
  "seriesLoadScripts": function (scripts, callback) {
    if (typeof scripts != 'object') var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
    var s = new Array(), last = scripts.length - 1;
    var recursiveLoad = function (i) { //递归
      s[i] = document.createElement("script");
      s[i].setAttribute("type", "text/javascript");
      s[i].setAttribute("src", scripts[i]);
      s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
        if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
          this.onload = this.onreadystatechange = null;
          this.parentNode.removeChild(this);
          if (i != last) {
            recursiveLoad(i + 1);
          } else if (typeof (callback) == "function") {
            callback();
          }
        }
      }
      HEAD.appendChild(s[i]);
    };
    recursiveLoad(0);
  },
  /**
   * 并联加载指定的脚本
   * 并联加载[同步]同时加载，不管上个是否加载完成，直接加载全部
   * 全部加载完成后执行回调
   * @param {array} scripts string 指定的脚本们
   * @param {function} callback 成功后回调的函数
   */
  "parallelLoadScripts": function (scripts, callback) {
    if (typeof scripts != 'object') var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement, s = new Array(), loaded = 0;
    for (var i = 0; i < scripts.length; i++) {
      s[i] = document.createElement("script");
      s[i].setAttribute("type", "text/javascript");
      s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
        if (!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
          loaded++;
          this.onload = this.onreadystatechange = null;
          this.parentNode.removeChild(this);
          if (loaded == scripts.length && typeof (callback) == "function") callback();
        }
      };
      s[i].setAttribute("src", scripts[i]);
      HEAD.appendChild(s[i]);
    }
  }
}