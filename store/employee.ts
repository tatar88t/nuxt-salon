//@ts-nocheck
import { defineStore } from "pinia";
export const useEmployeeStore = defineStore("employeeStore", {
  state: () => ({
    empList: [],
    workShift: null,
    currentEmp: null,
    selectedWorkShift: null,
  }),

  actions: {
    async fetchEmpList() {
      const response = await $fetch("/api/employee");
      this.empList = response?.data;
    },

    async fetchWorkShift(emp_id) {
      const response = await $fetch("/api/employee/work-shift", {
        method: "get",
        body: { emp_id },
      });
      this.workShift = response?.data;
    },

    setCurrentEmp(emp) {
      this.currentEmp = emp;
    },

    setCurrentEmpById(emp_id) {
      const emp = this.empList.find((e) => e.emp_id === emp_id);
      this.setCurrentEmp(emp);
    },

    setSelectedWorkShift(work_shift) {
      this.selectedWorkShift = work_shift;
    },
  },
});
