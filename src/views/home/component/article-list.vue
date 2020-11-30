<template>
  <div class="article-list">
    <!-- 文章列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
      :success-duration="1500" :success-text="refreshSuccessText">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
        @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
        <article-item v-for="(article,index) in list" :key="index"
          :article='article'></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  // 组件名称
  name: 'ArticleList',
  // 局部注册的组件
  components: {
    ArticleItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null, // 请求下一页数据的时间戳,
      error: false,
      refreshing: false,
      refreshSuccessText: ''
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () { },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    // 初始化或数据加载完毕或数据不够铺满整屏的时候会触发
    async onLoad () {
      // console.log(this.channel.id)
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 随机数错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 设置loading状态
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.loading = false
        this.error = true
      }
    },
    // 下拉刷新获取数据
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        console.log(data)
        const { results } = data.data
        console.log(results)
        // 2. 将数据追加到列表的顶部
        this.list.unshift(...results)
        // 3. 关闭下拉刷新的 loading 状态
        this.refreshing = false
        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshing = false // 关闭下拉刷新的 loading 状态
        this.$toast('刷新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
