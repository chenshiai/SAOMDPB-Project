﻿
/**
 * 用于index.html的方法
 */
function IndexInit() {
  var popup = new MPBpopup('.saopopup-container', {
    title: 'Message',
    text: '哎呀，什么也没找到呢<p>检查一下检索条件吧(^_^)</p>',
    okFunc: () => { popup.hiddenPopup() },
    oneKey: true
  })
  // 事件代理，点击切换内容
  var selectlListItem = $(".select-list__item");
  for (item of selectlListItem) {
    item.onclick = function (ev) {
      var ev = ev || window.event;
      var target = ev.target || ev.srcElement;
      if (target.getAttribute('class') === "item-list__span") {
        var childSpan = this.children[0];
        childSpan.innerHTML = target.innerHTML;
        childSpan.setAttribute('val', target.getAttribute('val'));
      }
    }
  }
  // 清空选项
  $('#clearSelect').click(function () {
    var itemTitle = $('.item-title');
    var selectInit = ['选择属性', '选择武器', '选择性别', '选择星级', '选择角色'];
    for (let i = 0; i < 5; i++) {
      itemTitle[i].innerHTML = selectInit[i];
      itemTitle[i].setAttribute('val', '');
    }
  });

  // 获取选项
  function getUserFind() {
    var userfind = {
      element: '',
      weapon: '',
      sex: '',
      rare: '',
      role: ''
    }
    userfind.element = selectlListItem[0].children[0].getAttribute('val');
    userfind.weapon = selectlListItem[1].children[0].getAttribute('val');
    userfind.sex = selectlListItem[2].children[0].getAttribute('val');
    userfind.rare = selectlListItem[3].children[0].getAttribute('val');
    userfind.role = selectlListItem[4].children[0].getAttribute('val');
    return userfind;
  }
  // 点击检索事件
  $('#startFind').click(function () {
    Mask.loadingMask("#ffc343");
    var userfind = getUserFind();
    var data = `element=${userfind.element}&weapon=${userfind.weapon}&sex=${userfind.sex}&rare=${userfind.rare}&role=${userfind.role}`;
    if (Scroll.getClientWidth() < 770) {
      $('.select-list').css('height', '0');
      $("#RoleOpen > .select-open-lines").toggleClass('close');
      swit = 1;
    }
    MPB.setCookie('userfind', data, 1);
    setTimeout(() => {
      MPB.ajax({
        method: "post",
        url: "/userfind",
        data: data,
        success: roleCardDate,
        error: requestError
      });
    }, 500)

  })
  // 获取cookie
  if (MPB.getCookie('userfind') != "" && MPB.getCookie('userfind') != null && MPB.getCookie('userfind') != undefined) {
    var data = MPB.getCookie('userfind');
    setTimeout(() => {
      MPB.ajax({
        method: "post",
        url: "/userfind",
        data: data,
        success: roleCardDate,
        error: requestError
      });
    }, 500)
  }
  // 回调函数
  // 接收response = response.datas
  function roleCardDate(response) {
    var loadmore = document.getElementsByClassName("loadmore");
    document.querySelector('.rolecard-list').innerHTML = '';
    function overload() {
      loadmore[0].innerHTML = "没有更多了！";
      loadmore[0].onclick = null;
    }
    var lazyload = new MPB.Taglazyload(response.data, inputRoleCard, overload);
    loadmore[0].style.display = "block";
    loadmore[0].onclick = null;
    loadmore[0].innerHTML = "点击加载更多";
    lazyload.lazyload(10)
    loadmore[0].onclick = function () {
      lazyload.lazyload(10)
    }
    setTimeout(function () {
      Mask.loadoverMask('#ffc343');
    }, 500);
  }
  
  function requestError() {
    Mask.loadoverMask('#ffc343');
    setTimeout(function () {
      popup.showPopup();
    }, 500);
  }
  // 数据写入
  function inputRoleCard(data) {
    var roleCard = document.querySelector('#rolecard').cloneNode(true);
    roleCard.style.display = 'flex';
    roleCard.id = 'newcard';
    roleCard.setAttribute('onclick', 'goto("/roles/' + data.id + '")');
    roleCard.querySelector('.item-cutin').innerHTML =
      `<img src="./images/cutin/${data.cutin}.gif" alt="" />`;
    for (let i = data.rare + 3; i--;) {
      var roleRare = document.createElement('img');
      roleRare.src = './images/icon/icon_rarity_1.png';
      roleCard.querySelector('.item-detail__rarity').append(roleRare);
    }
    if (data.up == "1") {
      var roleRare1 = document.createElement('img');
      roleRare1.src = './images/icon/icon_rarity_2.png';
      roleCard.querySelector('.item-detail__rarity').append(roleRare1);
    }
    roleCard.querySelector('.item-detail__title').innerHTML = data.title;
    roleCard.querySelector('.item-detail__name').innerHTML = data.name;
    // 属性，武器未写
    roleCard.querySelector('.item-ele').innerHTML = `<img src='./images/icon/Element/icon_ele_${data.element}.png'>`;
    roleCard.querySelector('.item-wea').innerHTML = `<img src='./images/icon/weapon/icon_job_${data.weapon}.png'>`;
    roleCard.querySelector('.hpA').innerHTML = `HP:${data.HP}`;
    roleCard.querySelector('.mpA').innerHTML = `MP:${data.MP}`;
    roleCard.querySelector('.atkA').innerHTML = `ATK:${data.ATK}`;
    roleCard.querySelector('.defA').innerHTML = `DEF:${data.DEF}`;
    roleCard.querySelector('.criA').innerHTML = `CRI:${data.CRI}`;
    document.querySelector('.rolecard-list').append(roleCard);
  }
  // 请求 swiper 框架使用
  function swiperinit() {
    var slidesPerView = 3;
    if (Scroll.getClientWidth() < 770) {
      slidesPerView = 1;
    }
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: slidesPerView,
      spaceBetween: 10,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    var newRoles = BasicConfig.newRoles;
    let i = 0;
    $('.swiper-slide').find('img').each(function () {
      $(this).attr('src', newRoles[i].src);
      i++;
    });
    MPB.ajax({
      url:'/notice/get',
      method:'get',
      success:NoticeInit,
      error:()=>{
        popup.showPopup({
          text:"公告信息获取失败！"
        })
      }
    })
  }
  MPB.load({
    urls: ["https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.2/js/swiper.min.js"],
    callback: swiperinit
  })

  // 创建滚动触发器
  var selectEvent = {
    Fiexd: function () {
      var theNode = document.querySelector(".section-select");
      var selectList = document.getElementsByClassName('select-list')[0];
      theNode.style.position = 'fixed';
      if (Scroll.getClientWidth() < 770) {
        theNode.style.top = '60px';
        selectList.classList.remove('M_up');
        selectList.classList.add('M_down');
      } else {
        theNode.style.top = '90px';
      }
    },
    Relat: function () {
      var theNode = document.querySelector(".section-select");
      var selectList = document.getElementsByClassName('select-list')[0];
      theNode.style.position = 'relative';
      if (Scroll.getClientWidth() < 770) {
        selectList.classList.add('M_up');
        selectList.classList.remove('M_down');
      }
      theNode.style.top = '0px';
    }
  }
  //设置触发器具体内容
  var sel = new MPB.ScrollTrigger(400, selectEvent.Fiexd, selectEvent.Relat);

  // 滚动触发器结束

  //点击展开角色筛选
  var swit = 1;
  $('#RoleOpen').click(function () {
    if (swit === 1) {
      $("#RoleOpen").prev().css('height', '280px');
      $("#RoleOpen > .select-open-lines").toggleClass('close');
      swit = 0;
    } else {
      $("#RoleOpen").prev().css('height', '0px');
      $("#RoleOpen > .select-open-lines").toggleClass('close');
      swit = 1;
    }
  })

  //点击展开公告显示
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
  console.log('初始化完成');
  Mask.loadoverMask('#ffc343');
}