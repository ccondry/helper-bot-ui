<template>
  <div
  class="tile is-parent"
  >
    <article
    class="tile is-child notification flex-container box"
    style="min-width: 60rem;"
    > 
      <!-- loading/working -->
      <b-loading :active="isWorking" />

      <!-- title -->
      <p class="title flex-item" style="min-width: 21rem;">
        {{ mutableModel.displayName }}
      </p>
      <p class="subtitle flex-item">
        {{ mutableModel.personEmail }}
      </p>

      <!-- main content -->
      <div class="content flex-item">
        <!-- personId -->
        <b-field label="Person ID" label-position="on-border">
          <b-input v-model="mutableModel.personId" />
        </b-field>

        <!-- personEmail -->
        <b-field label="Person Email" label-position="on-border">
          <b-input v-model="mutableModel.personEmail" />
        </b-field>

        <!-- Webhook secret -->
        <b-field label="Webhook Secret" label-position="on-border">
          <b-input v-model="mutableModel.webhookSecret" />
        </b-field>

        <!-- current token -->
        <b-field
        v-if="typeof mutableModel.token === 'object'"
        label="Current Access Token"
        label-position="on-border"
        >
          <b-input
          :value="mutableModel.token.access_token"
          type="textarea"
          />
        </b-field>

        <!-- webhooks -->
        <webhooks :model="mutableModel" />

        <!-- room pairs -->
        <b-table
        :ref="`helperBotDetails-${mutableModel._id}`"
        :data="mutableModel.rooms"
        :narrowed="true"
        detailed
        detail-key="name"
        :show-detail-icon="true"
        >
          <b-table-column
          v-slot="props"
          field="name"
          label="Rooms"
          > 
            <a @click="$refs[`helperBotDetails-${mutableModel._id}`].toggleDetails(props.row)">
              {{ props.row.name }}
            </a>
          </b-table-column>

          <!-- expanded detail view -->
          <template slot="detail" slot-scope="props">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <room-pair
                  :model="props.row"
                  @delete="clickDeleteRoom(props.row)"
                  />
                </div>
              </div>
            </article>
          </template>

          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>No room pairs defined for {{ mutableModel.displayName }}</p>
              </div>
            </section>
          </template>

          <template slot="footer">
            <div class="has-text-right">
              Total Rooms: {{ totalRooms }}
            </div>
          </template>
        </b-table>
      </div>
      <!-- /content -->
      
      <!-- footer -->
      <div class="flex-item" style="margin-top: auto;">
        <div class="buttons" style="float: right;">
          <!-- delete button -->
          <b-button
          type="is-danger"
          rounded
          @click="clickDelete"
          >
            Delete
          </b-button>
          <!-- reset button -->
          <b-button
          type="is-info"
          rounded
          @click="clickReset"
          >
            Reset
          </b-button>
          <!-- clone button -->
          <!-- <b-button
          type="is-primary"
          rounded
          @click="clickClone"
          >
            Clone
          </b-button> -->
          <!-- add Room button -->
          <b-button
          type="is-success"
          rounded
          @click="clickAddRoom"
          >
            Add Room
          </b-button>
          <!-- save button -->
          <b-button
          type="is-success"
          rounded
          @click="clickSave"
          >
            Save
          </b-button>
        </div>
      </div>
      <!-- /footer -->
    </article>
    <!-- <pre>{{formProps}}</pre> -->
    <!-- <b-modal 
    v-model="isComponentModalActive"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-modal
    >
      <create-modal v-bind="formProps" @close="isComponentModalActive = false"/>
    </b-modal> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import CreateModal from './modals/create-multichannel'
import AddRoomModal from './modals/add-room'
import RoomPair from './room-pair'
import Webhooks from './webhooks'

export default {
  components: {
    // CreateModal,
    // AddRoomModal,
    RoomPair,
    Webhooks
  },

  props: {
    model: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      formProps: {},
      isComponentModalActive: false,
      mutableModel: {},
      allChannels: [
        'chat',
        'sms',
        'voice',
        'callback',
        'email',
        'task',
        'cobrowse'
      ]
    }
  },

  computed: {
    ...mapGetters([
      'working',
      'loading',
      'webhooks'
    ]),
    totalRooms () {
      try {
        return this.mutableModel.rooms.length
      } catch (e) {
        return ''
      }
    },
    isWorking () {
      return this.working.bot.create || this.working.bot[this.model._id]
    }
  },

  watch: {
    model (val, oldVal) {
      this.refresh()
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    ...mapActions([
      'saveBot',
      'deleteBot',
      'createBot'
    ]),
    refresh () {
      this.mutableModel = JSON.parse(JSON.stringify(this.model))
    },
    clickClone () {
      // this.isComponentModalActive = true
      // copy current data
      const copy = JSON.parse(JSON.stringify(this.mutableModel))
      this.$buefy.modal.open({
        parent: this,
        component: CreateModal,
        hasModalCard: true,
        trapFocus: true,
        rounded: true,
        props: {
          id: this.mutableModel.id,
          name: this.mutableModel.name
        },
        events: {
          submit: (data) => {
            // set the name from input dialog
            copy.id = data.id
            copy.name = data.name
            // create new multichannel
            // this.createMultichannel(copy)
          }
        }
      })
    },
    clickAddRoom () {
      // pop buefy modal to ask for room ID pair
      this.$buefy.modal.open({
        parent: this,
        component: AddRoomModal,
        hasModalCard: true,
        trapFocus: true,
        rounded: true,
        events: {
          submit: ({userRoomId, staffRoomId, name}) => {
            this.mutableModel.rooms.push({
              name,
              userRoomId,
              staffRoomId
            })
          }
        }
      })
    },
    clickSave () {
      // clicked button to save
      const message = `Are you sure you want to save <b>${this.mutableModel.personEmail}</b>?`
      this.$buefy.dialog.confirm({
        title: 'Save helper bot?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Save',
        type: 'is-success',
        rounded: true,
        onConfirm: () => {
          this.saveBot(this.mutableModel)
        }
      })
    },
    clickReset () {
      const message = `Are you sure you want to reset your changes to <strong>${this.mutableModel.personEmail}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Reset your changes?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Reset',
        type: 'is-success',
        rounded: true,
        onConfirm: () => {
          this.refresh()
        }
      })
    },
    clickDeleteRoom (room) {
      const index = this.mutableModel.rooms.findIndex(v => v === room)
      this.mutableModel.rooms.splice(index, 1)
    },
    clickDelete () {
      // clicked button to delete a demo
      const message = `Are you sure you want to delete <b>${this.mutableModel.personEmail}</b>?`
      this.$buefy.dialog.confirm({
        title: 'Delete this bot user?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Delete',
        type: 'is-danger',
        rounded: true,
        onConfirm: () => {
          this.deleteBot(this.mutableModel)
        }
      })
    }
  }
}
</script>
