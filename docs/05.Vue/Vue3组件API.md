---
title: Vue3组件API
date: 2022-04-27 16:32:46
permalink: /pages/2eaf4c/
categories:
  - Vue
tags:
  - Vue
---

用 Vue3 写一个简单组件，体验一下 Composition API， 这里不讨论原理和设计模式，只体验一下新语法糖的写法。

### 写法改变

**setup script**

Vue3 中 setup 代替了 beforeCreated 和 created 钩子，同时加入了 setup script

```html
<script lang="ts" setup>
  // 初始化代码
</script>
```

**对 TS 更友好**

### 实践

要实现的功能如下

![](https://qiniu.espe.work/blog/Apr-27-2022-16-38-19.gif)

分页数据请求 + 滚动到底部加载下一页

我们先实现滚动监听组件

```html
<!-- scroll-card.vue -->
<template>
  <div class="scroll-card">
    <div class="scroll-card-container" ref="scrollContainer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="footer" v-show="scrollTop > 0">
        <slot name="footer">
          <div class="footer-text">
            {{ isFulfill ? '没有更多数据了~' : '数据加载中' }}
            <span v-show="!isFulfill">
              <el-icon class="is-loading"><loading /></el-icon
            ></span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    defineProps,
    Ref,
    ref,
    onMounted,
    onUnmounted,
    withDefaults
  } from 'vue'
  import throttle from 'lodash/throttle'
  import { Loading } from '@element-plus/icons'

  // 初始化带默认值的props
  interface Props {
    isFulfill?: boolean // 调用层判断数据是否请求完毕
  }
  withDefaults(defineProps<Props>(), {
    isFulfill: false
  })

  let scrollTop: Ref<number> = ref(0) // 当前位置距离容器顶部的位置
  let scrollContainer: Ref = ref(null) // 当前位置距离容器顶部的位置

  // 添加滚动事件 onUnmounted中解绑事件
  onMounted(() => {
    document.addEventListener('scroll', fetchData, true)
  })
  onUnmounted(() => {
    // 组件销毁时取消监听
    document.removeEventListener('scroll', fetchData)
  })

  // 节流触发数据调用
  const fetchData = throttle(() => {
    loadMore()
  }, 800)

  // 初始化滚动到底部的事件
  const emit = defineEmits(['scrollToBottom'])
  function loadMore() {
    const customHeight = 160 // 高度补偿值
    let el = scrollContainer.value
    let scrollTopNum: number = el.scrollTop
    let height = el.offsetHeight
    let scrollHeight = el.scrollHeight
    if (
      scrollTopNum + customHeight + height > scrollHeight &&
      scrollTopNum > scrollTop.value
    ) {
      // 距离底部还剩200px了 请求下一段数据
      console.log(
        'trigger',
        scrollTopNum + customHeight + height - scrollHeight
      )
      emit('scrollToBottom') // 触发事件
    }
    scrollTop.value = scrollTopNum
  }
</script>

<style lang="scss" scoped>
  .scroll-card {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    &-container {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-flow: column;
      .body {
        flex: 1;
      }
      .footer {
        display: flex;
        justify-content: center;
        padding: 12px;
        height: 40px;
        opacity: 0.6;
      }
    }
  }
</style>
```

展示组件

```html
<!-- movie-list.vue -->
<template>
  <ScrollCard
    class="scroll-card"
    :isFulfill="isScrollToBottom"
    @scrollToBottom="onScrollToBottom"
  >
    <div class="movie">
      <transition-group name="movie-list" ref="movie">
        <div
          class="movie__item"
          :class="{ 'is-hover': hoverIndex === i }"
          v-for="(item, i) in list"
          :key="item._id"
          @click="onShowDetail(item)"
          @mouseenter="onHover(i)"
        >
          <div class="movie-poster">
            <img :src="getPosterUrl(item.name)" alt="" />
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </transition-group>
    </div>
  </ScrollCard>
  <el-drawer
    :size="400"
    :title="state.currentMovie.name"
    v-model="visible"
    @close="onClose"
  >
    <div style="margin-bottom: 24px">
      <img :src="getPosterUrl(state.currentMovie.name)" />
    </div>
    <p>豆瓣评分：{{ state.currentMovie.grade }}</p>
    <p>豆瓣250排名：{{ state.currentMovie.ranking }}</p>
    <p>{{ state.currentMovie.author }}</p>
    <p>简介：{{ state.currentMovie.introduction }}</p>
  </el-drawer>
</template>

<script lang="ts" setup>
  import {
    reactive,
    onMounted,
    ref,
    watch,
    Ref,
    onUnmounted,
    computed,
    ComputedRef
  } from 'vue'
  import { getMovieList, deleteMovie } from '@/api/movie'
  import ScrollCard from '@/components/scroll-card/index.vue'
  import { Pagination } from '@/type/global'
  import throttle from 'lodash/throttle'

  interface Movie {
    _id?: string
    name: string
    poster?: string
    ranking?: string
    grade?: string
    author?: string
    introduction?: string
  }

  interface State {
    currentMovie: Movie
    pagination: Pagination
  }

  const posterBaseUrl: string = 'https://qiniu.espe.work/douban-movie/'

  let list: Ref<Movie[]> = ref([]),
    hoverIndex: Ref = ref(0),
    getMovieListLoading: Ref<boolean> = ref(false),
    visible: Ref<boolean> = ref(false),
    state: State = reactive({
      currentMovie: { name: '' },
      pagination: {
        pageNum: 1,
        pageSize: 40,
        total: 0
      }
    })

  function getPosterUrl(name: string) {
    return `${posterBaseUrl}${encodeURIComponent(name)}.jpg`
  }

  function onHover(index: number) {
    hoverIndex.value = index
  }

  let isScrollToBottom: ComputedRef<boolean> = computed(() => {
    const page = state.pagination
    if (page.total === 0) return true
    return page.pageNum * page.pageSize >= page.total
  })

  function onScrollToBottom() {
    state.pagination.pageNum = state.pagination.pageNum + 1
    getList(true)
  }

  function getList(addTo: boolean = false) {
    getMovieListLoading.value = true
    getMovieList({ params: { ...state.pagination } })
      .then(({ data, code, message }: any) => {
        if (code === '000000') {
          if (addTo) {
            if (!data.list || data.list.length === 0) {
              // this.$message.warning('到底了')
            } else {
              list.value = [...list.value, ...(data.list || [])]
            }
          } else {
            list.value = data.list || []
          }
          state.pagination.total = data.total
        }
      })
      .finally(() => {
        console.log(list)
        getMovieListLoading.value = false
      })
  }

  getList()
  function onShowDetail(data: Movie) {
    console.log(data)
    state.currentMovie = data
    visible.value = true
  }
  function onClose() {
    visible.value = false
  }
</script>

<style lang="scss" scoped>
  .movie {
    display: flex;
    overflow: hidden;
    overflow-y: auto !important;
    flex-flow: row wrap;
    margin: 0 auto;
    max-width: 1500px;
    width: 100%;
    height: 100%;
    .movie__item {
      display: flex;
      overflow: hidden;
      flex-flow: column;
      justify-content: space-between;
      margin: 12px;
      width: 200px;
      height: 300px;
      cursor: pointer;
      .movie-poster {
        display: flex;
        overflow: hidden;
        align-items: center;
        flex: 1;
        flex-flow: column;
        justify-content: center;
        max-height: 260px;
        width: 100%;
        height: 100%;
        img {
          width: auto;
          height: auto;
          max-height: 100%;
        }
      }
      .name {
        width: 100%;
        height: 40px;
        text-align: center;
      }
    .movie-list-enter-active,
    .movie-list-leave-active {
      transition: all 0.5s ease;
    }
    .movie-list-enter-from,
    .movie-list-leave-to {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
</style>
```
