<template>
  <v-container>
    <div
      v-for="(field, index) in fields"
      :key="index"
    >
      <v-row>
        <v-text-field
          v-model="field.nameField"
          label="Название"
          class="col-4"
          required
          :rules="[() => !!field.nameField || 'Обязательное поле']"
        />
        <v-select
          v-model="field.selectTypesField"
          :items="arrayTypesField"
          label="Тип данных"
          class="col-4"
          required
          :rules="[() => !!field.nameField || 'Обязательное поле']"
        />
        <v-btn
          class="ml-8 mr-4"
          fab
          dark
          color="grey"
          @click="clear(index)"
        >
          <v-icon dark>
            mdi-close
          </v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          color="red"
          @click="deleteField(index)"
        >
          <v-icon dark>
            mdi-delete
          </v-icon>
        </v-btn>
      </v-row>
    </div>
    <v-row class="mt-2">
      <v-btn
        class="ml-4 mr-4"
        fab
        dark
        color="indigo"
        @click="addTemplateField"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-row>
    <v-row
    class="mt-10 mb-3"
    >
      <v-select
        v-model="bindTag"
        :items="fields"
        item-text="nameField"
        item-value="nameField"
        label="Поле связей"
        class="col-4"
        required
        :rules="[() => !!bindTag || 'Обязательное поле']"
      ></v-select>
    </v-row>
    <v-row>
      <v-btn
        fab
        dark
        class="ml-4"
        color="success"
        @click="sendData"
      >
        <v-icon dark>
          mdi-send
        </v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import vuelidate from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  // import axios from 'axios'
  Vue.use(vuelidate)
  export default {
    name: 'EditFieldsForm',
    data: () => ({
      objEntity: {
        name: '',
        fieldsEntity: [],
      },
      fields: [],
      checkEmptyData: [],
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
      bindTag: null,
      arrayBindTag: [],
    }),
    validations: {
      nameField: { required },
      selectTypesField: { required },
      bindTag: { required },
    },
    computed: {
      // nameField () {
      //   $v.nameField.$touch()
      // },
      nameFieldErrors () {
        const errors = []
        if (!this.$v.nameField.$dirty) return errors
        !this.$v.nameField.required && errors.push('Обязательное поле')
        return errors
      },
      selectTypesFieldErrors () {
        const errors = []
        if (!this.$v.selectTypesField.$dirty) return errors
        !this.$v.selectTypesField.required && errors.push('Обязательное поле')
        return errors
      },
      selectBindTagErrors () {
        const errors = []
        if (!this.$v.bindTag.$dirty) return errors
        !this.$v.bindTag.required && errors.push('Обязательное поле')
        return errors
      },
    },
    methods: {
      addTemplateField () {
        this.fields.push({
          nameField: null,
          selectTypesField: null,
        })
      },
      deleteField (id) {
        this.arrayBindTag.splice(id, 1)
        this.fields.splice(id, 1)
        this.objEntity.fieldsEntity.splice(id, 1)
      },
      clear (id) {
        this.fields[id].nameField = null
        this.fields[id].selectTypesField = null
      },
      sendData (event) {
        this.checkEmptyData = this.fields.filter(field => field.nameField == null || field.selectTypesField == null)
        if (this.checkEmptyData.length >= 1) {
          return
        }
        this.objEntity.bind = this.bindTag
        event.preventDefault()
        event.stopPropagation()
        // axios.post('http://localhost:8090/index.php', this.objEntity).then((response) => {
        //   this.dialog = false
        // }).catch(error => {
        //   console.log('error' + error)
        // })
        this.fields = []
        console.log(this.objEntity)
      },
    },
  }
</script>

<style scoped>

</style>
