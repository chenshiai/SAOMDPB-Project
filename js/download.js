function downloadPageInit() {
  var popup = new MPBpopup('.saopopup-container', {
    title: 'Message',
    text: '哎呀，什么也没找到呢<p>检查一下检索条件吧(^_^)</p>',
    okFunc: () => { popup.hiddenPopup() },
    oneKey: true
  })
  // 大图展示区
  var roleImg = new Vue({
    el: '#role-img',
    data() {
      return {
        OSSURL: 'http://saoimages.oss-cn-shenzhen.aliyuncs.com/roles/allrole/allrole/character',
        isShow: false,
        bgYes: false,
        roleinfo: {
          cutin: '',
          rare: '',
          up: ''
        },
        roleImgList: [
          {
            url: '',
            status: ''
          }
        ],
        select: 0
      }
    },
    computed: {

    },
    watch: {
      roleinfo: function () {
        this.roleImgList = [];
        this.setRoleImgList();
      },
      select: function (newNum, oldNum) {
        this.$set(this.roleImgList, oldNum, { url: this.roleImgList[oldNum].url, status: false });
        this.$set(this.roleImgList, newNum, { url: this.roleImgList[newNum].url, status: true });
      }
    },
    methods: {
      close: function () {
        this.isShow = false;
      },
      // 图片加载失败 移除该元素
      loadError: function (index) {
        this.roleImgList.splice(index, 1);
        this.list.splice(index, 1);
      },
      bgselect: function () {
        popup.showPopup({
          text: '下载带背景立绘该功能尚未完善</br>想要带背景的高清立绘可以在站长群获得'
        })
        // this.bgYes = !this.bgYes;
      },
      // 选择第几张图
      selectImg: function (index) {
        this.select = index;
      },
      // 下载图片
      download: function () {
        if (this.bgYes) {
          // 下载带背景的图未实现
          popup.showPopup({
            text: '下载带背景立绘该功能尚未完善</br>想要带背景的高清立绘可以在站长群获得'
          })
          this.isShow = false;
        } else {
          downloadIamge(this.thisRoleUrl(), this.roleinfo.cutin);
          this.isShow = false;
        }
      },
      thisRoleUrl: function () {
        if (this.select > 0) {
          return this.getImg(this.roleinfo.cutin + `_${this.select}`, false);
        } else {
          return this.getImg(this.roleinfo.cutin, false);
        }
      },
      // 根据角色星级判断是否多张
      listnum: function () {
        if (this.roleinfo.rare == 3) return true;
        if (this.roleinfo.rare == 2 && this.roleinfo.up == 1) return true;
        return false;
      },
      setRoleImgList: function () {
        let roleinfo = this.roleinfo;
        if (this.listnum()) {
          this.roleImgList.push({ url: this.getImg(roleinfo.cutin) });
          for (let i = 1; i < 5; i++) {
            this.roleImgList.push({ url: this.getImg(roleinfo.cutin + `_${i}`) });
          }
        } else {
          this.roleImgList.push({ url: this.getImg(roleinfo.cutin) });
        }
        this.select = 0;
        this.$set(this.roleImgList, 0, { url: this.roleImgList[0].url, status: true });
      },
      getImg: function (cutin, smoll = true) {
        if (!cutin) return 'null.png';
        if (smoll) {
          return this.OSSURL + cutin.slice(cutin.indexOf('_')) + '.png?x-oss-process=style/tosmoll';
        } else {
          return this.OSSURL + cutin.slice(cutin.indexOf('_')) + '.png';
        }
      },
    }
  })

  // 角色列表Vue模块
  var roleList = new Vue({
    el: '#role-list',
    data() {
      return {
        OSSURL: 'http://saoimages.oss-cn-shenzhen.aliyuncs.com/roles/allrole/allrole/character',
        roleList: [{ // 默认值防止异步报错
          cutin: '',
          title: '',
          name: '',
          status: false // 记录该角色图片加载成功与否
        }], // 页面上显示的列表
        roleListPage: [], // 所有的分页数据
        page: null, // 所有的页数
        nowPage: 0, // 当前加载的页数
        hidden: true // 角色列表显示
      }
    },
    // 钩子函数
    updated() {
      Mask.loadoverMask('#ffc343');
    },
    methods: {
      // 根据角色编号拼接图片地址 character_102001_1
      getImg: function (cutin, smoll = true) {
        if (!cutin) return 'null.png';
        if (smoll) {
          return this.OSSURL + cutin.slice(cutin.indexOf('_')) + '.png?x-oss-process=style/tosmoll';
        } else {
          return this.OSSURL + cutin.slice(cutin.indexOf('_')) + '.png';
        }
      },
      // 拼接本地的图片地址
      localImg: function (cutin) {
        if (!cutin) return 'null.png';
        let url = '../img/pictureLL/character' + cutin.slice(cutin.indexOf('_')) + '.png';
        let style = `../images/newRoles/019.png`;
        return style;
      },
      // 将请求到的所有角色数据分页
      paging: function (data) {
        this.roleList = []; // 将默认值清除
        this.roleListPage = MPB.paging(data.data, 12); // 保存分页数据
        this.page = this.roleListPage.length; // 记录总页数
        this.setRoleList(0); // 渲染第一页
        // this.hidden = false;
      },
      // 将第n页的数据插入角色列表
      setRoleList: function (page) {
        this.roleList = [...this.roleList, ...this.roleListPage[page]];
      },
      // 加载更多页
      loadmore: function () {
        this.nowPage += 1;
        this.setRoleList(this.nowPage);
      },
      // 图片加载失败 记录状态false
      loadError: function (index) {
        this.roleList[index].status = false;
      },
      // 图片加载成功 记录状态true
      loadSuccess: function (index) {
        this.roleList[index].status = true;
      },

      // 点击li打开全部立绘
      toBigImg: function (index) {
        if (this.roleList[index].status) {
          roleImg.roleinfo = this.roleList[index];
          roleImg.isShow = true;
        } else {
          popup.showPopup({
            title: 'Message',
            text: '该角色的立绘暂无</br>无法下载（>_<）'
          })
        }
      }
    }
  })
  // 获取角色列表
  MPB.ajax({
    method: "post",
    url: "/userfind",
    data: null,
    success: roleList.paging,
    error: () => {
      roleList.page = 0;
      popup.showPopup({
        title: '出错啦！(>_<)!',
        text: '在获取角色列表时出现错误，土豆(服务器)熟惹(崩了)！'
      })
    }
  });

  // 下载逻辑
  function downloadIamge(imgsrc, name) {
    //下载图片地址和图片名
    console.log(imgsrc);
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      var _dataURL = canvas.toDataURL('image/png'); //得到图片的base64编码数据

      var blob_ = dataURLtoBlob(_dataURL); // 用到Blob是因为图片文件过大时，在一些浏览器上会下载失败，而Blob就不会

      var url = {
        name: name || "图片", // 图片名称不需要加.png后缀名
        src: blob_
      };

      if (window.navigator.msSaveOrOpenBlob) {   // if browser is IE
        navigator.msSaveBlob(url.src, url.name);//filename文件名包括扩展名，下载路径为浏览器默认路径
      } else {
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(url.src));
        link.setAttribute("download", url.name + '.png');
        link.click();
      }
    };
    image.src = imgsrc;

    function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
  // 公告点击展开按钮
  var nwit = 1;
  $('#NoticeOpen').click(function () {
    if (nwit === 1) {
      $('.Phone-Notice').css("left", "0px")
      $("#NoticeOpen > .select-open-lines").toggleClass('close');
      $('.mainPage').css('left', '100px');
      nwit = 0;
    } else {
      $('.Phone-Notice').css("left", "-230px")
      $("#NoticeOpen > .select-open-lines").toggleClass('close');
      $('.mainPage').css('left', '0px');
      nwit = 1;
    }
  })
  // 公告内容初始化
  function NoticeInit(data) {
    let NoticeText = document.getElementsByClassName('Notice-text')[0];
    NoticeText.innerHTML = `
    <div class="Notice-text__greet">
      <span>${data[0].text}</span>
      <div class='greet-time'>${data[0].time}</div>
    </div>
    `;
    BasicConfig.Notice.forEach((val) => {
      NoticeText.innerHTML += `
    <div class="Notice-text__greet">
      <span>${val.title}</span>
      <p><a href='${val.href}' target='_blank'>${val.p}</a></p>
      <div class='greet-time'>${val.time}</div>
    </div>
    `;
    });

  }
  // 获取公告
  MPB.ajax({
    url: '/notice/get',
    method: 'get',
    success: NoticeInit,
    error: () => {
      popup.showPopup({
        text: "公告信息获取失败！"
      })
    }
  })
  // 滚动至底部加载更多
  // 防抖处理
  var isBottom = MPB.debounce(function () {
    if (Scroll.getScrollHeight() == Scroll.getWindowHeight() + Scroll.getScrollTop()) {
      roleList.loadmore();
    }
  });
  // 添加页面滚动事件
  Scroll.windowScroll(isBottom);
}