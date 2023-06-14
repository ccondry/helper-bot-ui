<template>
  <panel :title="`Welcome ${jwtUser.first_name}!`" aria-id="welcome">
    <p>
      Welcome to the Cisco dCloud Helper Bot.
    </p>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'jwtUser'
    ])
  }
}
</script>