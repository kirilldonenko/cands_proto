<template>
  <v-container
    id="manage-entities"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Test Table"
      class="px-5 py-3"
    >
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalItems"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Desserts</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-btn
              color="primary"
              dark
              class="mb-2 ml-5"
              @click="setItems"
            >
              Upload datatable
            </v-btn>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Item
                </v-btn>
              </template>
              <form
                class="pa-4"
              >
                <template-field></template-field>
                <v-btn
                  color="red"
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
                  color="blue"
                  @click="addTemplateField"
                >
                   Добавить ещё поле
                </v-btn>
                <v-spacer />
                <v-row class="mt-10">
                  <v-btn
                    class="ml-4 mr-4"
                    @click="submit"
                  >
                    Отправить
                  </v-btn>
                </v-row>
<!--                <v-text-field-->
<!--                  v-model="nameField"-->
<!--                  :error-messages="nameFieldErrors"-->
<!--                  :counter="10"-->
<!--                  label="Название"-->
<!--                  class="col-4"-->
<!--                  required-->
<!--                  @input="$v.nameField.$touch()"-->
<!--                  @blur="$v.nameField.$touch()"-->
<!--                ></v-text-field>-->
<!--                <v-select-->
<!--                  v-model="selectTypesField"-->
<!--                  :items="arrayTypesField"-->
<!--                  :error-messages="selectTypesFieldErrors"-->
<!--                  label="Тип данных"-->
<!--                  class="col-4"-->
<!--                  required-->
<!--                  @change="$v.selectTypesField.$touch()"-->
<!--                  @blur="$v.selectTypesField.$touch()"-->
<!--                ></v-select>-->
<!--                <v-checkbox-->
<!--                  v-model="checkbox"-->
<!--                  :error-messages="checkboxErrors"-->
<!--                  label="Добавить связи"-->
<!--                  class="col-4"-->
<!--                  @change="$v.checkbox.$touch()"-->
<!--                  @blur="$v.checkbox.$touch()"-->
<!--                ></v-checkbox>-->
              </form>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="openDialog(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>
<script>
  import Vue from 'vue'
  import vuelidate from 'vuelidate'
  // import { validationMixin } from 'vuelidate'
  import { entities } from '@/store/modules'
  import { mapFields } from '@/js/update_form.js'
  import { required, maxLength } from 'vuelidate/lib/validators'
  import TemplateField from '@/dashboard/entities/TemplateField'
  Vue.use(vuelidate)
  export default {
    name: 'ManageEntities',
    components: {
      'template-field': TemplateField,
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
      checkboxBind: false,
      dialog: false,
      dialogDelete: false,
      options: {},
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
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
      ...entities.mapState(['error', 'loading']),
      ...entities.mapGetters(['items', 'totalItems']),
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
      curItem: {
        get () {
          return this.currentItem ? this.currentItem : this.defaultItem
        },
        set (item) {
          if (item) {
            return item
          } else {
            return this.defaultItem
          }
        },
      },
      ...mapFields({
        fields: ['name', 'calories', 'fat', 'carbs', 'protein'],
        base: 'item',
        mutation: 'updateItem',
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
    watch: {
      $route: {
        immediate: true,
        handler: 'getEntities',
      },
      dialog: {
        handler (value) {
          value || this.closeDialog()
        },
      },
      // error: {
      //   immediate: true,
      //   handler: 'reportError',
      // },
    },
    methods: {
      ...entities.mapActions([
        'getEntities',
        'setItems',
        'hideModalDel',
        'saveNewItem',
        'saveItem',
        'deleteItem',
        'closeDialog',
        'openDialog',
        'deleteItemConfirm',
        'openDialog',
      ]),
      submit () {
        this.$v.$touch()
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
<style>
.v-dialog.v-dialog--active {
  height: 500px;
  max-width: 1000px !important;
  background: #fff;
}
</style>
