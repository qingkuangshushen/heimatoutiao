<template>
  <div class="update-gender">
    <!-- 选择器 -->
    <div class="update-gender">
      <van-picker title="性别" show-toolbar :columns="columns"
        :default-index="value" @cancel="$emit('close')" @change="onChange"
        @confirm="onConfirm" />
    </div>
    <!-- 选择器 -->

  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdateGender',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
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
    onChange (picker, value, index) {
      this.localGender = index
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
