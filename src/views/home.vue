<template>
  <div>
    <!-- welcome -->
    <welcome v-if="isLoggedIn" />

    <!-- join support room -->
    <join-room v-if="isLoggedIn" />

    <!-- loading -->
    <b-loading :active="!isLoggedIn || isLoading || isWorking" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Welcome from '../components/welcome'
import JoinRoom from '../components/join-room'

export default {
  components: {
    Welcome,
    JoinRoom
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser',
      'loading',
      'working'
    ]),
    isLoading () {
      return this.loading.user.login || this.loading.user.valid
    },
    isWorking () {
      return this.working.user.login || this.working.user.valid
    }
  }
}
</script>
