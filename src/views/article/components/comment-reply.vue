<template>
  <div class="comment-reply">
    <!--  导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item :comment='comment'></comment-item>
    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <comment-list :source="comment.com_id" type="c" :list="commentList" />
    <!-- /评论的回复列表 -->

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round
        @click='isPostShow = true'>写评论</van-button>
    </div>

    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- 发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  components: { CommentItem, CommentList, CommentPost },
  props: {
    comment: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onPostSuccess (data) {
      console.log(123, data)

      // 更新回复的数量
      this.comment.reply_count++

      // 关闭弹层
      this.isPostShow = false

      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped>
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
}
.post-btn {
  width: 60%;
}
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
</style>
