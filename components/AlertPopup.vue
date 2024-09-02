<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';

  // Component that displays alert
  // If passed state is 1 - displays green alert
  // If passed state is 0 - displays red alert
  const props = defineProps<{
   state: boolean,
   msg?: string
  }>();

  const isVisible = ref<boolean>(true);

  // Hids the alert after 5 seconds
  onMounted(() => {
    setTimeout(() => {
      isVisible.value = false;
    }, 5000);
  });

  // Resets the visibility when the state changes
  watch(() => props.state, () => {
    isVisible.value = true;
    setTimeout(() => {
      isVisible.value = false;
    }, 5000);
  });
</script>

<template>
  <transition name="fade">
    <div v-if="isVisible" :class="['base', props.state ? 'good' : 'bad']">
      <p>{{ props.msg }}</p>
    </div>
  </transition>
</template>

<style scoped>
.base {
  z-index: 10;
  position: absolute;
  top: 2em;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 1em;
  border-radius: 10px;
  border-width: 4px;
}
.good {
  background-color: green;
  border-color: #064f06;
}
.bad {
  background-color: #F26430;
  border-color: #A4401B;
}
/* Fade in/out animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
