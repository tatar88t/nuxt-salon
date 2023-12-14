<template>
  <el-config-provider :locale="ru">
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <NuxtLink to="/">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/settings">Settings</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products">products</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/signup">signup</NuxtLink>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <slot></slot>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import ru from "element-plus/dist/locale/ru.mjs";
import dayjs from "dayjs";
dayjs.Ls.en.weekStart = 1;

import { useEmployeeStore } from "~/store/employee";
import { useServiceStore } from "~/store/service";

const employeeStore = useEmployeeStore();
const serviceStore = useServiceStore();
const { fetchEmpList } = employeeStore;
const { fetchServiceList } = serviceStore;

const { empList } = storeToRefs(employeeStore);

onMounted(() => {
  fetchEmpList();
  fetchServiceList();
  console.log(empList.value, "empList-------------");
});
</script>
