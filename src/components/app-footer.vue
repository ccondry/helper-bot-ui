<template>
  <panel aria-id="version-copyright">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <cisco-logo style="width: 4rem; height: 4rem;" />
      <small> 
        UI Version {{ uiVersion }}
      </small>
      <small>
        API Version {{ apiVersion }}
      </small>
      <small>
        © 2020 Cisco and/or its affiliates. All rights reserved.
      </small>
    </div>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'
import CiscoLogo from '../components/cisco-logo'

export default {
  components: {
    CiscoLogo
  },

  computed: {
    ...mapGetters([
      'uiVersion',
      'apiVersion'
    ])
  }
}
</script>