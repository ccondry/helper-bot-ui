<template>
  <panel title="Users">
    <div class="content">
      <b-table
      ref="helperBotTable"
      :data="users"
      :loading="isLoading"
      :narrowed="true"
      detailed
      detail-key="_id"
      :show-detail-icon="true"
      >
        <b-table-column
        v-slot="props"
        field="name"
        label="Name"
        >
          <a @click="$refs.helperBotTable.toggleDetails(props.row)">
            {{ props.row.personEmail }}
          </a>
        </b-table-column>

        <!-- expanded detail view -->
        <template slot="detail" slot-scope="props">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <helper-bot-card :model="props.row" />
              </div>
            </div>
          </article>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-sad" size="is-large" />
              </p>
              <p v-if="isLoading">
                Loading Helper Bots list...
              </p>
              <p v-else>
                No Helper Bots found
              </p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import HelperBotCard from '../components/helper-bot-card'

export default {
  components: {
    HelperBotCard
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'isLoggedIn',
      'loading',
      'working'
    ]),
    isLoading () {
      return false
    }
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        this.getUsers()
      }
    }
  },

  mounted () {
    if (this.isLoggedIn) {
      this.getUsers()
    }
  },

  methods: {
    ...mapActions([
      'getUsers'
    ])
  }
}
</script>
