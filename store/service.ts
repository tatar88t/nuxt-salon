//@ts-nocheck
import { defineStore } from "pinia";
export const useServiceStore = defineStore("service", {
  state: () => ({
    serviceList: [],
    selectedServices: null,
    // ...
  }),

  actions: {
    async fetchServiceList() {
      const response = await $fetch("/api/service");
      this.serviceList = response?.data;
    },

    setSelectedServices(selectedServices) {
      this.selectedServices = selectedServices;
    },
  },
});
