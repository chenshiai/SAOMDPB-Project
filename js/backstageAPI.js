function backstageInit() {
  addNotice();
}
// 该页面的全局弹窗对象
var backstagePopup = new MPBpopup('.saopopup-container',{
  okFunc:()=>{backstagePopup.hiddenPopup()},
  oneKey:true
})
// 添加公告
function addNotice() {
  MPB.ajax({
    url:'/notice/get',
    method:'get',
    success:setNotice,
    error:()=>{
      backstagePopup.showPopup({
        text:"公告信息获取失败！"
      })
    }
  })
  function setNotice(data){
    var noticeList = document.getElementsByClassName('notice-list')[0];
    for (let index in data) {
      let item = data[index];
      noticeList.innerHTML += `
      <li class="notice-list-item" id="notice${item.id}">
        <div class="notice-id">
          编号：${item.id}
        </div>
        <div class="notice-text">
            内容：${item.text}
        </div>
        <div class="notice-time">
            时间：${item.time}</div>
          <span class="notice-update notice-button" onclick="notice.update(${item.id})">编辑</span>
          <span class="notice-delete notice-button" onclick="notice.delete(${item.id})">删除</span>
          <div class="notice-change hidden">
            <textarea type="text" id="notice-textarea">${item.text}
              </textarea>
            <span class="notice-submit notice-button" onclick="notice.submit(${item.id})">提交</span>
            <span class="notice-cancle notice-button" onclick="notice.cancle(${item.id})">取消</span>
        </div>
      </li>
      `
    }
  }
}
// 公告上面绑定的方法
const notice = {
  getNoticeItem:function(id){
    return document.getElementById("notice"+id);
  },
  update:function(id){
    let thisNode = notice.getNoticeItem(id);
    thisNode.getElementsByClassName('notice-change')[0].classList.remove('hidden');
  },
  delete:function(id){
    let thisNode = notice.getNoticeItem(id);
    let noticeList = document.getElementsByClassName('notice-list')[0];
    noticeList.removeChild(thisNode);
    if(backstageAPI.deleteNotice(`id=${id}`)!=[]){
      backstagePopup.showPopup({
        text:"删除成功！"
      })
    }
  },
  submit:function(id){
    let thisNode = notice.getNoticeItem(id);
    let text = thisNode.getElementsByTagName('textarea')[0].value;
    let data = `id=${id}&text=${text}`;
    if(backstageAPI.updateNotice(data)!=[]){
      backstagePopup.showPopup({
        text:"提交成功！"
      })
    }
  },
  cancle:function(id){
    let thisNode = notice.getNoticeItem(id);
    thisNode.getElementsByClassName('notice-change')[0].classList.add('hidden');
  },
  add:function(){
    let noticeAdd = document.getElementsByClassName('notice-add')[0];
    let title = noticeAdd.getElementsByTagName('input')[0].value;
    let time = noticeAdd.getElementsByTagName('input')[1].value;
    let text = noticeAdd.getElementsByTagName('input')[2].value;
    if(title&&time&&text){
      if(backstageAPI.addNotice(`title=${title}&time=${time}&text=${text}`)){
        backstagePopup.showPopup({
          text:`新加公告成功！<br>TITLE:${title}<br>TIME:${time}<br>TEXT:${text}<br>`
        })
      }
    }else{
      backstagePopup.showPopup({
        text:"信息未填写完。"
      })
    }
  }
}
// 从数据库获取数据的API
const API_BASE_URL = 'http://saomdpb.com'
const backstageAPI = {
  updateNotice:(data)=>{
    return MPB.request({
      url: API_BASE_URL + '/notice/update',
      method:'post',
      data:data
    })
  },
  deleteNotice:(data)=>{
    return MPB.request({
      url: API_BASE_URL + '/notice/delete',
      data:data,
      method:'post'
    })
  },
  addNotice:(data)=>{
    return MPB.request({
      url: API_BASE_URL + '/notice/add',
      data:data,
      method:'post'
    })
  }
}