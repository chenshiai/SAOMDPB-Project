# SAOMDPB-Project 开发日志
- 2019/6/7：  
  摸了，开始学习egg和react了，现在的状态 koa、express，egg，vue，react 开始失去理智了，刀客塔。
- 2019/6/4：  
  Vue用起来比较生疏，妈耶~
- 2019/6/2：  
  下载页面启动！先将图片全部放到OSS上
- 2019/5/31：  
  MPB.ajax请求做了bug修复
- 2019/5/28：  
  嗯，MVVM的设计是真的舒服！后台的公告部分已经用Vue改写了。
- 2019/5/28：
  学习了Vue，用来写后台吼吼吼······
- 2019/5/23：  
  今天给MPB新增了分页器功能二分查找功能，为之后的下载区开发做好准备
- 2019/5/21:  
  封装了throw new Error(msg);
- 2019/5/16:  
  咸鱼了好久....今天修改了一下MPBC弹窗的bug，这个bug导致上一个弹窗的点击事件延续到了下一个弹窗，我的本意不是这样设计的emmmm。不过最后还是拯救回来了
- 2019/5/11:  
  MPB.js新增request 用Promise封装了ajax请求，可开始自定义API了哦吼吼！
  开始写后台了，不能再咕咕咕了。不然难受的是自己。写完后台让别人难受去啊哈哈哈。
- 2019/5/10:  
  调整了一些后端代码。
- 2019/5/9:  
  优化了一下MPB.js。 Taglazyload新增参数{function} complete，可选，全部加载完调用。新增Queue构造方法，用于创建一个队列。计时器队列对象构造方法停止更新。
- 2019/5/7:  
  更新了MPBC中popup组件的文字样式，MPB.js新增防抖专用构造函数。MPB.ScrollTrigger的使用方法修改。
- 2019/5/4:  
  优化了一下MPB和MPBC，昨晚解决了mysql的连接上限问题，但不是完美的解决方式....我才想起来今天过后就21岁了...要是没人提醒我，还真的会忘了。
- 2019/5/2：  
  js做后端一定要注意内存释放的问题呀，内存满了，直接挂掉。使用mysql要注意连接数的上限，及时释放连接。不过每次请求都会创建新的连接.......连接池还没搞懂。
- 2019/4/30：  
  给咸鱼一个角色跳转接口，因为后台处理不当，服务器崩了几次.....今天做好了一个弹窗组件，晚点再发上来。
- 2019/4/29：  
  完成了评论区功能，不得不说，nodeJs用起来比PHP简练多了，虽然PHP也很强，我还是比较喜欢JS。
- 2019/4/28：  
  角色数据请求完毕.....简直就是回调地狱.....Promise还不太会用，后端请求也有点吓人55555。
- 2019/4/27：  
  想想总得留下点什么吧，学了这么些东西，不记录下来真的会忘，文章又写不来....