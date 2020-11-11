<template>
  <v-container>
    <v-row>
      {{ fieldId }} . <v-text-field
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
    </v-row>
    <v-spacer />
    <v-row
    class="mb-5"
    >
      <v-btn
        class="ml-8 mr-4"
        fab
        dark
        color="grey"
        @click="clear"
      >
        <v-icon dark>
          mdi-close
        </v-icon>
      </v-btn>
      <v-btn
        class="mr-4"
        fab
        dark
        color="success"
        @click="saveField(fieldId, nameField, selectTypesField)"
      >
        <v-icon dark>
          mdi-content-save-outline
        </v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        color="red"
        @click="deleteField(fieldId)"
      >
        <v-icon dark>
          mdi-delete
        </v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import vuelidate from 'vuelidate'
  import { required, maxLength } from 'vuelidate/lib/validators'
  Vue.use(vuelidate)

  export default {
    name: 'Field',
    props: {
      fieldId: Number,
    },
    data: () => ({
      nameField: '',
      selectTypesField: null,
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
      saveField (id, name, select) {
        console.log('item-')
        console.log(id, name, select)
        this.$emit('save-or-delete', 'save', id, name, select)
      },
      deleteField (id) {
        console.log('child deleteField', id)
        this.$el.parentNode.removeChild(this.$el)
        this.$emit('save-or-delete', 'delete', id, '', '')
        this.$destroy()
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

</style>
