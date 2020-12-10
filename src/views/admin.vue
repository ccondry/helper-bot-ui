<template>
  <panel title="Manage Bot Users and Rooms">
    <div class="content">
      <!-- loading/working spinner -->
      <div v-if="isLoading || isWorking" style="width: 24rem; height: 8rem;">
        <b-loading :active="true" :is-full-page="false" />
      </div>

      <!-- bots table -->
      <b-table
      v-if="!isLoading && !isWorking"
      ref="helperBotTable"
      :data="users"
      :narrowed="true"
      detailed
      detail-key="_id"
      :show-detail-icon="true"
      >
        <b-table-column
        v-slot="props"
        field="displayName"
        label="Name"
        >
          <a @click="$refs.helperBotTable.toggleDetails(props.row)">
            {{ props.row.displayName }}
          </a>
        </b-table-column>

        <b-table-column
        v-slot="props"
        field="personEmail"
        label="Email"
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
                No Helper Bots found
              </p>
            </div>
          </section>
        </template>
      </b-table>
      
      <div
      class="buttons"
      style="display: flex; justify-content: flex-end; margin-top: 1rem;"
      >
        <b-button
        type="is-success"
        rounded
        @click="clickAddUser"
        >
          Add User
        </b-button>
      </div>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import HelperBotCard from '../components/helper-bot-card'
import AddUserModal from '../components/modals/add-user'
import {
  addUrlQueryParams,
  getUrlQueryParams
} from '../utils'

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
    authCode () {
      return getUrlQueryParams().code
    },
    state () {
      return getUrlQueryParams().state
    },
    isLoading () {
      return this.loading.bot.list
    },
    isWorking () {
      return this.working.bot.create
    },
    webexRedirectUri () {
      // this current URL
      return `${window.location.protocol}//${window.location.host}/admin/`
    },
    webexSsoUrl () {
      const endpoint = 'https://webexapis.com/v1/authorize'
      // TODO get these from REST API? maybe?
      const scopes = [
        'spark:kms',
        'spark:people_read',
        'spark:messages_read',
        'spark:messages_write',
        'spark:rooms_read'
      ]
      const params = {
        // TODO get client_id from REST API since it is defined there
        client_id: 'C0faef7f261848a6e30e9c3992937d4185de820599c64932b7441cc57abcdb188',
        response_type: 'code',
        redirect_uri: this.webexRedirectUri,
        scope: scopes.join(' '),
        // arbitrary value for our use
        state: 'helper-add-user'
      }
      return addUrlQueryParams(endpoint, params)
    },
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        this.getBots()
      }
    },
    authCode (val, oldVal) {
      // was auth code just set?
      if (val && !oldVal) {
        // do webex oauth2
        this.checkCreateBot()
      }
    }
  },

  mounted () {
    if (this.isLoggedIn) {
      // get list of existing bot users
      this.getBots()
      // check if creating new bot using oauth2
      this.checkCreateBot()
    }
  },

  methods: {
    ...mapActions([
      'getBots',
      'checkCreateBot'
    ]),
    clickAddUser () {
      this.$buefy.modal.open({
        parent: this,
        component: AddUserModal,
        hasModalCard: true,
        trapFocus: true,
        rounded: true,
        props: {
          url: this.webexSsoUrl
        },
        events: {
          // submit: (data) => {}
        }
      })
    }
  }
}
</script>
