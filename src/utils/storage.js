// 本地存储操作
// 设置本地存储数据
export const setStorage = (name, data) => {
  window.localStorage.setItem(name, JSON.stringify(data))
}
// 获取本地存储数据
export const getStorage = name => {
  return JSON.parse(window.localStorage.getItem(name))
}
// 清除本地存储数据
export const removeStorage = name => {
  window.localStorage.removeItem(name)
}
