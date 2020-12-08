<template>
  <div>
    <!-- More information regarding Cisco Meeting Server can be found at:
    <a :href="docLink">{{ docLink }}</a> -->

    <!-- Web Access -->
    <b-collapse
    aria-id="web-access"
    class="panel"
    animation="slide"
    >
      <div
      slot="trigger"
      class="panel-heading"
      role="button"
      aria-controls="web-access"
      >
        <strong>Web Access</strong>
      </div>
      <div class="panel-block">
        <ul style="list-style: none;">
          <li>
            Click to join:
            <strong><a :href="joinLink">{{ joinLink }}</a></strong>
          </li>
          <li>Call ID: <strong>{{ callId }}</strong></li>
        </ul>
      </div>
    </b-collapse>

    <!-- SIP Call -->
    <b-collapse
    aria-id="sip-access"
    class="panel"
    animation="slide"
    >
      <div
      slot="trigger"
      class="panel-heading"
      role="button"
      aria-controls="sip-access"
      >
        <strong>Call in from a video system, Jabber, or Lync:</strong>
      </div>
      <div class="panel-block">
        <ul style="list-style: none;">
          <li>
            <strong>
              <a :href="`sip:${userAddress}`">{{ userAddress }}</a>
            </strong>
          </li>
          <li>
            <strong>
              <a :href="`sip:${didAddress}`">{{ didAddress }}</a>
            </strong>
          </li>
        </ul>
      </div>
    </b-collapse>

    <!-- PSTN Call -->
    <b-collapse
    aria-id="sip-access"
    class="panel"
    animation="slide"
    >
      <div
      slot="trigger"
      class="panel-heading"
      role="button"
      aria-controls="sip-access"
      >
        <strong>Call in from a PSTN phone:</strong>
      </div>
      <div class="panel-block">
        <ul style="list-style: none;">
          <li>Dial <strong>{{ did }}</strong></li>
          <li>Enter call ID <strong>{{ callId }}</strong>, followed by <strong>#</strong></li>
        </ul>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      docLink: 'http://www.cisco.com/c/en/us/products/collateral/conferencing/meeting-server/datasheet-c78-737519.html'
    }
  },

  computed: {
    ...mapGetters([
      'adUser',
      'demoEnvironment'
    ]),
    callId () {
      return this.user.telephoneNumber
    },
    joinLink () {
      return `https://join.${this.domain}/`
    },
    userAddress () {
      return this.user.userPrincipalName
    },
    domain () {
      return this.user.userPrincipalName.split('@').pop()
    },
    didAddress () {
      return `${this.callId}@${this.domain}`
    },
    did () {
      return this.demoEnvironment.did
    }
  }
}
</script>
