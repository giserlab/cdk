<template>
  <div class="dialog" :style="dialogStyle">
    <div class="dialog-header">
      <span class="title">{{ props.title }}</span>
      <span class="close" name="close" :size="15" @click="onclose">✘</span>
    </div>
    <div class="dialog-body">
      <div class="dialog-conent" ref="content" :id="'dialog-content-' + props.title"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { defineComponent, h, render, ref, onMounted, onBeforeUnmount } from 'vue';

  const emits = defineEmits(['close']);
  const props = defineProps({
    title: {
      type: [String],
      default: () => '标题',
    },
    width: {
      type: [Number, String],
      default: () => '30vw',
    },
    height: {
      type: [Number, String],
      default: () => '40vw',
    },
    left: {
      type: [Number, String],
      default: () => '10vw',
    },
    right: {
      type: [Number, String],
      default: () => 0,
    },
    top: {
      type: [Number, String],
      default: () => '20vw',
    },
    bottom: {
      type: [Number, String],
      default: () => 0,
    },
    component: {
      type: Object,
      required: true,
    },
  });
  const content = ref(null);
  const dialogStyle = computed(() => {
    const style = {
      width: detectUnit(props.width),
      'min-height': detectUnit(props.height),
    };

    if (props.right === 0) {
      style.left = detectUnit(props.left);
    } else style.right = detectUnit(props.right);

    if (props.bottom === 0) {
      style.top = detectUnit(props.top);
    } else style.bottom = detectUnit(props.bottom);

    return style;
  });
  function detectUnit(val) {
    if (typeof props.width == 'string') {
      return val;
    } else return `${Number(val)}px`;
  }

  const renderComponent = () => {
    if (content.value) {
      content.value.innerHTML = '';
      const vnode = h(props.component, {});
      return render(vnode, content.value);
    }
  };

  function onCleanContent() {
    if (content.value) render(null, content.value);
  }
  function onclose() {
    emits('close');
    onCleanContent();
  }

  onMounted(() => {
    renderComponent();
  });

  onBeforeUnmount(() => {
    onCleanContent();
  });
</script>
<style scoped lang="scss">
  .dialog {
    position: fixed;
    padding: 0.5em;
    border-radius: 0.2em;
    z-index: 99;
    background-color: #fff;
    .dialog-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d4d3d36e;
      .title {
        font-size: 0.8em;
        font-weight: bolder;
      }
      .close {
        cursor: pointer;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
    .dialog-body {
      :deep(label) {
        font-size: 0.7em !important;
      }
    }
  }
</style>
