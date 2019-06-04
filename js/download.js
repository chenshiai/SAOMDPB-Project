function downloadPageInit() {
  var popup = new MPBpopup('.saopopup-container', {
    title: 'Message',
    text: '哎呀，什么也没找到呢<p>检查一下检索条件吧(^_^)</p>',
    okFunc: () => { popup.hiddenPopup() },
    oneKey: true
  })
  // 角色列表Vue模块
  var roleList = new Vue({
    el: '#role-list',
    data() {
      return {
        OSSURL: 'https://saoimages.oss-cn-shenzhen.aliyuncs.com/allrole/character',
        roleList: [{
          cutin:'',
          title:'',
          name:''
        }], // 页面上显示的列表
        roleListPage: [], // 所有的分页数据
        page: null, // 所有的页数
        nowPage: 0, // 当前加载的页数
        imgStatus: []
      }
    },
    updated() {
      Mask.loadoverMask('#ffc343');
    },
    methods: {
      // 根据角色编号拼接图片地址 character_102001_1
      getImg: function (cutin) {
        if (!cutin) return 'null.png';
        let url = this.OSSURL + cutin.slice(cutin.indexOf('_')) + '.png';
        return url;
      },
      // 拼接本地的图片地址
      localImg: function (cutin) {
        if (!cutin) return 'null.png';
        let url = '../img/pictureLL/character' + cutin.slice(cutin.indexOf('_')) + '.png';
        let style = `../images/newRoles/019.png`;
        return style;
      },
      // 数据分页
      paging: function (data) {
        this.roleList = [];
        this.roleListPage = MPB.paging(data.data, 10);
        this.page = this.roleListPage.length;
        this.setRoleList(0);
      },
      // 设置角色列表
      setRoleList: function (page) {
        // let pageData = ;
        this.roleList = this.roleList.concat(this.roleListPage[page]);
      },
      // 加载更多
      loadmore: function () {
        this.nowPage += 1;
        this.setRoleList(this.nowPage);
      },
      loadError: function (index) {
        // 图片加载失败 记录状态false
        this.imgStatus[index] = false;
      },
      loadSuccess: function (index) {
        // 图片加载成功 记录状态true
        this.imgStatus[index] = true;
      },
      toBigImg: function (index) {
        if (this.imgStatus[index]) {
          let cutin = this.roleList[index].cutin;
          console.log(cutin);
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