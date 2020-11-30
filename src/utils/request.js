/**
 * 封装 axios 请求模块
 * *用于设置请求根路径、请求拦截器
 */
import axios from 'axios'
import store from '@/store'

import JSONBig from 'json-bigint'

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/', // 接口基础路径
  // 临时地址
  baseURL: 'http://toutiao-app.itheima.net',
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器，请求设置token
request.interceptors.request.use(function (config) {
  // 把/api去掉
  if (config.url.startsWith('/app')) {
    // 只要以/app开始，则把前四个字符去掉
    config.url = config.url.slice(4)
  }
  // Do something before request is sent
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
export default request
