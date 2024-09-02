<script setup lang="ts">
// Component fetches, displays posts
// Saves to store
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from '@/stores/post';
import type { IPost } from '@/lib/interfaces';

const posts = ref<IPost[]>([]);
const page = ref<number>(1);
const postsPerPage = 10;
const loading = ref<boolean>(false);
const sortOrder = ref<'asc' | 'desc'>('asc');
const error = ref<string | null>(null);

const store = usePostStore();
const { add } = store;

async function fetchPosts(pageNumber: number){
  loading.value = true;
  error.value = null;
  try {
    const start = (pageNumber - 1) * postsPerPage;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${postsPerPage}&_start=${start}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    posts.value = data;
    page.value = pageNumber;

    loading.value = false;

    add(posts.value);
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false;
  }
};

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// Computed property to sort posts by ID based on the current sortOrder
const sortedPosts = () => {
  posts.value = [...posts.value].sort((a, b) => {
    return sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id;
  });
};

watch([sortOrder], sortedPosts);

// Fetch posts for the initial page
onMounted(() => {
  fetchPosts(page.value);
});
</script>

<template>
  <div>
    <div v-if="loading" class="absolute bg-white bg-opacity-80 w-screen min-h-screen top-0 left-0 flex items-center justify-center">Loading...</div>
    <div v-else>
      <button @click="toggleSortOrder" class="border-purple-600 border-2 rounded px-2 py-1 tracking-wider mt-2">
        Sort by ID ({{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }})
      </button>

      <div class="flex flex-col items-center gap-5 my-5 w-screen">
        <div v-for="post in posts" :key="post.id" class="w-1/2">
          <h2><b>{{ post.title }}</b></h2>
          <p>{{ post.body }}</p>
        </div>
      </div>

      <div class="flex gap-10 w-screen justify-center my-10">
        <button @click="fetchPosts(page - 1)" :disabled="page === 1" class="border-purple-600 border-2 rounded px-2 py-1 tracking-wider">Previous</button>
        <span>Page {{ page }}</span>
        <button @click="fetchPosts(page + 1)" :disabled="posts.length < postsPerPage" class="border-purple-600 border-2 rounded px-2 py-1 tracking-wider">Next</button>
      </div>
    </div>
    <AlertPopup v-if="error" :state="false" :msg="error" />
  </div>
</template>
