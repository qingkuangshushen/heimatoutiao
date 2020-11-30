<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round
        icon="search" to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- tab栏 -->
    <van-tabs v-model="active" class="channel-tabs" animated swipeable>
      <van-tab :title="channel.name" v-for="channel in channels"
        :key="channel.id">
        <!-- 频道的文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡导航 -->
      <div slot="nav-right" class="hanbtn">
        <i class="toutiao toutiao-gengduo" @click="hanbtnclick"></i>
      </div>
    </van-tabs>
    <van-popup v-model="show" position="bottom" :style="{ height: '100%' }"
      closeable close-icon-position="top-left">
      <channel-edit :my-channels='channels' :active='active'
        @update-active='onUpdateActive' />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/article-list'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
// 频道编辑
import ChannelEdit from './component/channel-edit'
export default {
  // 组件名称
  name: 'homePage',
  // 局部注册的组件
  components: {
    ArticleList, ChannelEdit
  },
  // 组件参数 接收来自父组件的数据
  props: {

  },
  // 组件状态值
  data () {
    return {
      active: 0,
      channels: [],
      show: false
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
* 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
*/
  created () {
    // 3. 调用获取频道列表
    this.loadChannels()
  },
  /**
* el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
* 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
*/
  mounted () { },
  // 组件方法
  methods: {
    // 获取频道列表
    async loadChannels () {
      try {
        let channles = []
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (this.user || !localChannels) {
          // 登录 或者 本地没有存储 获取后端数据
          const { data } = await getUserChannels()
          this.channels = data.data.channels
          return false
        } else {
          // 未登录并且本地有数据
          channles = localChannels
        }
        this.channels = channles
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    hanbtnclick () {
      this.show = true
    },
    onUpdateActive (index, show = true) {
      this.active = index
      this.show = show
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /*添加上padding 撑开高度*/
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  /deep/ .channel-tabs {
    /* 其他省略 */
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      width: 100%;
    }
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background: #3296fa;
    }
  }
  .placeholder {
    width: 66px;
    height: 82px;
    flex-shrink: 0;
  }
  .hanbtn {
    position: fixed;
    right: 0;
    width: 66px;
    height: 82px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 58px;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
