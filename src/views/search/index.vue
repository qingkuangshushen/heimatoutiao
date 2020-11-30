<template>
  <div class="search-container">
    <!-- 搜索栏 > 事件监听 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form class="search-form" action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词"
        background="#3296fa" @search="onSearch" @cancel="onCancel"
        @focus='isResultShow = false' />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText='searchText' />
    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :searchText='searchText'
      @search='onSearch' />
    <!-- 搜索历史记录 -->
    <search-history v-else :searchHistories='searchHistories'
      @clearSearch='searchHistories=[]' @chanelhistory='onSearch' />

  </div>
</template>

<script>
// 引入组件
import { setItem, getItem } from '@/utils/storage'
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
export default {
  name: 'SearchIndex',
  data () {
    return {
      // 搜索关键词
      searchText: '',
      // 控制搜索结果的显示与否
      isResultShow: false,
      // 存储历史记录
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录数据
    }
  },

  created () {

  },

  methods: {
    onSearch (val) {
      // 更新文本框的内容
      this.searchText = val
      // 存储搜索历史记录
      // 要求:不要有重复历史记录出现，最新的历史记录在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () { // 点击取消出发事件
      this.$router.back()
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  watch: {
    searchHistories (value) {
      // 同步存储
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  }
}
</script>

<style scoped lang='less'>
.search-container {
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  padding-top: 108px;
}
</style>
