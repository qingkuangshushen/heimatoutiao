<template>
  <!--  频道编辑 -->
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button size="mini" round type="danger" plain class="edit-btn"
        @click="isEdit = !isEdit"> {{ isEdit ? '完成': '编辑' }}
      </van-button>
    </van-cell>
    <!-- 宫格 -->
    <van-grid :gutter="10" class='my-grid'>
      <van-grid-item v-for="(channel,index) in myChannels" :key="index"
        class="grid-item" @click="onMyChannelClick(channel, index)">
        <van-icon slot="icon" name="clear"
          v-show="isEdit && !fiexdChannels.includes(channel.id)"></van-icon>
        <span slot="text" class="text"
          :class="{active: active === index}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 宫格 -->
    <van-grid :gutter="10" class='recommend-grid'>
      <van-grid-item v-for="(channel,index) in recommendChannels" :key="index"
        :text="channel.name" class="grid-item" icon='plus'
        @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addAllChannels, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  // 计算属性
  computed: {
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // const channels = []

        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })

        // return channels
      })
    },
    // 解构vuex的state值
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
* 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
*/
  created () { this.loadAllChannels() },
  /**
* el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
* 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
*/
  mounted () { },
  // 组件方法
  methods: {
    // 获取所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        console.log(this.allChannels)
      } catch (err) {
        console.log(err)
      }
    },
    // 添加我的频道
    async onAddChannel (ret) {
      this.myChannels.push(ret)
      // 判断是否在登录状态,判断本地存储里user是否有值
      if (this.user) {
        // 登陆状态
        try {
          await addAllChannels({ id: ret.id, seq: this.myChannels.length })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('保存数据失败')
        }
      } else {
        // 未登录状态
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 编辑频道
    // 点击我的频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1. 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }

        // 2. 删除频道项
        this.myChannels.splice(index, 1)

        // 3. 如果删除的激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引 - 1
          this.$emit('update-active', this.active - 1, true)
          // 4. 处理持久化 (添加这行代码)
        }
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    // 定义持续化删除方法
    async deleteChannel (channel) {
      console.log(123)
      if (this.user) {
        try {
          await deleteUserChannel(channel.id)
        } catch (err) {
          this.$toast('删除失败')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }

  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 85px;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 105px;
    height: 48px;
    font-size: 27px;
    color: #f85959;
    border: 1px solid #f85a5a;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
