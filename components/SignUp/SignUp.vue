<script>
import { ref, reactive, computed } from "vue";
import { useEmployeeStore } from "~/store/employee";
import { useServiceStore } from "~/store/service";
import {
  getOnlyDateFromISODate,
  getOnlyTimeFromISODate,
} from "~/utils/dateTimeUtils";

export default {
  setup() {
    //STORES
    const employeeStore = useEmployeeStore();
    const serviceStore = useServiceStore();

    //ACTIONS
    const { setCurrentEmp, setCurrentEmpById, setSelectedWorkShift } =
      employeeStore;
    const { setSelectedServices } = serviceStore;
    //STORE_TO_REFS
    const { empList, currentEmp, selectedWorkShift } =
      storeToRefs(employeeStore);
    const { serviceList, selectedServices } = storeToRefs(serviceStore);

    const signUpFormInit = {
      client_name: null,
      phone: null,
      assign_date: null,
      assign_dt: null,
      services: null,
      emp_id: null,
    };
    const signUpForm = reactive({ ...signUpFormInit });
    const signUpFormRef = ref();
    // expose to template and other options API hooks
    const submitForm = async (formEl) => {
      console.log(formEl, "formEl");
      if (!formEl) return;

      formEl.validate(async (valid) => {
        console.log(valid, "valid");
        if (valid) {
          const work_shift_id = selectedWorkShift?.value?.work_shift_id;
          await useFetch("/api/assignation", {
            method: "post",
            body: { ...signUpForm, work_shift_id },
          });

          await resetForm(signUpFormRef.value);
        } else {
          return false;
        }
      });
    };

    const resetForm = async (formEl) => {
      console.log(formEl, "formEl");
      if (!formEl) return;
      Object.assign(signUpForm, { ...signUpFormInit });
    };

    const capitalize = (v, field, form) => {
      if (v?.length) {
        v = v[0].toUpperCase() + v.substring(1);
        form[field] = v;
      }
    };

    const handleServiceChange = (v) => {
      setSelectedServices(v);
    };

    const handleEmpChange = (emp_id) => {
      setCurrentEmpById(emp_id);
      console.log(emp_id, "emp_id MASTER....");
      console.log(currentEmp?.value, "currentEmp.value");
    };

    const filterEmpByAvailService = (empList, selectedServices) =>
      !selectedServices?.length
        ? []
        : empList.filter((item) =>
            item?.avail_services?.some((s_id) =>
              selectedServices.every((ss_id) => ss_id === s_id)
            )
          );

    const filteredEmpListByService = computed(() => {
      console.log(selectedServices?.value, "selectedServices?.value......");
      console.log(
        filterEmpByAvailService(empList?.value, selectedServices?.value),
        "filterEmpByAvailService(empList?.value, selectedServices?.value);"
      );
      return filterEmpByAvailService(empList?.value, selectedServices?.value);
    });

    const filterAvailDates = (d) => {
      console.log(d);
      const ws_list = currentEmp?.value?.work_shift;
      console.log(currentEmp?.value?.work_shift, "currentEmp.work_shift");

      const availDate = ws_list?.find((ws) => {
        const cd = new Date(d);
        // СТРАННАЯ ДИЧЬ хз почему так но иначе ( если не добавить этот previousDate) доступная дата сдвигается на день вперед
        const previousDate = new Date(cd.setDate(cd.getDate() + 1));
        console.log(previousDate, "previousDate.....");

        return (
          getOnlyDateFromISODate(ws?.start_dt) ===
          getOnlyDateFromISODate(previousDate.toISOString())
        );
      });

      console.log(availDate, !availDate, "availDate");

      return !availDate?.start_dt;
    };

    const availHoursList = ref([]);

    const handleDateChange = (d) => {
      console.log(d, "DDDDDDDDDDDD");

      const ws_list = currentEmp?.value?.work_shift;

      const ws = ws_list.find((w) => d === getOnlyDateFromISODate(w?.start_dt));

      console.log(ws, "WSSSSS---");

      setSelectedWorkShift(ws);

      const ws_date = getOnlyDateFromISODate(ws?.start_dt);
      const start_time = getOnlyTimeFromISODate(ws?.start_dt);
      const end_time = getOnlyTimeFromISODate(ws?.end_dt);

      const [start_hour, st_mm, st_ss] = start_time.split(":");
      const [end_hour, end_mm, end_ss] = end_time.split(":");

      const a_hours = [];

      let h = +start_hour;
      do {
        const time = h.toString().length === 1 ? `0${h}:00:00` : `${h}:00:00`;
        const availTime = `${ws_date}T${time}`;
        a_hours.push(availTime);
        h += 1;
      } while (h < +end_hour);

      availHoursList.value = a_hours;
      console.log(a_hours, "availHours");
      console.log(start_time, end_time, "start_time, end_time,");
    };

    return {
      signUpForm,
      signUpFormRef,

      //METHODS
      submitForm,
      resetForm,
      handleServiceChange,
      capitalize,
      handleEmpChange,
      filterAvailDates,
      handleDateChange,
      getOnlyTimeFromISODate,
      // --

      empList,
      serviceList,
      availHoursList,
      filteredEmpListByService,
    };
  },

  mounted() {
    console.log(this.count); // 0
  },
};
</script>

<template>
  <div>
    <h1>Запись</h1>
  </div>

  <div>
    <el-form
      ref="signUpFormRef"
      :model="signUpForm"
      :rules="rules"
      label-width="120px"
      class="signUpForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="Имя" prop="client_name">
        <el-input
          v-model="signUpForm.client_name"
          @input="(v) => capitalize(v, 'client_name', signUpForm)"
        />
      </el-form-item>

      <el-form-item label="Процедура" prop="services">
        <el-select
          v-model="signUpForm.services"
          placeholder="Процедура"
          multiple
          clearable
          @change="handleServiceChange"
        >
          <el-option
            v-for="item in serviceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Мастер" prop="emp_id">
        <el-select
          v-model="signUpForm.emp_id"
          placeholder="Мастер"
          @change="handleEmpChange"
          clearable
        >
          <el-option
            v-for="item in filteredEmpListByService"
            :key="item.emp_id"
            :label="`${item.surname} ${item.name} ${item.secondname}`"
            :value="item.emp_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Телефон">
        <el-input
          v-model="signUpForm.phone"
          v-maska
          data-maska="+7 (###) ###-##-##"
          placeholder="(___) ___-__-__"
        />
      </el-form-item>

      <el-form-item label="Дата и время" prop="assign_date">
        <el-date-picker
          v-model="signUpForm.assign_date"
          class="w-30"
          type="datetime"
          placeholder="Выберите дату"
          clearable
          format="DD.MM.YYYY"
          value-format="YYYY-MM-DD"
          :disabled-date="filterAvailDates"
          @change="handleDateChange"
        />
      </el-form-item>
      <div>
        <el-radio-group v-model="signUpForm.assign_dt" size="large">
          <el-radio-button
            v-for="item in availHoursList"
            :key="availHoursList"
            :label="`${signUpForm.assign_date}T${getOnlyTimeFromISODate(item)}`"
          >
            {{ getOnlyTimeFromISODate(item) }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="save-buttons">
        <el-button type="primary" @click="submitForm(signUpFormRef)"
          >Записаться</el-button
        >
        <el-button @click="resetForm(signUpFormRef)">Отменить</el-button>
      </div>
    </el-form>
  </div>
</template>

<style></style>
