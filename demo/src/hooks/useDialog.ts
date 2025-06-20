import Dialog from '@/components/Dialog.vue';
import { render, h } from 'vue';

export default function useDialog() {
  function createDialog(props: any): HTMLElement {
    const container = document.createElement('div');
    const vnode = h(Dialog, props);
    render(vnode, container);
    document.body.appendChild(container.firstElementChild!);
    console.log('create dialog');
    return container;
  }
  function clearDialog(container: HTMLElement) {
    render(null, container);
    container.remove();
    console.log('remove dialog');
  }
  return {
    createDialog,
    clearDialog,
  };
}
