import request from '@/utils/request'

// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

// 获取用户频道或默认推荐频道
export const getUserOrDefaultChannels = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
}

// 增加频道（重置频道）
export const onAddChannels = (channels) => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'put',
    data: {
      channels
    }

  })
}

// 删除频道
export const deleteChannels = id => {
  return request({
    url: `/app/v1_0/user/channels/${id}`,
    method: 'delete'
  })
}
