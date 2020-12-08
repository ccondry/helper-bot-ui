<template>
  <div
  id="main-container"
  class="container is-fluid is-marginless app-content"
  >
    <!-- top-right buttons -->
    <div
    class="buttons"
    style="float: right; position: absolute; right: 10px; top: 10px;"
    >
      <!-- admin panel button -->
      <b-button
      v-if="isAdmin && atHome"
      type="is-info"
      rounded
      @click="clickAdmin"
      >
        Admin
      </b-button>

      <!-- home button -->
      <b-button
      v-if="atAdmin"
      type="is-info"
      rounded
      @click="clickHome"
      >
        Home
      </b-button>

      <!-- logout -->
      <!-- <b-button
      v-if="isLoggedIn"
      type="is-primary"
      rounded
      @click="clickLogout"
      >
        Log Out
      </b-button> -->
    </div>
    <section class="main">
      <!-- vue-router container -->
      <transition
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
      appear
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>

      <!-- copyright and version -->
      <app-footer />
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AppFooter from './components/app-footer'

export default {
  components: {
    AppFooter
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isAdmin',
      'jwtUser'
    ]),
    atHome () {
      try {
        return this.$route.name === 'Home'
      } catch (e) {
        return false
      }
    },
    atAdmin () {
      try {
        return this.$route.name === 'Admin'
      } catch (e) {
        return false
      }
    }
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
        // check if they have an active AD account
        this.getUser(this.jwtUser.sub)
      } else if (!val && oldVal) {
        // user just logged out
        // redirect them to SSO
        this.checkJwt()
      }
    }
  },

  mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkJwt()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'logout',
      'getUser'
    ]),
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    },
    clickLogout () {
      this.logout()
    },
    clickHome () {
      this.$router.push({name: 'Home'}).catch(e => {})
    }
  }
}
</script>
