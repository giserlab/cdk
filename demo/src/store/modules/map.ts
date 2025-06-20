import { defineStore } from 'pinia';
import pinia from '..';
export const useMapStore = defineStore('mapStore', {
  state: () => {
    return {
      activeAnalyse: '',
    };
  },

  getters: {
    getActiveAnalyse: state => state.activeAnalyse,
  },

  actions: {
    setActiveAnalyse(activeAnalyse: string) {
      if (this.activeAnalyse === activeAnalyse) {
        this.activeAnalyse = '';
        return;
      }
      this.activeAnalyse = activeAnalyse;
    },
  },
});

export default useMapStore(pinia);
