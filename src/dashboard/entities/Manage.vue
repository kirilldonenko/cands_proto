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
                id="form"
                class="pa-4"
              >
                <component
                  v-for="(comp, index) in arrayComponentsField"
                  :key="index"
                  :is="comp"
                />
                <v-spacer />
                <v-row class="mt-10">
                  <v-btn
                    color="blue"
                    class="ml-4 mr-4"
                    @click="addTemplateField"
                  >
                    Добавить ещё поле
                  </v-btn>
                </v-row>
                <v-container class="py-0">
                  <v-row>
                    <v-col
                      cols="6"
                    >
                      <v-text-field
                        ref="search"
                        v-model="search"
                        full-width
                        hide-details
                        label="Поиск"
                        single-line
                      ></v-text-field>
                      <v-list>
                        <template v-for="item in listExistBinds">
                          <v-list-item
                            v-if="!arraySelectedBind.includes(item)"
                            :key="item.text"
                            :disabled="loadingBind"
                            @click="arraySelectedBind.push(item)"
                          >
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-col>
                    <v-col
                      cols="6"
                      >
                      <v-col
                        cols="6"
                        v-for="(selection, i) in listSelectedBind"
                        :key="selection.text"
                        class="shrink"
                      >
                        <v-chip
                          :disabled="loadingBind"
                          close
                          @click:close="arraySelectedBind.splice(i, 1)"
                        >
                          {{ selection.text }}
                        </v-chip>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-container>

<!--                <v-divider v-if="!allSelected"></v-divider>-->
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="!arraySelectedBind.length"
                    :loading="loadingBind"
                    color="purple"
                    @click="addBind"
                  >
                    Добавить связи
                  </v-btn>
                </v-card-actions>
                <v-spacer />
                <v-row class="mt-10">
                  <v-btn
                    class="ml-4"
                    color="success"
                    @click="submit"
                  >
                    Отправить
                  </v-btn>
                </v-row>
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
  import { entities } from '@/store/modules'
  import { mapFields } from '@/js/update_form.js'
  import Field from '@/dashboard/entities/Field'
  export default {
    name: 'ManageEntities',
    components: {
      Field,
    },
    data: () => ({
      arrayComponentsField: [Field],
      arrayExistBinds: [
        {
          text: 'СКЮ',
        },
        {
          text: 'Регион',
        },
        {
          text: 'ТТ',
        },
        {
          text: 'Пользователь',
        },
      ],
      loadingBind: false,
      search: '',
      arraySelectedBind: [],
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
    computed: {
      ...entities.mapState(['error', 'loading']),
      ...entities.mapGetters(['items', 'totalItems']),
      allSelected () {
        return this.arraySelectedBind.length === this.arrayExistBinds.length
      },
      listExistBinds () {
        const search = this.search.toLowerCase()

        if (!search) return this.arrayExistBinds

        return this.arrayExistBinds.filter(item => {
          const text = item.text.toLowerCase()

          return text.indexOf(search) > -1
        })
      },
      listSelectedBind () {
        const listSelectedBind = []

        for (const selection of this.arraySelectedBind) {
          listSelectedBind.push(selection)
        }

        return listSelectedBind
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
      arraySelectedBind () {
        this.search = ''
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
      addTemplateField () {
        this.arrayComponentsField.push(Field)
        console.log(this.arrayComponentsField)
      },
      addBind () {
        this.loadingBind = true

        setTimeout(() => {
          this.search = ''
          this.arraySelectedBind = []
          this.loadingBind = false
        }, 2000)
      },
      submit () {
        const form = document.getElementById('form')
        const formData = new FormData(form)
        console.log(formData)
        // this.$v.$touch()
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
