function downloadPageInit() {
  var popup = new MPBpopup('.saopopup-container', {
    title: 'Message',
    text: '哎呀，什么也没找到呢<p>检查一下检索条件吧(^_^)</p>',
    okFunc: () => { popup.hiddenPopup() },
    oneKey: true
  })

  // 角色列表
  var roleList = new Vue({
    el: '#role-list',
    data() {
      return {
        OSSURL: 'https://saoimages.oss-cn-shenzhen.aliyuncs.com/allrole/character',
        roleList: [],
        roleListPage:[],
        page:0
      }
    },
    updated (){
      Mask.loadoverMask('#ffc343');
    },
    methods: {
      // 根据角色编号拼接图片地址 character_102001_1
      getImg: function (cutin) {
        if(!cutin) return 'null.png';
        let url = this.OSSURL + cutin.slice(cutin.indexOf('_')) + '.png';
        return url;
      },
      // 拼接本地的图片地址
      localImg: function (cutin) {
        if(!cutin) return 'null.png';
        let url = '../img/pictureLL/character' + cutin.slice(cutin.indexOf('_')) + '.png';
        let style = `../images/newRoles/019.png`;
        return style;
      },
      // 数据分页
      paging:function(data){
        this.roleListPage = MPB.paging(data.data, 10);
        this.page = this.roleListPage.length;
        this.setRoleList(0);
      },
      // 设置角色列表
      setRoleList: function (page) {
        this.roleList = this.roleListPage[page];
      }
    }
  })

  // 获取角色列表
  MPB.ajax({
    method: "post",
    url: "/userfind",
    data: null,
    success: roleList.paging
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
}