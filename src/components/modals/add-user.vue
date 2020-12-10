<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Add Helper Bot User
      </p>
      <button
      type="button"
      class="delete"
      style="margin-left: 0.5rem;"
      @click="$emit('close')"
      />
    </header>

    <section class="modal-card-body" style="min-width: 40rem;">
      <p>
        <b>
          Before you continue, you may need to log
          out of
          <a
          href="https://developer.webex.com"
          target="_blank"
          >developer.webex.com</a>.
        </b>
      </p>
      <br>
      <p>
        This will start an OAUTH2 flow with idbroker.webex.com to authorize
        the Helper integration to send and recieve messages on behalf of the
        Webex user credentials you use after clicking the Start button below.
      </p>
    </section>

    <footer class="modal-card-foot">
      <div style="width: 100%; display: flex; justify-content: flex-end;">
        <b-button 
        rounded
        @click="$emit('close')"
        >
          Cancel
        </b-button>
        <b-button
        rounded
        type="is-success"
        @click="submit"
        >
          Start Webex OAUTH2
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },

  methods: {
    submit () {
      // this.$emit('submit')
      // this.$emit('close')
      window.location = this.url
    }
  }
}
</script>
