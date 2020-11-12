<template>
  <v-container
    id="manage-entities"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Main Table"
      class="px-5 py-3"
    >
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalItems"
        sort-by="notes"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Entities</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
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
              <v-row>
                <v-text-field
                  v-model="nameEntity"
                  :rules="[() => !!nameEntity || 'Обязательное поле']"
                  label="Name Entity"
                  class="ml-4 col-4"
                  required
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn
                  fab
                  dark
                  class="mr-4 mt-2"
                  color="blue"
                  @click="closeDialog"
                >
                  <v-icon dark>
                    mdi-close-box-outline
                  </v-icon>
                </v-btn>
              </v-row>
              <v-tabs
                fixed-tabs
                background-color="indigo"
                dark
              >
                <v-tab>
                  Fields
                </v-tab>
                <v-tab>
                  Tags
                </v-tab>
                <v-tab>
                  Actions
                </v-tab>
                <v-tab-item>
                  <template>
                    <edit-fields-form></edit-fields-form>
                  </template>
                </v-tab-item>
                <v-tab-item>
                  <template>
                    <relations-form
                      emit-name="edit-field-form"
                      @edit-field-form="relationsFormFields"
                    ></relations-form>
                  </template>
                </v-tab-item>
                <v-tab-item>
                  <template>
                    <h2>
                      Actions
                    </h2>
                  </template>
                </v-tab-item>
              </v-tabs>
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
  // import axios from 'axios'
  import EditFieldsForm from '@/dashboard/entities/EditFieldsForm'
  import RelationsForm from '@/dashboard/components/icands/RelationsForm'
  export default {
    name: 'ManageEntities',
    components: { RelationsForm, EditFieldsForm },
    data: () => ({
      nameEntity: '',
      objEntity: {
        fields: [],
        bind: '',
      },
      dialog: false,
      dialogDelete: false,
      options: {},
      headers: [
        {
          text: 'Name Entity',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Fields', value: 'fields' },
        { text: 'Notes', value: 'notes' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }),
    computed: {
      ...entities.mapState(['error', 'loading']),
      ...entities.mapGetters(['items', 'totalItems']),
      ...mapFields({
        fields: ['name', 'fields', 'notes'],
        base: 'item',
        mutation: 'updateItem',
      }),
    },
    watch: {
      $route: {
        immediate: true,
        handler: 'getEntities',
      },
      arraySelectedTags () {
        this.search = ''
      },
      // dialog: {
      //   handler (value) {
      //     value || this.closeDialog()
      //   },
      // },
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
        // 'closeDialog',
        'openDialog',
        'deleteItemConfirm',
        'openDialog',
      ]),
      closeDialog () {
        this.dialog = false
      },
      relationsFormFields (tags) {
        console.log(tags)
      },
    },
  }
</script>
<style>
.v-dialog.v-dialog--active {
  height: 600px;
  max-width: 1200px !important;
  background: #fff;
}
.v-tabs-slider {
  background-color: deeppink;
}
</style>
