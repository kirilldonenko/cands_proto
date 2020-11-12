<template>
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
    <v-row>
      <v-card-actions>
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
    </v-row>
  </v-container>
</template>

<script>
  // import axios from 'axios'

  export default {
    name: 'RelationsForm',
    props: [
      'emitName',
    ],
    data: () => ({
      arrayBindTag: [],
      objEntity: {
        tags: [],
      },
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
    }),
    computed: {
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
    },
    methods: {
      addTags () {
        console.log('addTags')
        this.loadingTag = true
        // this.objEntity.tags = this.arraySelectedTags
        this.$emit(this.emitName, this.arraySelectedTags)
        // axios.post('http://localhost:8090/index.php', this.objEntity).then((response) => {
        //   this.loadingTag = false
        // }).catch(error => {
        //   console.log('error' + error)
        // })
        this.search = ''
        this.arraySelectedTags = []
      },
    },
  }
</script>

<style scoped>

</style>
