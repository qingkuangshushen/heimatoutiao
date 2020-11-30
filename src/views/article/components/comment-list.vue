<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
    :error="error" error-text="加载失败，请点击重试" @load="onLoad"  :immediate-check="false">
    <comment-item v-for="(item, index) in list" :comment="item" :key="index"
      @reply-click="$emit('reply-click', $event)" />
  </van-list>
</template>

<script>
import CommentItem from './comment-item'
import { getComments } from '@/api/comment'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    // 被评论的对象（文章）id
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // 获取的评论列表
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 请求下一页数据的页码
      limit: 10, // 总数据条数
      error: false

    }
  },
  computed: {},
  watch: {},
  created () {
    // 页面一加载就获取评论数量
    this.onLoad()
  },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        this.$emit('onload-success', data.data)
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

        // 3. 将 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
