<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- form表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field name="mobile" placeholder="请输入手机号" v-model="user.mobile"
        clearable type="number" :rules='userFormRules.mobile' maxlength="11">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field name="yanzhengma" placeholder="请输入验证码" v-model='user.code'
        type="number" :rules='userFormRules.code' maxlength="6"><i
          slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time: 倒计时时间 -->
          <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s"
            @finish="isCountDownShow = false" />
          <!-- 新版本插槽的写法 -->
          <van-button v-else class="send-sms-btn" round size="small"
            type="default" @click="onSendSms" native-type="button">
            发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  // 组件名称
  name: 'login',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      user: {
        mobile: '13888888888',
        code: '246810'
      },
      // 表单校验规则
      userFormRules: {
        mobile: [{
          required: true, message: '请输入手机号不能为空'
        }, {
          pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      // 倒计时显示与隐藏
      isCountDownShow: false
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
    async onSubmit () {
      // 加载，转圈
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        const res = await login(this.user)
        this.$store.commit('setUser', res.data.data)
        console.log('登陆成功', res)
        this.$toast.success('登录成功')
        this.$router.push('/')
      } catch (err) {
        if (err.response.status === 400) {
          console.log('登录失败', err)
          this.$toast.fail('登录失败')
        } else {
          console.log('登录失败，请稍候重试', err)
          this.$toast.fail('登录失败，请稍候重试')
        }
      }
    },
    // 验证码
    async onSendSms () {
      console.log('onSendSms')
      // 1. 校验手机号
      try {
        // 这里为啥添加await，是因为validate返回一个Promise
        // 参数是van-field的name
        await this.$refs.loginForm.validate('mobile') // 调用validate手动校验
      } catch (err) {
        return console.log('验证失败', err)// 这个写法其实就是在执行完log，然后结束代码执行，后续代码不执行
      }
      this.isCountDownShow = true
      // 2. 验证通过，显示倒计时
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        console.log('获取验证码成功')
        // this.$toast.success('获取验证码成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          console.log('请求验证失败', err)
          this.$toast.fail('请求验证太频繁')
        } else {
          console.log('登录失败，请稍候重试', err)
          this.$toast.fail('登录失败，请稍候重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
