<template>
  <i>
    <SvgIcon name="github" :cursor="'pointer'" @click="onClick" />
  </i>
</template>
<script setup lang="ts">
  import { GITHUB_REPO_URL } from '@/const';
  const onClick = () => {
    window.open(GITHUB_REPO_URL, '_blank');
  };
</script>
