import axios from 'axios'
import Bigint from 'json-bigint'
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
export default request
