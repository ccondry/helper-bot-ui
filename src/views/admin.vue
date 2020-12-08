<template>
  <section class="main">
    <div class="is-parent">
      <!-- logged in -->
      <article
      v-if="isLoggedIn"
      class="tile is-child is-white flex-container box"
      style="box-shadow: 0 2rem 1rem rgba(0,0,0,.2); border: 1px solid rgb(204, 204, 204);"
      >
        <p class="title">
          Users
        </p>
        <div class="content">
          <b-table
          ref="table"
          :data="users"
          :paginated="users.length > 20"
          per-page="20"
          detailed
          :loading="loading.ldap.user"
          detail-key="sAMAccountName"
          :show-detail-icon="true"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          >
            <!-- <b-loading :active="loading.ldap.user" :is-full-page="false" /> -->
            <!-- expired icon -->
            <b-table-column
            v-slot="props"
            field="accountExpires"
            sortable
            >
              <b-icon
              v-if="isExpired(props.row)"
              icon="account-cancel"
              type="is-danger"
              />
            </b-table-column>

            <!-- name -->
            <b-table-column
            v-slot="props"
            field="fullName"
            label="Name"
            sortable
            searchable
            >
              <a @click="toggle(props.row)">
                {{ props.row.fullName }}
              </a>
            </b-table-column>

            <!-- username -->
            <b-table-column
            v-slot="props"
            field="sAMAccountName"
            label="Username"
            sortable
            searchable
            >
              <a @click="toggle(props.row)">
                {{ props.row.sAMAccountName }}
              </a>
            </b-table-column>

            <!-- email -->
            <b-table-column
            v-slot="props"
            field="mail"
            label="Email"
            sortable
            searchable
            >
              <a @click="toggle(props.row)">
                {{ props.row.mail }}
              </a>
            </b-table-column>

            <!-- call ID -->
            <b-table-column
            v-slot="props"
            field="telephoneNumber"
            label="Call ID"
            sortable
            searchable
            >
              {{ props.row.telephoneNumber }}
            </b-table-column>

            <!-- expires -->
            <b-table-column
            v-slot="props"
            field="accountExpires"
            label="Expires"
            sortable
            >
              {{ expires(props.row) }}
            </b-table-column>

            <!-- last login -->
            <b-table-column
            v-slot="props"
            field="lastLogonTimestamp"
            label="Last Login"
            sortable
            >
              {{ convertLdapTimestamp(props.row.lastLogonTimestamp) }}
            </b-table-column>

            <!-- created -->
            <b-table-column
            v-slot="props"
            field="whenCreated"
            label="Created"
            sortable
            >
              {{ convertLdapDate(props.row.whenCreated) }}
            </b-table-column>

            <!-- modified -->
            <b-table-column
            v-slot="props"
            field="whenChanged"
            label="Modified"
            sortable
            >
              {{ convertLdapDate(props.row.whenChanged) }}
            </b-table-column>

            <template slot="detail" slot-scope="props">
              <div class="content" style="position: relative;">
                <b-loading
                :active="loading.user[props.row.sAMAccountName] || working.user[props.row.sAMAccountName]"
                :is-full-page="false"
                />
                
                <user-space
                v-if="!isExpired(props.row)"
                class="content"
                :user="props.row"
                />

                <div class="buttons" style="padding-top: 1rem; justify-content: flex-end;">
                  <!-- extend -->
                  <b-button
                  type="is-primary"
                  rounded
                  :disabled="working.user[props.row.sAMAccountName]"
                  @click="clicksetUserExpiration(props.row)"
                  >
                    Extend Expiration
                  </b-button>

                  <!-- expire -->
                  <b-button
                  v-if="!isExpired(props.row)"
                  type="is-warning"
                  rounded
                  :disabled="working.user[props.row.sAMAccountName]"
                  @click="clickExpireUser(props.row)"
                  >
                    Expire Now
                  </b-button>

                  <!-- reset password -->
                  <b-button
                  type="is-info"
                  rounded
                  :disabled="working.user[props.row.sAMAccountName]"
                  @click="clickResetPassword(props.row)"
                  >
                    Reset Password
                  </b-button>

                  <!-- delete -->
                  <b-button
                  type="is-danger"
                  rounded
                  :disabled="working.user[props.row.sAMAccountName]"
                  @click="clickDeleteUser(props.row)"
                  >
                    Delete
                  </b-button>
                </div>
              </div>
            </template>
          </b-table>
        </div>
        <!-- copyright and version -->
        <app-footer />
      </article>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import UserSpace from '../components/space'
import AppFooter from '../components/app-footer'

function ldap2Utc (ldapTime) {
  return (ldapTime - 116444736000000000) / 10000
}

function expiresUtc (user) {
  return ldap2Utc(user.accountExpires)
}

export default {
  components: {
    UserSpace,
    AppFooter
  },

  data () {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'isLoggedIn',
      'loading',
      'working'
    ])
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
      'getUsers',
      'deleteUser',
      'setUserExpiration',
      'setUserPassword'
    ]),
    convertLdapTimestamp (time) {
      if (time) {
        return moment(ldap2Utc(time)).fromNow()
      } else {
        return 'Never'
      }
    },
    isExpired (user) {
      return expiresUtc(user) < Date.now()
    },
    clickDeleteUser (user) {
      console.log(user)
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to <strong>delete ${user.sAMAccountName}</strong>?`,
        type: 'is-danger',
        // cancelText: 'Disagree',
        confirmText: 'Delete',
        rounded: true,
        onConfirm: () => {
          this.deleteUser(user.sAMAccountName)
        }
      })
    },
    clickHome () {
      this.$router.push({name: 'Home'}).catch(e => {})
    },
    toggle (row) {
      // expand details for table row
      this.$refs.table.toggleDetails(row)
    },
    expires (user) {
      return moment(expiresUtc(user)).fromNow()
    },
    convertLdapDate (date) {
      if (!date) {
        return 'invalid date'
      }
      // 2020 10 20 20 25 23.0Z
      const d = new Date()
      d.setUTCFullYear(date.slice(0, 4))
      d.setUTCMonth(parseInt(date.slice(4, 6)) - 1)
      d.setUTCDate(date.slice(6, 8))
      d.setUTCHours(date.slice(8, 10))
      d.setUTCMinutes(date.slice(10, 12))
      d.setUTCSeconds(date.slice(12, 14))
      // return d
      return moment(d).fromNow()
    },
    clicksetUserExpiration (adUser) {
      this.setUserExpiration({
        username: adUser.sAMAccountName,
        hour: 12
      })
    },
    clickExpireUser (adUser) {
      this.setUserExpiration({
        username: adUser.sAMAccountName,
        hour: 0
      })
    },
    clickResetPassword (adUser) {
      this.$buefy.dialog.prompt({
        title: 'Reset Password',
        message: 'Choose the new password for ' + adUser.sAMAccountName,
        inputAttrs: {
          type: 'password',
          placeholder: `${adUser.sAMAccountName}'s New Password`,
          'aria-placeholder': `${adUser.sAMAccountName}'s New Password`
        },
        confirmText: 'Submit',
        rounded: true,
        onConfirm: (password) => {
          this.setUserPassword({
            username: adUser.sAMAccountName,
            password
          })
        },
        type: 'is-success'
      })
    }
  }
}
</script>
