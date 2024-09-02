<script lang="ts">
  // This component handles popup
  // With a form to create posts
  // Displays a button
  // Upon clicking which
  // A popup with the form inside will be displayed
  // If a user succesfully submits a post
  // The popup will be closed after submission
  // Otherwise the alert will be displayed
  import { ref } from 'vue';

  import type { IPost } from '@/lib/interfaces';

  export default {
    setup() {
      const showPostPopup = ref<boolean>(false);
      const formData = ref(<IPost>{
        title: '',
        body: '',
        userId: null,
      });
      const submissionError = ref<string>('');

      function closePostPopup() {
        showPostPopup.value = false;
      };

      async function submitForm() {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(formData.value),
          });

          if (!response.ok) {
            throw new Error('Failed to send post');
          }

          const json = await response.json();

          closePostPopup();
        } catch (error) {
          submissionError.value = error.message;
        }
      };

      return {
        showPostPopup,
        formData,
        closePostPopup,
        submitForm,
        submissionError,
      };
    },
  }
</script>

<template>
  <div>
    <button @click="showPostPopup = true" class="border-purple-600 border-2 rounded px-2 py-1 tracking-wider">Post</button>
    <div v-if="showPostPopup" class="bg-black bg-opacity-20 w-screen min-h-screen absolute top-0 left-0 flex items-center justify-center" @click.self="closePostPopup">
      <div class="bg-white rounded-xl py-3 px-2" style="height: min-content;">
        <button @click="closePostPopup" class="text-[#F26430] w-8 h-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
        <form @submit.prevent="submitForm" class="flex flex-col gap-2">
          <div>
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="formData.title" required />
          </div>
          <div>
            <label for="body">Body:</label>
            <input type="text" id="body" v-model="formData.body" required />
          </div>
          <div>
            <label for="userId">UserId:</label>
            <input type="number" id="userId" v-model="formData.userId" required />
          </div>
          <button type="submit" class="mt-2 border-purple-600 border-2 rounded px-2 py-1 tracking-wider">Submit</button>
        </form>
      </div>
    </div>
    <AlertPopup v-if="submissionError.length > 0" :state="false" :msg="submissionError" />
  </div>
</template>
