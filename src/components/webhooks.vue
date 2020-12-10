<template>
  <b-field label="Webhook">
    <div
    v-if="loading.webhook[model._id]"
    >
      <b-loading
      :active="true"
      :is-full-page="false"
      />
      Loading...
    </div>
    <div v-else>
      <!-- valid webhooks -->
      <b-tag
      v-if="activeWebhooks.length > 0"
      type="is-success"
      rounded
      >
        Has {{ activeWebhooks.length }} valid {{ activeWebhooks.length === 1 ? 'webhook' : 'webhooks' }}
      </b-tag>

      <!-- no valid webhooks -->
      <b-button
      v-if="!activeWebhooks.length > 0"
      type="is-primary"
      size="is-small"
      rounded
      @click="clickCreateWebhook"
      >
        No valid webhooks - click here to fix it
      </b-button>
      
      <!-- invalid webhooks -->
      <b-button
      v-if="inactiveWebhooks.length > 0"
      type="is-primary"
      size="is-small"
      rounded
      @click="clickRemoveInactiveWebhooks"
      >
        Has {{ inactiveWebhooks.length }} invalid {{ inactiveWebhooks.length === 1 ? 'webhook' : 'webhooks' }}
      </b-button>
    </div>
    <!-- <pre>{{ activeWebhooks }}</pre> -->
    <!-- <pre>{{ myWebhooks }}</pre> -->
  </b-field>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    model: {
      required: true,
      type: Object
    }
  },

  computed: {
    ...mapGetters([
      'loading',
      'working',
      'webhooks'
    ]),
    inactiveWebhooks () {
      return this.myWebhooks.filter(webhook => {
        return !this.activeWebhooks.find(w => w === webhook)
      })
    },
    activeWebhooks () {
      // look for an valid active webhook
      return this.myWebhooks.filter(webhook => {
        return webhook.resource === 'messages' &&
          webhook.event === 'created' &&
          webhook.targetUrl === 'https://mm-helper.cxdemo.net/api/v1/webhook' &&
          webhook.status === 'active' && 
          webhook.secret === this.model.webhookSecret
      })
    },
    myWebhooks () {
      try {
        return this.webhooks[this.model._id] || []
      } catch (e) {
        return []
      }
    }
  },

  methods: {
    ...mapActions([
      'createWebhook'
    ]), 
    clickRemoveInactiveWebhooks (id) {
      this.deleteWebhook(id)
    },
    clickCreateWebhook () {
      this.createWebhook(this.model._id)
    },
  }
}
</script>
