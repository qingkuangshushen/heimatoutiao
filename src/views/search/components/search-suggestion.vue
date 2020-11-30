<template>
  <div class="search-suggestion">
    <van-cell v-for="(text,index) in suggestions" :key="index" icon="search"
      @click='$emit("search",text)'>
      <div slot="title" v-html="highlight (text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 监视的处理函数
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 1000),
      immediate: true
      // 该回调将会在侦听开始之后被立即调用
    }

  },
  created () { },
  mounted () { },
  methods: {
    // 发送请求，获取联想建议列表
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch {
        this.$toast('获取失败')
      }
    },
    // 设置搜索字体高亮
    highlight (text) {
      const hightext = `<span class='blue'>${this.searchText}</span>`
      // 正则表达式里面的表达式会被当做字符使用
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightext)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ .blue {
    color: #3296fa;
  }
}
</style>
