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
                  :field-id="index"
                  @save-or-delete="updateField"
                />
                <v-spacer />
                <v-row class="mt-10">
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
                        <template v-for="item in listExistTags">
                          <v-list-item
                            v-if="!arraySelectedTags.includes(item)"
                            :key="item.text"
                            :disabled="loadingTag"
                            @click="arraySelectedTags.push(item)"
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
                        v-for="(selection, i) in listSelectedTag"
                        :key="selection.text"
                        class="shrink"
                      >
                        <v-chip
                          :disabled="loadingTag"
                          close
                          @click:close="arraySelectedTags.splice(i, 1)"
                        >
                          {{ selection.text }}
                        </v-chip>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    fab
                    dark
                    :loading="loadingTag"
                    color="grey"
                    @click="replyTags"
                  >
                    <v-icon dark>
                      mdi-reply-outline
                    </v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    dark
                    :disabled="!arraySelectedTags.length"
                    :loading="loadingTag"
                    color="purple"
                    @click="addTags"
                  >
                    <v-icon dark>
                      mdi-link-variant
                    </v-icon>
                  </v-btn>
                </v-card-actions>
                <v-spacer />
                <v-row class="mt-10">
<!--                  <select v-model="selected">-->
<!--                    <option v-for="option in options" v-bind:value="option.value">-->
<!--                      {{ option.text }}-->
<!--                    </option>-->
<!--                  </select>-->
                  <v-select
                    v-model="bindTag"
                    :items="arrayBindTag"
                    :error-messages="selectBindTagErrors"
                    label="Поле связей"
                    class="col-4"
                    required
                    @change="$v.bindTag.$touch()"
                    @blur="$v.bindTag.$touch()"
                  ></v-select>
                </v-row>
                <v-row class="mt-10">
                  <v-btn
                    fab
                    dark
                    class="ml-4"
                    color="success"
                    @click="submit"
                  >
                    <v-icon dark>
                      mdi-send
                    </v-icon>
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
  import { required } from 'vuelidate/lib/validators'
  export default {
    name: 'ManageEntities',
    components: {
      Field,
    },
    data: () => ({
      arrayBindTag: [],
      bindTag: null,
      objEntity: {
        fields: [],
        tags: [],
        bind: '',
      },
      arrayComponentsField: [Field],
      arrayExistTags: [
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
      loadingTag: false,
      search: '',
      arraySelectedTags: [],
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
      bindTag: { required },
    },
    computed: {
      ...entities.mapState(['error', 'loading']),
      ...entities.mapGetters(['items', 'totalItems']),
      selectBindTagErrors () {
        const errors = []
        if (!this.$v.bindTag.$dirty) return errors
        !this.$v.bindTag.required && errors.push('Обязательное поле')
        return errors
      },
      allSelected () {
        return this.arraySelectedTags.length === this.arrayExistTags.length
      },
      listExistTags () {
        const search = this.search.toLowerCase()

        if (!search) return this.arrayExistTags

        return this.arrayExistTags.filter(item => {
          const text = item.text.toLowerCase()

          return text.indexOf(search) > -1
        })
      },
      listSelectedTag () {
        const listSelectedTag = []

        for (const selection of this.arraySelectedTags) {
          listSelectedTag.push(selection)
        }

        return listSelectedTag
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
      arraySelectedTags () {
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
      updateField (check, id, name, select) {
        if (check === 'save') {
          this.arrayBindTag.push(name)
          this.objEntity.fields.push({ nameField: name, typeField: select })
        } else {
          this.objEntity.fields.splice(id, 1)
        }
        console.log(this.objEntity)
      },
      replyTags () {
        this.objEntity.tags = []
        this.arraySelectedTags = []
        console.log('replyTags')
        console.log(this.objEntity)
      },
      addTags () {
        this.loadingTag = true

        setTimeout(() => {
          this.objEntity.tags = this.arraySelectedTags
          console.log('addTags')
          console.log(this.objEntity)
          this.search = ''
          this.arraySelectedTags = []
          this.loadingTag = false
        }, 2000)
      },
      submit () {
        this.objEntity.bind = this.bindTag
        console.log(this.objEntity.bind)
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
