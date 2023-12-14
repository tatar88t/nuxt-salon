<script setup>
import { useEmployeeStore } from "~/store/employee";

const employeeStore = useEmployeeStore();
const { fetchEmpList } = employeeStore;
const { empList } = storeToRefs(employeeStore);

onMounted(async () => {
  // await fetchEmpList();
  // console.log(empList.value, "empList-------------");
});

// const signUp = async () => {
//   await useFetch("/api/routes/assignation", {
//     method: "post",
//     body: {
//       name: "First Client",
//       phone: "1234-00-00",
//       date: new Date(),
//       service_code: 3,
//     },
//   });
// };
const getAssignations = async () => {
  const assignations = await useFetch("/api/assignation");
  console.log(assignations, "assignations");
};
</script>

<template>
  <div>
    <h1>Huets Home</h1>
    <button @click="getAssignations">test assign get</button>
  </div>
</template>

<style></style>
