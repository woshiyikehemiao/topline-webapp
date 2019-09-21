<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar fixed title="首页" />
    <!-- 频道列表 -->
    <van-tabs v-model="active">
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
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'homeIndex',
  data () {
    return {
      active: 0,
      channels: []
    }
  },
  computed: {
    currentChannel () {
      // active 是当前标签的索引 可以用于获取动态的当前列表
      return this.channels[this.active]
    }
  },
  methods: {
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
      console.log(currentChannel.articles)
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
    async loadAllChannels () {
      const { data } = await getAllChannels()
      data.data.channels.forEach(item => {
        item.articles = []
        item.loading = false
        item.finished = false
        item.timestamp = null
        item.isLoading = false
      })
      this.channels = data.data.channels
      // console.log(this.channels)
    }
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.home {
  .van-tabs {
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
     /deep/ .van-tabs__wrap{
        position: fixed;
        top: 46px;
        left: 0;
        right: 0;
        z-index: 2;
      }
  }
}
</style>
