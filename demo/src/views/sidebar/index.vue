<template>
  <ElCollapse v-model="state.activeName">
    <ElCollapseItem v-for="item in collpases" :key="item.name" :name="item.name" :title="item.name">
      <ul>
        <li v-for="sub in item.subs" :key="sub.name">
          <ElCollapseItem v-if="sub.subs" :key="sub.name" :name="sub.name" :title="sub.name">
            <template #title>
              <div class="menu-item sub">
                <SvgIcon :name="sub.icon" />
                <span>{{ sub.name }}</span>
              </div>
            </template>
            <ul>
              <li v-for="subSub in sub.subs" :key="subSub.name" @click="onChange(subSub)">
                <div class="menu-item sub2">
                  <SvgIcon :name="subSub.icon" :size="15" />
                  <span :class="[activeAnalyse == subSub.name ? 'active' : '']">{{ subSub.name }}</span>
                </div>
              </li>
            </ul>
          </ElCollapseItem>
          <div v-else @click="onChange(sub)" class="menu-item">
            <SvgIcon :name="sub.icon" />
            <span :class="[activeAnalyse == sub.name ? 'active' : '']">{{ sub.name }}</span>
          </div>
        </li>
      </ul>
    </ElCollapseItem>
    <ElCollapseItem name="模型" title="图层资源">
      <Model />
    </ElCollapseItem>
  </ElCollapse>
</template>

<script setup lang="ts">
  import { MenuItem } from '@/types';
  import { ElCollapse, ElCollapseItem } from 'element-plus';
  import { computed, reactive } from 'vue';
  import mapStore from '@/store/modules/map';
  import useDialog from '@/hooks/useDialog';
  import Model from '@/components/Model.vue';
  import Aspect from '@/components/analysis/Aspect.vue';
  import Sight from '@/components/analysis/Sight.vue';
  import Contour from '@/components/analysis/Contour.vue';
  import Profile from '@/components/analysis/Profile.vue';
  import HeightRestriction from '@/components/analysis/HeightRestriction.vue';
  import Buffer from '@/components/analysis/Buffer.vue';
  import Isosurface from '@/components/analysis/Isosurface.vue';

  const collpases = [
    {
      name: '空间分析',
      subs: [
        {
          comp: Sight,
          name: '通视分析',
          icon: 'sight',
        },
        {
          comp: HeightRestriction,
          name: '控高分析',
          icon: 'height',
        },
        {
          comp: Buffer,
          name: '缓冲分析',
          icon: 'buffer',
        },
        {
          comp: Profile,
          name: '剖面分析',
          icon: 'profile',
          width: '20em',
          height: '15em',
        },
      ],
    },
    {
      name: '地形分析',
      subs: [
        {
          comp: Aspect,
          name: '坡向分析',
          icon: 'aspect',
        },

        {
          comp: Contour,
          name: '等高线分析',
          icon: 'contour',
        },
        {
          comp: Isosurface,
          name: '等值面分析',
          icon: 'isosurface',
        },
      ],
    },
  ];
  const state = reactive({
    activeName: collpases[0].name,
    subActiveName: '',
  });
  const activeAnalyse = computed(() => mapStore.getActiveAnalyse);

  const { createDialog, clearDialog } = useDialog();
  let dialogContainer: any = null;

  function dialogClose() {
    clearDialog(dialogContainer);
    dialogContainer = null;
  }
  function onChange(item: MenuItem) {
    if (dialogContainer != null) {
      dialogClose();
    }
    if (item.name == activeAnalyse.value) {
      mapStore.setActiveAnalyse('');
      return;
    }
    mapStore.setActiveAnalyse(item.name);
    dialogContainer = createDialog({
      title: item.name,
      component: item.comp,
      width: item.width || '18em',
      height: item.height || '8em',
      top: '8em',
      right: '1em',
      onClose: () => {
        dialogClose();
        mapStore.setActiveAnalyse('');
      },
    });
  }
</script>

<style scoped lang="scss">
  $a--color: rgb(65, 120, 230);
  ul {
    list-style: none;
    li {
      .menu-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 1em;
        cursor: pointer;

        &.sub {
          margin-left: 0.5em;
        }
        &.sub2 {
          font-size: 0.9em;
          margin-left: 1em;
        }
        &:hover {
          opacity: 0.7;
          span {
            color: $a--color;
          }
        }
      }

      margin: 1em 0em;
      span {
        &.active {
          color: $a--color !important;
        }
      }
    }
  }
</style>
