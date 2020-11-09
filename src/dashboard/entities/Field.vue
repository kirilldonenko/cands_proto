<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="nameField"
        :error-messages="nameFieldErrors"
        :counter="20"
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
        label="Добавить связи"
        class="col-4"
        @change="$v.checkboxBind.$touch()"
        @blur="$v.checkboxBind.$touch()"
      ></v-checkbox>
    </v-row>
    <v-spacer />
    <v-row
    class="mb-5"
    >
      <v-btn
        class="ml-8 mr-4"
        color="grey"
        @click="clear"
      >
        Очистить
      </v-btn>
      <v-btn
        color="primary"
        class="mr-4"
        @click="saveNewField"
      >
        Сохранить
      </v-btn>
      <v-btn
        color="red"
        @click="deleteField"
      >
        Удалить
      </v-btn>
    </v-row>
    <v-divider />
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import vuelidate from 'vuelidate'
  import { required, maxLength } from 'vuelidate/lib/validators'
  Vue.use(vuelidate)

  export default {
    name: 'Field',
    data: () => ({
      nameField: '',
      selectTypesField: null,
      checkboxBind: false,
      arrayTypesField: [
        'ID',
        'Текст',
        'Число',
        'Да/Нет',
        'Фото',
        'Локация',
        'Видео',
        'Аудио',
      ],
    }),
    validations: {
      nameField: { required, maxLength: maxLength(20) },
      selectTypesField: { required },
      checkboxBind: {
        checked (val) {
          return val
        },
      },
    },
    computed: {
      selectTypesFieldErrors () {
        const errors = []
        if (!this.$v.selectTypesField.$dirty) return errors
        !this.$v.selectTypesField.required && errors.push('Обязательное поле')
        return errors
      },
      nameFieldErrors () {
        const errors = []
        if (!this.$v.nameField.$dirty) return errors
        !this.$v.nameField.maxLength && errors.push('Название должно быть не более 20 символов')
        !this.$v.nameField.required && errors.push('Обязательное поле')
        return errors
      },
    },
    methods: {
      saveNewField () {
        console.log('saveNewField')
      },
      deleteField () {
        console.log('deleteField')
        this.$destroy()
        this.$el.parentNode.removeChild(this.$el)
      },
      clear () {
        this.$v.$reset()
        this.nameField = ''
        this.selectTypesField = null
        this.checkboxBind = false
      },
    },
  }
</script>

<style scoped>
  .theme--light.v-divider {
    border-color: #000 !important;
  }
</style>
