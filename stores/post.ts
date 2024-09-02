// Store to manage posts
// getAllposts - returns all posts
// add - adds posts to posts array
// getPost - returns posts, based on provided from and to value
import { defineStore } from 'pinia'
import type { IPost } from '@/lib/interfaces';

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: <IPost[]>[],
  }),
  getters: {
    getAllPosts: (state) => state.posts,
  },
  actions: {
    add(posts: IPost[]) {
      this.posts = this.posts.concat(posts);
    },
    getPost(from: number, to: number) {
      return this.posts.slice(from, to);
    }
  }
})
