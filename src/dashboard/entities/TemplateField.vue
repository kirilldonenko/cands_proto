<template>
  <v-row>
    <v-text-field
      v-model="nameField"
      :error-messages="nameFieldErrors"
      :counter="10"
      label="Название"
      class="col-4"
      required
      @input="$v.nameField.$touch()"
      @blur="$v.nameField.$touch()"
    ></v-text-field>
    <v-select
      v-model="selectTypesField"
      :items="arrayTypesField"
      :error-messages="selectTypesFieldErrors"
      label="Тип данных"
      class="col-4"
      required
      @change="$v.selectTypesField.$touch()"
      @blur="$v.selectTypesField.$touch()"
    ></v-select>
    <v-checkbox
      v-model="checkboxBind"
      :error-messages="checkboxBindErrors"
      label="Добавить связи"
      class="col-4"
      @change="$v.checkboxBind.$touch()"
      @blur="$v.checkboxBind.$touch()"
    ></v-checkbox>
  </v-row>
</template>

<script>
  export default {
    name: 'TemplateField',
  }
</script>

<style scoped>

</style>
