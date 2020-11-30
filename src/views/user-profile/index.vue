<template>
  <div class="user-profile">
    <input type="file" hidden ref="photo" @change="onchange">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow
      @click-left="$router.back()" />
    <!-- /导航栏 -->
    <van-cell title="头像" is-link @click="$refs.photo.click()"
      class="photo-cell">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link
      @click="updatanameshow=true" />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link
      @click="isUpdateGenderShow=true" />
    <van-cell title="生日" :value="user.birthday" is-link
      @click="isUpdatebirthdayShow = true" />
    <!-- 编辑昵称弹出层 -->
    <van-popup v-model="updatanameshow" position="bottom"
      :style="{ height: '100%' }">
      <!-- 插入组件 -->
      <update-name v-if="updatanameshow" @close='updatanameshow=false'
        v-model="user.name" />
    </van-popup>
    <!-- 编辑昵称弹出层 -->
    <!-- 编辑性别弹出层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <!-- 插入组件 -->
      <update-gender v-if="isUpdateGenderShow" @close='isUpdateGenderShow=false'
        v-model="user.gender" />
    </van-popup>
    <!-- 编辑性别弹出层 -->
    <!-- 编辑生日弹出层 -->
    <van-popup v-model="isUpdatebirthdayShow" position="bottom">
      <update-birthday v-if="isUpdatebirthdayShow" @close='is'
        v-model="user.birthday">
      </update-birthday>
    </van-popup>
    <!-- 编辑生日弹出层 -->
    <!-- 编辑头像弹层 -->
    <van-popup v-model="isUpdatePhotoShow" style="height: 100%"
      position="bottom">
      <update-photo v-if="isUpdatePhotoShow" :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event" />
    </van-popup>
    <!-- 编辑头像弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  // 组件名称
  name: 'UserProfile',
  // 局部注册的组件
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      user: {}, // 用户信息
      updatanameshow: false,
      isUpdateGenderShow: false,
      isUpdatebirthdayShow: false,
      isUpdatePhotoShow: false,
      img: ''
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () { },
  // 组件方法
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
        console.log(this.user)
      } catch (err) {
        console.log(err)
      }
    },
    is () {
      this.isUpdatebirthdayShow = false
    },
    onchange () {
      // 获取文件对象
      const file = this.$refs.photo.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      // 解决每次选择同一图片不触发change事件
      this.$refs.photo.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background: #f5f7f9;
  }
  .photo-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
