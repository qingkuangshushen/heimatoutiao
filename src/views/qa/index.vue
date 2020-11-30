<template>
  <div class="qa-container">
    <!-- <van-nav-bar title="标题">
      <div slot="title">
        <van-button type="default" round class="search-btn">
          <i slot="default" class="toutiao toutiao-sousuo"></i>搜索
        </van-button>
      </div>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable animated border type='line'>
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
    </van-tabs> -->
    qa
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'QaPage',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      active: 0
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
  methods: {}
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #3296fa;
}
.van-button {
  width: 555px;
  height: 64px;
  background-color: #5babfb;
  border: none;
  font-size: 28px;
  .toutiao {
    font-size: 32px;
    color: #fff;
    margin-right: 10px;
  }
}
/deep/ .van-nav-bar__title {
  max-width: none;
}
.van-button--default {
  color: #fff;
}
</style>
