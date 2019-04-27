function roleDetaiInit(){
  var url = window.location.pathname;
  var theId = url.split('/').pop();
  MPB.ajax({
    method:"get",
    url:"/roledata/data/"+theId,
    data:null,
    success:getRoleData
  });

  // 回调函数 数据写入
  function getRoleData(res){
    setRoleInfo(res.data[0]);
    setRolePanel(res.data[0]);
    setRoleDesign(res.data[0]);
    setRoleSp(res.sp);
    setRoleslot(res.slotskill);
    setSwordskill(res.swordskill,res.data[0]);
    setBattleskill(res.battleskill);
    Mask.loadoverMask("#ffc343");
  }
  function setRoleInfo(data){
    var roleInfoCutin = document.getElementsByClassName('cutin-img');
    roleInfoCutin[0].querySelector('img').setAttribute('src',`../images/cutin/${data.cutin}.gif`);

    var ele = document.getElementsByClassName('ele');
    ele[0].innerHTML = `<img src='../images/icon/Element/icon_attribute_${data.element}.png' alt=''/>`;

    var wea = document.getElementsByClassName('wea');
    wea[0].innerHTML = `<img src='../images/icon/weapon/icon_job_${data.weapon}.png' alt=''/>`;

    var detailRarity = document.getElementsByClassName('detail-rarity');
    for(let i = data.rare+3;i--;){
      var star = document.createElement('img');
      star.setAttribute('src','../images/icon/icon_rarity_1.png');
      detailRarity[0].append(star);
    }
    if(data.up == 1){
      var star = document.createElement('img');
      star.setAttribute('src','../images/icon/icon_rarity_2.png');
      detailRarity[0].append(star);
    }

    var detailTitle = document.getElementsByClassName('detail-title');
    detailTitle[0].innerHTML = data.title;

    var detailName = document.getElementsByClassName('detail-name');
    detailName[0].innerHTML = data.name;

    var Tips = document.getElementsByClassName('detail-tips');
    Tips[0].innerHTML = "Tips：" + data.tips;
  }

  function setRolePanel(data){
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
  function setRoleDesign(data){
    var itemImg = document.getElementsByClassName('item-img');
    var links = document.getElementsByClassName('role-design__links');
    itemImg[0].querySelector('img').setAttribute('src',`../images/${data.cutin}.jpg`);
    if(data.rare == 3){
      var i = 1;
      for(;i<itemImg.length;i++){
        itemImg[i].querySelector('img').setAttribute('src',`../images/${data.cutin}_${i}.jpg`);
      }
    } else if(data.rare != 2 || data.up != 1){
      links[0].style.display = 'none';
    }
  }
  function setRoleSp(data){
    var spItem = document.getElementsByClassName('sp-item')[0];
    for(var item of data){
      var img = document.createElement('img');
      img.setAttribute('src',`../images/${item.img}.png`);
      img.setAttribute('alt',item.sp);
      spItem.append(img);
    }
  }
  function setRoleslot(data){
    for(var item of data){
      var slotskillLi = document.getElementById('slotskill-li').cloneNode(true);
      slotskillLi.style.display = 'inline-block';
      slotskillLi.setAttribute('id','slotskillLi');
      slotskillLi.getElementsByTagName('img')[0].setAttribute('src',`../images/${item.img}.png`);
      slotskillLi.getElementsByTagName('span')[0].innerHTML = `${item.ssname}(LV:${item.lv})`;
      slotskillLi.getElementsByTagName('p')[0].innerHTML = item.sstext;
      document.getElementsByClassName('slotskill-list')[0].append(slotskillLi);
    }
    
  }
  function setSwordskill(data,ss3){
    var ssItem = document.getElementsByClassName('swordskill-list__item');
    ssItem[0].getElementsByTagName('span')[0].innerHTML = `${data[0].ssname}(MP：${data[0].ssmp})`;
    ssItem[1].getElementsByTagName('span')[0].innerHTML = `${data[1].ssname}(MP：${data[1].ssmp})`;
    ssItem[2].getElementsByTagName('span')[0].innerHTML = `${ss3.ss3}(MP：${ss3.ss3mp})`;
    ssItem[0].getElementsByTagName('p')[0].innerHTML = data[0].sstext;
    ssItem[1].getElementsByTagName('p')[0].innerHTML = data[1].sstext;
    ssItem[2].getElementsByTagName('p')[0].innerHTML = ss3.ss3text;
  }
  function setBattleskill(data){
    var bsItem = document.getElementsByClassName('battleskill-list__item');
    bsItem[0].getElementsByTagName('span')[0].innerHTML = data[0].ssname;
    bsItem[1].getElementsByTagName('span')[0].innerHTML = data[1].ssname;
    bsItem[2].getElementsByTagName('span')[0].innerHTML = data[2].ssname;
    bsItem[0].getElementsByTagName('p')[0].innerHTML = data[0].sstext;
    bsItem[1].getElementsByTagName('p')[0].innerHTML = data[1].sstext;
    bsItem[2].getElementsByTagName('p')[0].innerHTML = data[2].sstext;
  }
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
  function NoticeInit(){

    var NoticeGreet = document.querySelectorAll('.Notice-text__greet');
    var i = 0;
    BasicConfig.Notice.forEach((val)=>{
      var inner = `<span>${val.title}</span><p><a href='${val.href}' target='_blank'>${val.p}</a></p><div class='greet-time'>${val.time}</div>`;
      NoticeGreet[i].innerHTML = inner;
      i++;
    });
  }
}