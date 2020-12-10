<template>
  <b-table
  :ref="`helperBotWebhooks`"
  :data="model"
  :narrowed="true"
  detailed
  detail-key="id"
  :show-detail-icon="true"
  >
    <b-table-column
    v-slot="props"
    field="name"
    >
      <a @click="$refs[`helperBotWebhooks`].toggleDetails(props.row)">
        {{ props.row.name }}
      </a>
    </b-table-column>

    <!-- expanded detail view -->
    <template slot="detail" slot-scope="props">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <pre>{{ props.row }}</pre>
            <div class="buttons" style="display: flex; justify-content: flex-end;">
              <b-button
              type="is-danger"
              rounded
              @click="$emit('delete', props.row)"
              >
                Delete {{ props.row.name }} Webhook
              </b-button>
            </div>
          </div>
        </div>
      </article>
    </template>
  </b-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    model: {
      required: true,
      type: Array
    }
  },

  computed: {
    ...mapGetters([
      'loading',
      'working'
    ])
  }
}
</script>
