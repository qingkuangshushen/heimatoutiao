<template>
  <div class="comment-post">
    <van-field class="post-field" v-model.trim="message" rows="2" autosize
      type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
    <van-button class='post-btn' @click="onPost" :disabled='!message.length'>发布
    </van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      required: true,
      type: [String, Number, Object]
    }
  },
  // 依赖注入接值
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onPost () {
      console.log(123)
      try {
        const { data } = await addComment({
          target: this.target.toString(),
          content: this.message,
          art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传此参数（如果只是评论文章，该参数为null）
        })
        console.log(data)
        // 文本框清空
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    background: #fff;
    &::before {
      display: none;
    }
  }
}
</style>
