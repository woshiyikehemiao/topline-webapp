<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
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
        />
      </van-list>
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
    async onLoad () {
      let currentChannel = this.currentChannel
      // 1、 请求加载文章列表
      let { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      // 2、将获取到的文章列表添加到当前频道地articles属性中
      let results = data.data.results
      currentChannel.articles.push(...results)
      // 3、本次load数据加载完毕 将loading设置为false进行判断
      currentChannel.loading = false
      // 4、判断数据是否已经加载结束如果没有数据了 将finished设置为true
      if (data.data.pre_timestamp) {
        currentChannel.timestamp = data.data.pre_timestamp
      } else {
        currentChannel.finished = true
      }
    },
    // 获取频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.channels = data.data.channels
      data.data.channels.forEach(item => {
        item.articles = []
        item.loading = false
        item.finished = false
        item.timestamp = null
      })
      console.log(this.channels)
    }
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style>
</style>
