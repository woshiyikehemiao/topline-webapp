<template>
  <div class="search">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchIndex"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <!-- 联想推荐词 -->
    <van-cell-group>
      <van-cell icon="search" :title="value" v-for="value in 4" :key="value"></van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <van-cell-group>
         <van-cell title="历史记录">
             <template>
                 <span>全部删除</span>
                 <span>完成</span>
             </template>
             <van-icon name="delete" slot="right-icon" style="line-height: inherit;" />
         </van-cell>
        <van-cell title="hello" v-for="value in 4" :key="value">
          <van-icon slot="right-icon" name="close" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'searchIndex',
  data () {
    return {
      searchIndex: ''
    }
  },
  methods: {
    //   搜索事件
    onSearch () {},
    //   点击取消事件
    onCancel () {}
  }
}
</script>

<style>
</style>
