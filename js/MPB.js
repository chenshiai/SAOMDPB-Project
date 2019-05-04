/**
 * SAOMDPB项目用对象字面量API
 * 作者：丨ConGreat
 * 起始时间：2019-04-23
 * 最后修改时间：2019-04-26
 */
const MPB = {
  /**
   * 如果多次调用重复的东西，对性能还是会有点影响的！
   * 所以，当第一次调用的时候创建一个实例存在这里。
   * 之后再次调用就直接用实例啦！
   */
  "Object": {
    xhr: null,
    ajax: null,
    scrollTop: 0
  },
  /**
   * 只需一次调用就可获得兼容的XMLHttpRequest对象~
   */
  "XMLHttpRequest": function (bool) {
    if (MPB.Object.xhr === null) {
      var xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      MPB.Object.xhr = xhr;
    }
    return MPB.Object.xhr;
  },
  /**
   * 创建一个计时器队列对象。可以用来做防抖...嗯就是这样。
   * @function open(bool) 调用一次该计时器，参数bool默认false，所有计时器同步执行，
   * true则进行一次异步调用。
   * @function close() 直接关闭该对象上的所有计时器。
   * @param {function} abort_u 倒计时结束时调用的函数。
   * @param {number} time_u 倒计时时长,默认为0(毫秒)。
   */
  "Timer": function (abort_u, time_u) {
    var _abort = abort_u,
      _time = time_u,
      _async = false,
      _timer = null,
      _asyncArr = [];
    function out() {
      if (_asyncArr.length > 0) {
        _timer = setTimeout(() => {
          _asyncArr.shift()();
          out();
        }, _time);
      }
    }
    this.getData = function () {
      return {
        abort: _abort,
        time: _time,
        async: _async,
        timer: _timer,
        asyncArr: _asyncArr
      }
    }
    if (typeof _abort != "function") {
      throw new Error("计时器对象Timer(function, number)中的function参数类型错误！");
    }
    if (typeof _time != "number") {
      throw new Error("计时器对象Timer(function, number)中的number参数类型错误！");
    }

    /**
     * 向该计时器队列中新增一次调用
     */
    this.open = function (bool) {
      var openAsync = bool || _async;
      if (openAsync) {
        _timer = setTimeout(_abort, _time);
        return true;
      } else {
        _asyncArr.push(_abort);
      }
      if (_asyncArr.length == 1) {
        out();
      }
      return openAsync;
    }
    /**
     * 清空该计时器队列，同时将上一次异步调用取消
     */
    this.close = function () {
      clearTimeout(_timer);
      _asyncArr = [];
      return true;
    }
  },
  /**
   * 发送XMLHttpRequest请求，不对外开放。
   */
  "sendRequest": function (req) {
    var xhr = MPB.XMLHttpRequest();
    var ajax = MPB.Object.ajax || req;
    xhr.open(ajax.method, ajax.url, ajax.async);
    xhr.setRequestHeader("Content-type", ajax.contentType);
    ajax.beforeSend();
    xhr.send(ajax.data);

    var timer = setTimeout(function () {
      xhr.abort();
      alert('网络连接超时~')
    }, ajax.timeout)//设置计时器

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        clearTimeout(timer);// 规定时间内完成响应，关闭计时器
        var responseText = xhr.responseText;//返回结果

        var res = JSON.parse(responseText);//回调函数
        /**
         * 返回结果模板
         * res:{
         *  status:number,
         *  datas:{
         *    data:[],
         *    sp:[],
         *    swordskill:[],
         *    battleskill:[],
         *    slotskill:[],
         *  }
         * }
         */
        if (res.status > 0) {
          ajax.success(res.datas);
        } else {
          ajax.error();
        }
      }
    }
    ajax.complete();
  },
  /**
   * ajax请求方法，服务器返回的要是json！
   * @param {string} method 请求方式，默认GET （可选）。
   * @param {string} url 请求的地址 （必须）。
   * @param {string} data 发送的数据，默认null。
   * @param {boolean} async 是否异步，默认true。
   * @param {function} beforeSend 发送请求前调用函数 （可选）。
   * @param {function} success 成功回调函数 （必须）。
   * @param {function} error 失败回调函数（可选）。
   * @param {string} contentType 发送数据到服务器时所使用的内容类型 （可选）。
   * @param {number} timeout 设置本地的请求超时时间，默认60秒（可选）。
   * @param {function} complete 请求完毕回调函数（可选）。
   */
  "ajax": function (req) {
    var ajax = null;
    if (typeof req == "object") {
      ajax = {
        method: req.method || "get",
        url: req.url || (() => { throw new Error('地址都不给人家！') })(),
        data: req.data || null,
        contentType: req.contentType || "application/x-www-form-urlencoded",
        dataType: req.dataType || "",// 尚未实现.....
        async: req.async || true,
        cache: req.cache || true,
        timeout: req.timeout || 60000,
        beforeSend: req.beforeSend || function () { },
        success: req.success || (() => { throw new Error('给我一个成功回调函数嘛！') })(),
        error: req.error || function () { console.log("服务器返回错误！") },
        complete: req.complete || function () { }
      }
    }
    if (ajax != null) {
      MPB.Object.ajax = ajax;
    } else {
      throw new Error('你传进来的是个啥!?');
    }
    return MPB.sendRequest();
  },
  /**
   * 标签懒加载,将需要添加入html的标签分批加载。
   * @param {array} data json对象数组。
   * @param {number} num 你希望每批加载多少。
   */
  "Taglazyload": function (data, callback) {
    var _data = [...data],
      _callback = callback;
    /**
     * Taglazyload对象上的方法。
     * @param {number} num 设置每批加载多少。
     */
    this.lazyload = function (num) {
      if (_data.length < num && _data.length > 0) {
        num = _data.length;
      }
      for (var i = num; i-- && _data.length > 0;) {
        _callback(_data.shift());
      }
      return _data.length === 0;
    }
    /**
     * 查看当前-标签懒加载-对象的data。
     */
    this.getData = function () {
      return data;
    }
    /**
     * 直接调用一次回调函数。
     */
    this.callback = function () {
      _callback();
    }
  },
  /**
   * 加载外部文件
   * @param {array} urls 地址数组（必须）。
   * @param {string} type 添加的标签名字，默认'script'。
   * @param {string} tagname 需要加载哪个标签中，可选id和class，默认'head'。
   * @param {function} callback 回调函数（可选）。
   * @param {boolean} async 是否异步加载，默认true。
   */
  "load": function (datas) {
    var data = {
      urls: datas.urls || (() => { throw new Error('必须传入一个地址数组才行哦！') }),
      type: datas.type || "script",
      tagname: datas.tagname || "head",
      callback: datas.callback || function () { },
      async: datas.async || true
    };
    /**
     * 根据type来设置其专有属性
     */
    function createNode(data) {
      var tag = document.createElement(data.type);
      var allTag = {
        "script": () => { tag.setAttribute("type", "text/javascript") },
        "img": () => { tag.setAttribute("alt", "image") },
        "或许还有更多功能？": ""
      }
      allTag[data.type]();
      return tag;
    }
    var HEAD = document.querySelector(data.tagname) || document.documentElement;
    var s = [], len = data.urls.length;

    //加载
    if (data.async) {
      var loaded = 0;
      for (var i = 0; i < len; i++) {
        s[i] = createNode(data);
        s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
          if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
            loaded++;
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
            if (loaded == len) data.callback();
          }
        }
        s[i].setAttribute("src", data.urls[i]);
        HEAD.appendChild(s[i]);
      }
    } else {
      var recursiveLoad = function (i) {
        s[i] = createNode(data);
        s[i].setAttribute("src", data.urls[i]);
        s[i].onload = s[i].onreadystatechange = function () { //兼容浏览器
          if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);//下载完后，从html文档中移除
            if (i != (len - 1)) {
              recursiveLoad(i + 1);//递归
            } else {
              data.callback();
            }
          }
        }
        HEAD.appendChild(s[i]);
      };
      recursiveLoad(0);
    }
  },
  /**
   * 窗口滚动触发器(防抖版)
   * @param {number} scrollTop 滚动触发条件。
   * @function setAfter(function) 设置触发后调用。
   * @function setBefore(function) 设置触发前调用。
   */
  "ScrollTrigger": function (scrollTop) {
    var _scrollTop = scrollTop,
      _after = null,
      _before = null;

    /**
     * 设置触发后调用的方法
     */
    this.setAfter = function (a) {
      _after = new MPB.Timer(a, 100);//使用Timer对象来对scroll事件进行防抖处理
    }
    /**
     * 设置触发前调用的方法
     */
    this.setBefore = function (b) {
      _before = new MPB.Timer(b, 100);;
    }
    this.getData = function () {
      return {
        after: _after,
        before: _before
      }
    }
    function _trigger() {
      if (Scroll.getScrollTop() >= _scrollTop && _after && _before) {
        _after.close();
        _after.open();
      } else {
        _before.close();
        _before.open();
      }
    }
    Scroll.windowScroll(_trigger)
  },
  /**
   * 来自张鑫旭老师的缓动小算法
   * 从起始值接近目标值的算法。每当浏览器重绘页面时调用callback
   * @param {number} A 起始值
   * @param {number} B 目标值
   * @param {number} rate 缓动速率，越小越快
   * @param {function} callback 是变化的位置回调，支持两个参数，value和isEnding，表示当前的位置值（数值）以及是否动画结束了（布尔值）；
   */
  "easeout": function (A, B, rate, callback) {
    if (A == B || typeof A != 'number') {
      return;
    }
    B = B || 0;
    rate = rate || 2;
    var step = function () {
      callback(A, false);
      A = A + (B - A) / rate;
      if (A < 1) {
        callback(B, true);
        return;
      }
      requestAnimationFrame(step);
    };
    step();
  },
  //加一个循环生成标签功能
  //加一个上下出现的菜单组件
  "setCookie": function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  },
  "getCookie": function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }
}
const Scroll = {
  "ToTop": function () {
    var currentScroll = Scroll.getScrollTop();
    if (currentScroll > 0) {
      window.requestAnimationFrame(Scroll.ToTop);
      window.scrollTo(0, currentScroll - (currentScroll / 10));
    }
  },
  /**
   * 取窗口可视范围的高度
   */
  "getClientHeight": function () {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    } else {
      clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
  },
  /**
   * 取窗口可视范围的宽度
   */
  "getClientWidth": function () {
    var clienWidth = 0;
    if (document.body.clientWidth && document.documentElement.clientWidth) {
      clienWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    } else {
      clienWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    }
    return clienWidth;
  },
  /**
   * 取窗口滚动条高度
   */
  "getScrollTop": function () {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  },
  "getScrollHeight": function () {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  "getWindowHeight": function () {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  /**
   * 绑定窗口滚动事件
   * @param {function} trigger 需要绑定的事件
   */
  "windowScroll": function (trigger) {
    window.addEventListener('scroll', trigger);
  }
}