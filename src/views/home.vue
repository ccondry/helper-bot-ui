<template>
  <div>
    <!-- welcome -->
    <welcome />

    <!-- test -->
    <user />

    <!-- loading -->
    <b-loading :active="!isLoggedIn || isLoading || isWorking" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import Welcome from '../components/welcome'
import User from '../components/user'


export default {
  components: {
    Welcome,
    User
  },

  data () {
    return {
      password: '',
      dn: '',
      moment
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser',
      'loading',
      'working',
      'isAdmin',
      'users',
      'adUser'
    ]),
    expires () {
      try {
        return (this.adUser.accountExpires - 116444736000000000) / 10000
      } catch (e) {
        return 0
      }
    },
    expiresFromNow () {
      return moment(this.expires).fromNow()
    },
    expired () {
      return this.expires <= Date.now()
    },
    isLoading () {
      return this.loading.user[this.jwtUser.sub]
    },
    isWorking () {
      return this.working.user[this.jwtUser.sub]
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'createUser',
      'setUserExpiration',
      'setUserPassword'
    ]),
    clickCreate () {
      if (this.password.length && this.dn.length) {
        this.createUser({
          password: this.password,
          dn: this.dn
        })
      }
    },
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    },
    clickLogout () {
      this.logout()
    },
    clickExtend () {
      this.setUserExpiration({username: this.adUser.sAMAccountName, hour: 12})
    },
    clickSetUserPassword () {
      this.$buefy.dialog.prompt({
        title: 'Reset Password',
        message: 'Choose your new password',
        inputAttrs: {
          type: 'password',
          placeholder: 'Your New Password',
          'aria-placeholder': 'Your New Password'
        },
        confirmText: 'Submit',
        rounded: true,
        onConfirm: (password) => {
          this.setUserPassword({
            username: this.jwtUser.sub,
            password
          })
        },
        type: 'is-success'
      })
    }
  }
}
</script>
