import request from '@/utils/request'
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}
export const getUserOrDefaultChannels = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
}
