<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar title="设置昵称" left-text="取消" right-text="确定"
      @click-left="$emit('close')" @click-right="onConfirm" />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field v-model.trim="message" rows="2" autosize type="textarea"
        maxlength="7" placeholder="请输入新昵称" show-word-limit />
    </div>
    <!-- 输入框 -->

  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdateName',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      required: true,
      type: String
    }
  },
  // 组件状态值
  data () {
    return {
      message: this.value
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  created () { },
  mounted () { },
  // 组件方法
  methods: {
    // 更改用户昵称
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const updataname = this.message
        if (updataname.length === 0) {
          this.$toast('用户昵称不能为空')
          return
        }
        await updateUserProfile({
          name: updataname
        })
        // 更新视图
        this.$emit('input', updataname)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        if (err.response && err.response.status === 409) {
          return this.$toast.fail('用户名已存在')
        }
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
