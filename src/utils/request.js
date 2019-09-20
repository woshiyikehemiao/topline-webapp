import axios from 'axios'
import Bigint from 'json-bigint'
import store from '@/store/index.js'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
request.defaults.transformResponse = [function (data) {
  try {
    // data数据可能不是标准地json格式字符串，会导致Json.parse(data)转换报错
    return Bigint.parse(data)
  } catch (err) {
    // 此时无法转换地数据直接原样返回
    return data
  }
}]
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // do something with request error
  return Promise.reject(error)
})
export default request
