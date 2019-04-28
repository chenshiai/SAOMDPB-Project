# MPB.js
>MPB是我自己写的一些API，主要用于实现这个项目里的一些功能。目前功能还不多，暂时先放在在这里。
- Object:  
如果多次调用重复的东西，对性能还是会有点影响的！所以，当第一次调用的时候创建一个实例存在这里。之后再次调用就直接用实例啦！
```
  {
    xhr: null,
    ajax: null,
    scrollTop: 0
  }
```
- XMLHttpRequest:  
发送请求都需要用到的句柄生成方法，使用后可以获得一个XMLHttpRequest对象，并且该对象会被存储在当前页的Object.xhr中。  
像这样使用就可以给你一个XMLHttpRequest对象，已经兼容。  
`var xhr = MPB.XMLHttpRequest()`