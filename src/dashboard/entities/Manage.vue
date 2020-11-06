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
              <v-form v-model="valid">
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="firstname"
                        :rules="nameRules"
                        :counter="10"
                        label="First name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="lastname"
                        :rules="nameRules"
                        :counter="10"
                        label="Last name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
<!--              <v-card>-->
<!--                <v-card-title>-->
<!--                  <span class="headline">{{ formTitle }}</span>-->
<!--                </v-card-title>-->

<!--                <v-card-text>-->
<!--                  <v-container>-->
<!--                    <v-row>-->
<!--                      <v-col-->
<!--                        cols="12"-->
<!--                        sm="6"-->
<!--                      >-->
<!--                        <v-text-field-->
<!--                          v-model="curItem.name"-->
<!--                          label="Dessert name"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col-->
<!--                        cols="12"-->
<!--                        sm="6"-->
<!--                      >-->
<!--                        <v-text-field-->
<!--                          v-model="curItem.calories"-->
<!--                          label="Calories"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col-->
<!--                        cols="12"-->
<!--                        sm="6"-->
<!--                      >-->
<!--                        <v-text-field-->
<!--                          v-model="curItem.fat"-->
<!--                          label="Fat (g)"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col-->
<!--                        cols="12"-->
<!--                        sm="6"-->
<!--                      >-->
<!--                        <v-text-field-->
<!--                          v-model="curItem.carbs"-->
<!--                          label="Carbs (g)"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col-->
<!--                        cols="12"-->
<!--                        sm="6"-->
<!--                      >-->
<!--                        <v-text-field-->
<!--                          v-model="curItem.protein"-->
<!--                          label="Protein (g)"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->
<!--                    </v-row>-->
<!--                  </v-container>-->
<!--                </v-card-text>-->

<!--                <v-card-actions>-->
<!--                  <v-spacer></v-spacer>-->
<!--                  <v-btn-->
<!--                    color="blue darken-1"-->
<!--                    text-->
<!--                    @click="hideModalM(false)"-->
<!--                  >-->
<!--                    Cancel-->
<!--                  </v-btn>-->
<!--                  <v-btn-->
<!--                    color="blue darken-1"-->
<!--                    text-->
<!--                    @click="saveNewItem(curItem)"-->
<!--                  >-->
<!--                    Save-->
<!--                  </v-btn>-->
<!--                </v-card-actions>-->
<!--              </v-card>-->
            </v-dialog>
            <v-dialog
              v-model="dialogDelete"
              max-width="500px"
            >
              <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="hideModalDelM(false)"
                  >Cancel</v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="deleteItemConfirm"
                  >OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
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
  // import { email } from 'vee-validate'
  import { entities } from '@/store/modules'
  import { mapFields } from '@/js/update_form.js'
  export default {
    name: 'ManageEntities',
    data: () => ({
      valid: false,
      firstname: '',
      lastname: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
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
