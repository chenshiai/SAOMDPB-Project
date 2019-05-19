
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
  },
  getRole: () => {
    return MPB.request({
      url: '/userfind',
      method: 'post',
      success: setList
    })
  },
}