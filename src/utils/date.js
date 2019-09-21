// import dayjs from 'dayjs'
// import 'dayjs/locale/zh-cn'
// import rTime from 'dayjs/plugin/relativeTime'
// dayjs.locale('zh-cn')
// dayjs.extend(rTime)
// export const relativeTime = time => {
//   return dayjs().from(dayjs(time))
// }
import dayjs from 'dayjs'// 导入dayjs
import rTime from 'dayjs/plugin/relativeTime'// 导入相对时间
import 'dayjs/locale/zh-cn'// 按需导入
dayjs.locale('zh-cn')// 注册语言
dayjs.extend(rTime)// 注册相对时间
export const relativeTime = time => {
  return dayjs().to(dayjs(time))
}
