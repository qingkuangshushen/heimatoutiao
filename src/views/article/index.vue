<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow @click-left="$router.back()"
      title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover"
            :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">
            {{article.pubdate | relativeTime}}</div>
          <FollowUser class="follow-btn" v-model="is_followed"
            :user-id="article.aut_id" />
          <!-- 相当于
            <follow-user class="follow-btn" :value="article.is_followed" @input="article.is_followed = $event"
                    :user-id="article.aut_id"></follow-user>
          -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content"
          ref="article-content">
        </div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list :list='Commentlist' :source='article.art_id'
          @onload-success='totalCommentCount=$event.total_count'
          @reply-click="onReplyClick">
        </comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            @click="isPostShow=true">写评论
          </van-button>
          <van-icon class="comment-icon" name="comment-o"
            :info="totalCommentCount" />
          <collect-article class="btn-item" v-model="article.is_collected"
            :articleId='articleId'>
          </collect-article>
          <like-article class="btn-item" v-model="article.attitude"
            :article-id="article.art_id" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target='article.art_id' @post-success="onPostSuccess">
          </comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复弹出层 -->
    <van-popup v-model="isreplyshow" position="bottom" style="height:100%">
      <comment-reply :comment='currentComment' @close='isreplyshow=false'
        v-if="isreplyshow">
      </comment-reply>
    </van-popup>
  </div>
</template>

<script>
// 导入文章样式
import '@/styles/markdown.css'
// 获取文章
import { getArticleById } from '@/api/article'
// 图片预览效果
import { ImagePreview } from 'vant'
// 关注用户与取消关注
import { addFollow, deleteFollow } from '@/api/user'
// 导入关注
import FollowUser from '@/components/follow-user'
// 导入文章收藏
import CollectArticle from '@/components/collect-article'
// 导入文章点赞
import LikeArticle from '@/components/like-article'
// 导入评论列表
import CommentList from './components/comment-list'
// 导入发布评论
import CommentPost from './components/comment-post'
// 导入评论回复
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 给所有的后代组件提供数据
  // 然后在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的属性
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      is_followed: false, // 关注与未关注
      followLoading: false,
      totalCommentCount: 0, // 评论数量
      isPostShow: false, // 评论弹出层
      Commentlist: [], // 评论列表
      isreplyshow: false, // 回复评论弹层
      currentComment: {}// 当前评论信息
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    // 获取文章详情
    async loadArticle () {
      // 展示 loading 加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // 随机错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsankljdnskaljndlkjsa')
        // }
        // console.log(data)
        this.article = data.data
        setTimeout(() => {
          this.previewImage()
        }, 0)
        console.log(this.previewImage())
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('抱歉请求出错', err)
      }
      // 无论成功还是失败都要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    // 图片预览
    // 关注与取消关注
    async onFollow () {
      this.followLoading = true
      try {
        if (this.is_followed) {
          // 没有关注，添加关注
          await addFollow(this.article.aut_id)
        } else {
          // 已关注，取消关注
          await deleteFollow(this.article.aut_id)
        }
        // 更新视图状态
        this.is_followed = !this.is_followed
      } catch (err) {
        console.log(err)
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
      this.followLoading = false
    },
    // 关闭评论弹出层
    onPostSuccess (data) {
      console.log('------')
      console.log(data)
      this.isPostShow = false
      this.Commentlist.unshift(data.new_obj)
    },
    // 评论回复事件
    onReplyClick (comment) {
      console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isreplyshow = true
    }
  },
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
