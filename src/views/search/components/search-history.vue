<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clearSearch')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow=true" />
    </van-cell>
    <van-cell v-for="(item,index) in searchHistories" :key="index" :title="item"
      @click="onSearchItemClick(item,index)">
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      // 定义当前是否是删除状态
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 单项删除
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.$emit('chanelhistory', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
