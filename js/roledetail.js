function roleDetaiInit() {
  var url = window.location.pathname;
  var theId = url.split('/').pop();
  MPB.ajax({
    method: "get",
    url: "/roledata/data/" + theId,
    data: null,
    success: getRoleData,
    error: getError
  });
  var popup = new MPBpopup('.saopopup-container', {
    title: 'Message',
    text: "获取角色信息出现错误<p>点击确定返回首页</p>",
    okFunc: () => {
      window.location.href = "/";
    }
  })
  function getError() {
    popup.showPopup();
  }
  // 该页面全局变量，存储当前页面角色的信息
  var alldata = null;
  // 回调函数 数据写入
  function getRoleData(res) {
    Mask.loadoverMask("#ffc343");
    alldata = res.data[0];
    setRoleInfo(alldata);
    setRolePanel(alldata);
    $('.role-design').click(function(){
      setRoleDesign(alldata);
    });
    getRoleSp(alldata.sp);
  }
  function setRoleInfo(data) {
    var roleInfoCutin = document.getElementsByClassName('cutin-img');
    roleInfoCutin[0].querySelector('img').setAttribute('src', `http://saoimages.oss-cn-shenzhen.aliyuncs.com/saoImage/${data.cutin}.gif`);

    var ele = document.getElementsByClassName('ele');
    ele[0].innerHTML = `<img src='../images/icon/Element/icon_attribute_${data.element}.png' alt=''/>`;

    var wea = document.getElementsByClassName('wea');
    wea[0].innerHTML = `<img src='../images/icon/weapon/icon_job_${data.weapon}.png' alt=''/>`;

    var detailRarity = document.getElementsByClassName('detail-rarity');
    for (let i = data.rare + 3; i--;) {
      var star = document.createElement('img');
      star.setAttribute('src', '../images/icon/icon_rarity_1.png');
      detailRarity[0].append(star);
    }
    if (data.up == 1) {
      var star = document.createElement('img');
      star.setAttribute('src', '../images/icon/icon_rarity_2.png');
      detailRarity[0].append(star);
    }

    var detailTitle = document.getElementsByClassName('detail-title');
    detailTitle[0].innerHTML = data.title;

    var detailName = document.getElementsByClassName('detail-name');
    detailName[0].innerHTML = data.name;

    var Tips = document.getElementsByClassName('detail-tips');
    Tips[0].innerHTML = "Tips：" + data.tips;
    var ssItem = document.getElementsByClassName('swordskill-list__item');
    ssItem[2].getElementsByTagName('span')[0].innerHTML = `${data.ss3}(MP：${data.ss3mp})`;
    ssItem[2].getElementsByTagName('p')[0].innerHTML = data.ss3text;
  }

  function setRolePanel(data) {
    var hp = document.getElementsByClassName('hpA');
    hp[0].innerHTML = `HP<span>${data.HP}</span>`;
    hp[0].style.width = (Number(data.HP) / 220) + "%";

    var mp = document.getElementsByClassName('mpA');
    mp[0].innerHTML = `MP<span>${data.MP}</span>`;
    mp[0].style.width = (Number(data.MP) / 4) + "%";

    var atk = document.getElementsByClassName('atkA');
    atk[0].innerHTML = `ATK<span>${data.ATK}</span>`;
    atk[0].style.width = (Number(data.ATK) / 55) + "%";

    var def = document.getElementsByClassName('defA');
    def[0].innerHTML = `DEF<span>${data.DEF}</span>`;
    def[0].style.width = (Number(data.DEF) / 50) + "%";

    var cri = document.getElementsByClassName('criA');
    cri[0].innerHTML = `CRI<span>${data.CRI}</span>`;
    cri[0].style.width = (Number(data.CRI) / 53) + "%";
  }
  function setRoleDesign(data) {
    var itemImg = document.getElementsByClassName('item-img');
    var links = document.getElementsByClassName('role-design__links');
    if (data.rare == 3 || (data.rare == 2 && data.up == 1)) {
      itemImg[0].querySelector('img').setAttribute('src', `../images/pictureL/r6/${data.cutin}.jpg`);
      var i = 1;
      for (; i < itemImg.length; i++) {
        itemImg[i].querySelector('img').setAttribute('src', `../images/pictureL/r6/${data.cutin}_${i}.jpg`);
      }
    } else {
      itemImg[0].querySelector('img').setAttribute('src', `../images/pictureL/${data.cutin}.jpg`);
      links[0].style.display = 'none';
    }
  }

  function getRoleSp(sp) {
    if (sp != "" && sp != null) {
      var str = sp.split('/').join(',');
      str = "sp=" + str.substring(0, str.length - 1);
      MPB.ajax({
        method: "post",
        url: "/roledata/sp",
        data: str,
        success: setRoleSp,
        error: getError
      });
    } else {
      getRoleslot(alldata.sslot);
    }
  }
  function setRoleSp(data) {
    var ss3sp = document.getElementsByClassName('ss3-sp')[0];

    for (var item of data.sp) {
      var img = document.createElement('img');
      var spItem = document.createElement('div');
      spItem.className = "sp-item";
      img.setAttribute('src', `../images/status/${item.img}.png`);
      img.setAttribute('alt', item.sp);
      spItem.append(img);
      ss3sp.append(spItem);
    }
    getRoleslot(alldata.sslot);
  }
  function getRoleslot(slot) {
    if (slot != "" && slot != null) {
      var str = slot.split('/').join(',');
      str = "slot=" + str.substring(0, str.length - 1);
      MPB.ajax({
        method: "post",
        url: "/roledata/slot",
        data: str,
        success: setRoleslot,
        error: getError
      });
    } else {
      getSwordskill(alldata.ss1, alldata.ss2);
    }
  }
  function setRoleslot(data) {
    for (var item of data.slotskill) {
      var slotskillLi = document.getElementById('slotskill-li').cloneNode(true);
      slotskillLi.style.display = 'inline-block';
      slotskillLi.setAttribute('id', 'slotskillLi');
      slotskillLi.getElementsByTagName('img')[0].setAttribute('src', `../images/skillslot/slot_skill_icon_${item.img}.png`);
      slotskillLi.getElementsByTagName('span')[0].innerHTML = `${item.ssname}(LV:${item.lv})`;
      slotskillLi.getElementsByTagName('p')[0].innerHTML = item.sstext;
      document.getElementsByClassName('slotskill-list')[0].append(slotskillLi);
    }
    getSwordskill(alldata.ss1, alldata.ss2);
  }
  function getSwordskill(ss1, ss2) {
    if (ss1 != "" && ss1 != null) {
      var str = "ss=" + ss1 + ',' + ss2;
      MPB.ajax({
        method: "post",
        url: "/roledata/ss",
        data: str,
        success: setSwordskill,
        error: getError
      });
    } else {
      getBattleskill(alldata.bs1, alldata.bs2, alldata.bs3);
    }
  }
  function setSwordskill(data) {
    var ssItem = document.getElementsByClassName('swordskill-list__item');
    ssItem[0].getElementsByTagName('span')[0].innerHTML = `${data.swordskill[0].ssname}(MP：${data.swordskill[0].ssmp})`;
    ssItem[1].getElementsByTagName('span')[0].innerHTML = `${data.swordskill[1].ssname}(MP：${data.swordskill[1].ssmp})`;
    ssItem[0].getElementsByTagName('p')[0].innerHTML = data.swordskill[0].sstext;
    ssItem[1].getElementsByTagName('p')[0].innerHTML = data.swordskill[1].sstext;
    getBattleskill(alldata.bs1, alldata.bs2, alldata.bs3);
  }
  function getBattleskill(bs1, bs2, bs3) {
    if (bs1 != "" && bs1 != null) {
      var str = "bs=" + bs1 + ',' + bs2 + ',' + bs3;
      MPB.ajax({
        method: "post",
        url: "/roledata/bs",
        data: str,
        success: setBattleskill,
        error: getError
      });
    } else {
      getCardinfo(alldata.card);
    }
  }
  function setBattleskill(data) {
    var bsItem = document.getElementsByClassName('battleskill-list__item');
    bsItem[0].getElementsByTagName('span')[0].innerHTML = data.battleskill[0].ssname;
    bsItem[1].getElementsByTagName('span')[0].innerHTML = data.battleskill[1].ssname;
    bsItem[2].getElementsByTagName('span')[0].innerHTML = data.battleskill[2].ssname;
    bsItem[0].getElementsByTagName('p')[0].innerHTML = data.battleskill[0].sstext;
    bsItem[1].getElementsByTagName('p')[0].innerHTML = data.battleskill[1].sstext;
    bsItem[2].getElementsByTagName('p')[0].innerHTML = data.battleskill[2].sstext;
    getCardinfo(alldata.card);
  }
  function getCardinfo(cardId) {
    if (cardId != "" && cardId != null) {
      var str = "cardId=" + cardId;
      MPB.ajax({
        method: "post",
        url: "/roledata/card",
        data: str,
        success: setCardinfo,
        error: getError
      })
    } else {
      getAllReply(theId);
    }
  }
  function setCardinfo(data) {
    var cardinfo = data.cardinfo[0];
    var cardrole = data.cardrole;
    var cardsImg = document.getElementsByClassName('cards-img')[0];
    cardsImg.innerHTML = `<img src='../images/card/${cardinfo.imgurl}.jpg'/>`;

    var cardsSpan = document.getElementsByClassName('cards-detail__span')[0];
    cardsSpan.innerHTML = cardinfo.name;

    var cardsP = document.getElementsByClassName('cards-detail__p')[0];
    cardsP.innerHTML = cardinfo.title;

    var cardsCutin = document.getElementsByClassName('cards-cutin')[0];
    for (var item of cardrole) {
      var img = document.createElement('img');
      img.setAttribute('src', `http://saoimages.oss-cn-shenzhen.aliyuncs.com/saoImage/${item.cutin}.gif`);
      img.setAttribute('onclick', `goto('/roles/${item.id}')`);
      cardsCutin.append(img);
    }
    getAllReply(theId);
  }
  function getAllReply(roleId) {
    if (roleId != "" && roleId != null) {
      var str = "roleId=" + roleId;
      MPB.ajax({
        method: "post",
        url: "/reply/getreply",
        data: str,
        success: setAllReply,
        error: getError
      })
    }
  }
  var replynum = 0;
  function setAllReply(data) {
    var allreply = document.getElementsByClassName('allreply')[0];
    for (var item of data) {
      replynum++;
      var content = document.getElementById('replyContent').cloneNode(true);
      content.setAttribute('id', 'userReply');
      content.style.display = 'flex';
      content.getElementsByClassName('reply-num')[0].innerHTML = replynum;
      content.getElementsByClassName('reply-author')[0].innerHTML = item.user;
      content.getElementsByClassName('reply-time')[0].innerHTML = item.time;
      content.getElementsByClassName('reply-detail')[0].innerHTML = item.centent;
      allreply.insertBefore(content, allreply.childNodes[0]);
    }
    document.getElementsByClassName('now-num')[0].innerHTML = replynum;
  }

  // 发表评论
  $('.toReply').click(function () {
    var myDate = new Date();
    var data = () => String(myDate.getMonth()).length == 1 ? '0' + String(myDate.getMonth() + 1) : myDate.getMonth();
    var time = myDate.getFullYear() + '-' + data() + '-' + myDate.getDate();
    var user = $('#username').val() || "Anonymous";
    var reply = $('#reply').val();
    var str = `user=${user}&reply=${reply}&time=${time}&role=${theId}`;
    function addReply() {
      $('#username').val("");
      $('#reply').val("");
      popup.showPopup({
        text: "已经收到了你的评论<p>感谢~~</p>",
        okFunc: popup.hiddenPopup
      })
      var allreply = document.getElementsByClassName('allreply')[0];
      replynum++;
      var content = document.getElementById('replyContent').cloneNode(true);
      content.setAttribute('id', 'userReply');
      content.style.display = 'flex';
      content.getElementsByClassName('reply-num')[0].innerHTML = replynum;
      content.getElementsByClassName('reply-author')[0].innerHTML = user;
      content.getElementsByClassName('reply-time')[0].innerHTML = time;
      content.getElementsByClassName('reply-detail')[0].innerHTML = reply;
      allreply.insertBefore(content, allreply.childNodes[0]);
      document.getElementsByClassName('now-num')[0].innerHTML = replynum;
    }
    if (reply != null && reply != "") {
      MPB.ajax({
        method: 'post',
        url: '/reply/addreply',
        data: str,
        success: addReply,
        error: getError
      })
    } else {
      popup.showPopup({
        text: "无法发表<p>说点什么吧~(^_^)</p>",
        okFunc: popup.hiddenPopup
      })
    }
  })

  // 卡池滚动触发器
  var roleArea = document.getElementsByClassName('role-area')[0];
  var cardFixedFunc = {
    after: function () {
      var theNode = document.querySelector('.card-reply');
      if (Scroll.getClientWidth() < 770) {
        theNode.style.width = "100%";
      } else {
        theNode.style.position = 'fixed';
        theNode.style.top = '90px';
        theNode.style.right = roleArea.offsetLeft + "px";
      }
    },
    before: function () {
      var theNode = document.querySelector('.card-reply');
      theNode.style.position = 'static';
    }
  }
  new MPB.ScrollTrigger(100,cardFixedFunc.after,cardFixedFunc.before);

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
  NoticeInit();
  // 公告内容初始化
  function NoticeInit() {

    var NoticeGreet = document.querySelectorAll('.Notice-text__greet');
    var i = 0;
    BasicConfig.Notice.forEach((val) => {
      var inner = `<span>${val.title}</span><p><a href='${val.href}' target='_blank'>${val.p}</a></p><div class='greet-time'>${val.time}</div>`;
      NoticeGreet[i].innerHTML = inner;
      i++;
    });
  }
}