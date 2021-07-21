<template>
  <div style="position: relative;">
    <b-loading :active="isWorking || isLoading" :is-full-page="false" />

    <!-- active webhooks -->
    <div v-if="activeWebhooks.length > 0">
      <div class="subtitle" style="margin-top: 2rem;">
        Valid Webhooks
      </div>
      <webhook-table
      :model="activeWebhooks"
      @delete="clickDeleteWebhook"
      />
    </div>

    <div v-else class="buttons">
      <b-button
      rounded
      type="is-success"
      @click="clickCreateWebhook"
      >
        Create Webhook
      </b-button>
    </div>

    <!-- inactive webhooks -->
    <div v-if="inactiveWebhooks.length > 0">
      <div class="subtitle" style="margin-top: 2rem;">
        Invalid Webhooks
      </div>
      <webhook-table
      :model="inactiveWebhooks"
      @delete="clickDeleteWebhook"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import WebhookTable from './webhook-table'

export default {
  components: {
    WebhookTable
  },

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
    isLoading () {
      return this.loading.webhook[this.model._id]
      // return true
    },
    isWorking () {
      return this.working.webhook[this.model._id]
    },
    inactiveWebhooks () {
      return this.myWebhooks.filter(webhook => {
        return !this.activeWebhooks.find(w => w === webhook)
      })
    },
    activeWebhooks () {
      // look for an valid active webhook
      return this.myWebhooks.filter(webhook => {
        return webhook.resource === 'messages' &&
          // webhook.event === 'created' &&
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
      'createWebhook',
      'deleteWebhook'
    ]), 
    clickCreateWebhook () {
      this.createWebhook(this.model._id)
    },
    clickDeleteWebhook (webhook) {
      this.$buefy.dialog.confirm({
        title: 'Delete Webhook?',
        message: `Are you sure you want to delete the webhook <b>${webhook.name}</b> from the user <b>${this.model.personEmail}</b>?`,
        rounded: true,
        type: 'is-danger',
        confirmText: 'Delete',
        onConfirm: () => {
          this.deleteWebhook({
            userId: this.model._id,
            webhookId: webhook.id
          })
        }
      })
    }
  }
}
</script>
