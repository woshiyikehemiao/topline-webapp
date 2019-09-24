<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar fixed title="首页" />
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <!-- 面包按钮 -->
      <div slot="nav-right" class="nav-button">
        <van-icon name="wap-nav" size="24" @click="isChannelEditShow=true" />
      </div>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <van-pull-refresh v-model="channel.isLoading" @refresh="onRefresh">
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image lazy-load height="80" :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime}}</span>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 弹框设置 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      closeable
      close-icon="close"
      round
      :style="{ height: '95%' }"
    >
      <!-- 我的频道 -->
      <div class="mychannels">
        <van-cell title="我的频道">
          <van-button plain hairline type="info" round size="mini" @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="(channel,index) in channels" :key="channel.id" :text="channel.name" @click="onClickChannel(channel,index)">
            <van-icon name="close" slot="icon" v-show="isEdit"/>
          </van-grid-item>
        </van-grid>
      </div>
      <div>
        <van-cell title="频道推荐"></van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="channel in remainingChannels" :key="channel.id" :text="channel.name"
          @click="onAddUserChannels(channel)" />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUserOrDefaultChannels,
  getAllChannels,
  onAddChannels,
  deleteChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'homeIndex',
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    currentChannel () {
      // active 是当前标签的索引 可以用于获取动态的当前列表
      return this.channels[this.active]
    },
    // 获取剩余频道列表
    remainingChannels () {
      let channels = []
      this.allChannels.forEach(channel => {
        const index = this.channels.findIndex(item => item.id === channel.id)
        if (index === -1) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  methods: {
    // 切换或者删除我的频道
    async onClickChannel (channel, index) {
      if (this.isEdit) {
        this.channels.splice(index, 1)
        // 持久化
        if (this.user) {
          // 如果已登录
          await deleteChannels(channel.id)
        } else {
          // 如果没有登录
          setStorage('channels', this.channels)
        }
      } else {
        // 点击切换我的频道
        this.isChannelEditShow = false
        this.active = index
      }
    },
    // 新增我的频道
    async onAddUserChannels (channel) {
      let channels = []
      // 添加到我的频道
      this.channels.push(channel)
      // 如果已登录保存到后端
      if (this.user) {
        this.channels.slice(1).forEach((channel, index) => {
          channels.push({
            id: channel.id,
            req: index + 2
          })
        })
        await onAddChannels(channels)
      } else {
        // 如果没有登录保存到本地存储
        setStorage('channels', this.channels)
      }
    },
    // 上拉刷新
    async onRefresh () {
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      currentChannel.articles.unshift(...data.data.results)
      currentChannel.isLoading = false
      this.$toast('刷新成功')
    },
    async onLoad () {
      const currentChannel = this.currentChannel
      // 1、 请求加载文章列表
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      // 2、将获取到的文章列表添加到当前频道地articles属性中
      const { pre_timestamp: preTimestamp, results } = data.data
      currentChannel.articles.push(...results)
      // console.log(currentChannel.articles)
      // 3、本次load数据加载完毕 将loading设置为false进行判断
      currentChannel.loading = false
      // 4、判断数据是否已经加载结束如果没有数据了 将finished设置为true
      if (preTimestamp) {
        currentChannel.timestamp = preTimestamp
      } else {
        currentChannel.finished = true
      }
    },
    // 获取频道列表
    async loadUserOrDefaultChannels () {
      let channels = []
      if (this.user) {
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
      } else {
        if (getStorage('channels')) {
          channels = getStorage('channels')
        } else {
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }
      channels.forEach(item => {
        // Object.assign(item, this.extendData)
        let extendData = this.addExtendData()
        Object.assign(item, extendData)
        // item.articles = []
        // item.loading = false
        // item.finished = false
        // item.timestamp = null
        // item.isLoading = false
      })
      this.channels = channels
    },
    // 获取全部列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      const channels = data.data.channels
      channels.forEach(item => {
        let extendData = this.addExtendData()
        Object.assign(item, extendData)
      })
      this.allChannels = channels
    },
    addExtendData () {
      return {
        articles: [],
        loading: false,
        finished: false,
        timestamp: null,
        isLoading: false
      }
    }
  },
  created () {
    this.loadUserOrDefaultChannels()
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.home {
  .van-popup {
    .mychannels {
      margin-top: 35px;
      .van-icon{
        position: absolute;
        top: -3px;
        right: -3px;
      }
    }
  }
  .van-tabs {
    .nav-button {
      position: sticky;
      right: 0;
      display: flex;
      align-items: center;
      background-color: #fff;
      .van-icon {
        opacity: 0.8;
      }
    }
    /deep/ .van-tabs__content {
      margin-bottom: 50px;
      margin-top: 90px;
      .article-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .meta span {
          margin-right: 10px;
        }
      }
    }
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      left: 0;
      right: 0;
      z-index: 2;
    }
  }
}
</style>
