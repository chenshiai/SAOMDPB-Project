function backstageInit() {
  backstageAPI.getNotice().then(
    backstageAPI.getRole
  );
}
// 该页面的全局弹窗对象
var backstagePopup = new MPBpopup('.saopopup-container', {
  okFunc: () => { backstagePopup.hiddenPopup() },
  oneKey: true
})
// 插入 li的模板
const template = {
  // 公告li模板
  notice: (item) => {
    return `
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
  },
  // 角色li模板
  role: (item) => {
    return 'sss';
  }
}
// 模板选择后再插入
function setList(data) {
  // 如果是公告数据

  if (data[0] != undefined && data[0].text != null && data[0].time != null) {
    var noticeList = document.getElementsByClassName('notice-list')[0];
    for (let item of data) {
      noticeList.innerHTML += template.notice(item);
    }
    return
  }
  // 如果是角色数据
  if (data.data != undefined) {
    var roleList = document.getElementsByClassName('role-list')[0];
    let i = 0;
    for (let item of data.data) {
      if(i>9) break;
      roleList.innerHTML += template.role(item);
      i++;
    }
    return
  }
}

// 公告li上绑定的方法
const notice = {
  getNoticeItem: function (id) {
    return document.getElementById("notice" + id);
  },
  update: function (id) {
    let thisNode = notice.getNoticeItem(id);
    thisNode.getElementsByClassName('notice-change')[0].classList.remove('hidden');
  },
  delete: function (id) {
    backstagePopup.showPopup({
      text: "即将删除该条公告<br/>确认删除吗？",
      oneKey: false,
      okFunc: removeNode
    })
    function removeNode() {
      let thisNode = notice.getNoticeItem(id);
      let noticeList = document.getElementsByClassName('notice-list')[0];
      noticeList.removeChild(thisNode);
      backstageAPI.deleteNotice(`id=${id}`).then(() => {
        backstagePopup.showPopup({
          text: "删除成功！",
          oneKey: true,
          okFunc: () => { backstagePopup.hiddenPopup() }
        });
      }).catch(() => {
        backstagePopup.showPopup({
          text: "删除失败！",
          oneKey: true,
          okFunc: () => { backstagePopup.hiddenPopup() }
        });
      })
    }
  },
  submit: function (id) {
    let thisNode = notice.getNoticeItem(id);
    let text = thisNode.getElementsByTagName('textarea')[0].value;
    let data = `id=${id}&text=${text}`;
    backstageAPI.updateNotice(data).then(() => {
      backstagePopup.showPopup({
        text: "提交成功！"
      });
      notice.cancle(id);
      document.getElementsByClassName('notice-list')[0].innerHTML = '';
      addNotice();
    }).catch(() => {
      backstagePopup.showPopup({
        text: "提交失败！",
        oneKey: true,
        okFunc: () => { backstagePopup.hiddenPopup() }
      });
    })
  },
  cancle: function (id) {
    let thisNode = notice.getNoticeItem(id);
    thisNode.getElementsByClassName('notice-change')[0].classList.add('hidden');
  },
  add: function () {
    let noticeAdd = document.getElementsByClassName('notice-add')[0];
    let title = noticeAdd.getElementsByTagName('input')[0].value;
    let time = noticeAdd.getElementsByTagName('input')[1].value;
    let text = noticeAdd.getElementsByTagName('input')[2].value;
    if (title && time && text) {
      backstageAPI.addNotice(`title=${title}&time=${time}&text=${text}`).then(() => {
        backstagePopup.showPopup({
          text: `新加公告成功！<br>TITLE:${title}<br>TIME:${time}<br>TEXT:${text}<br>`
        });
        document.getElementsByClassName('notice-list')[0].innerHTML = '';
        addNotice();
      }).catch(() => {
        backstagePopup.showPopup({
          text: "添加失败！",
          oneKey: true,
          okFunc: () => { backstagePopup.hiddenPopup() }
        });
      })
    } else {
      backstagePopup.showPopup({
        text: "信息未填写完。"
      })
    }
  }
}
// 角色li上绑定的方法
const role = {
  getRoleItem: function (id) {
    return document.getElementById("role" + id);
  },
  add: function () {
    console.log("点击添加角色");
  }
}
// 发送固定请求的API
// const API_BASE_URL = 'http://saomdpb.com'
const API_BASE_URL = ''
const backstageAPI = {
  getNotice: () => {
    return MPB.request({
      url: '/notice/get',
      method: 'get',
      success: setList
    })
  },
  getRole: () => {
    return MPB.request({
      url: '/userfind',
      method: 'post',
      success: setList
    })
  },
  updateNotice: (data) => {
    return MPB.request({
      url: API_BASE_URL + '/notice/update',
      method: 'post',
      data: data
    })
  },
  deleteNotice: (data) => {
    return MPB.request({
      url: API_BASE_URL + '/notice/delete',
      data: data,
      method: 'post'
    })
  },
  addNotice: (data) => {
    return MPB.request({
      url: API_BASE_URL + '/notice/add',
      data: data,
      method: 'post'
    })
  }
}