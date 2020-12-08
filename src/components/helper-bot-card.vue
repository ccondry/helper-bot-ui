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
        {{ model.displayName }}
      </p>
      <p class="subtitle flex-item">
        {{ model.personEmail }}
      </p>

      <!-- main content -->
      <div class="content flex-item">
        <!-- personId -->
        <b-field label="Person ID" label-position="on-border">
          <b-input v-model="model.personId" />
        </b-field>

        <!-- personEmail -->
        <b-field label="Person Email" label-position="on-border">
          <b-input v-model="model.personEmail" />
        </b-field>

        <!-- room pairs -->
        <b-table
        :ref="`helperBotDetails-${model._id}`"
        :data="model.rooms"
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
            <a @click="$refs[`helperBotDetails-${model._id}`].toggleDetails(props.row)">
              {{ props.row.name }}
            </a>
          </b-table-column>

          <!-- expanded detail view -->
          <template slot="detail" slot-scope="props">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <room-pair :model="props.row" />
                </div>
              </div>
            </article>
          </template>

          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>No Helper Bot room pairs match your filter</p>
              </div>
            </section>
          </template>

          <template slot="footer">
            <div class="has-text-right">
              Total Rooms: {{ model.rooms.length }}
            </div>
          </template>
        </b-table>
      </div>
      <!-- /content -->
      
      <!-- footer -->
      <div class="flex-item" style="margin-top: auto;">
        <div class="buttons" style="float: right;">
          <!-- delete button -->
          <b-button type="is-danger" @click="clickDelete">
            Delete
          </b-button>
          <!-- add Room button -->
          <b-button type="is-success" @click="clickAddRoom">
            Add Room
          </b-button>
          <!-- reset button -->
          <b-button type="is-info" @click="clickReset">
            Reset
          </b-button>
          <!-- clone button -->
          <b-button type="is-primary" @click="clickClone">
            Clone
          </b-button>
          <!-- save button -->
          <b-button type="is-success" @click="clickSave">
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
import RoomPair from './room-pair'

export default {
  components: {
    // CreateModal,
    RoomPair
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
      'loading'
    ]),
    isWorking () {
      return this.working.bot.create
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
      'saveMultichannel',
      'deleteMultichannel',
      'createMultichannel'
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
    clickSave () {
      // clicked button to save a demo
      const message = `Are you sure you want to save <strong>${this.mutableModel.name}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Save this multichannel option?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Save',
        type: 'is-success',
        onConfirm: () => {
          // this.saveMultichannel(this.mutableModel)
        }
      })
    },
    clickReset () {
      const message = `Are you sure you want to reset your changes to <strong>${this.mutableModel.name}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Reset your changes to this multichannel option?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Reset',
        type: 'is-success',
        onConfirm: () => {
          this.refresh()
        }
      })
    },
    clickDelete () {
      // clicked button to delete a demo
      const message = `Are you sure you want to delete <strong>${this.mutableModel.name}</strong>?`
      this.$buefy.dialog.confirm({
        title: 'Delete this multichannel option?',
        message,
        cancelText: 'Cancel',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: () => {
          // this.deleteMultichannel(this.mutableModel._id)
        }
      })
    }
  }
}
</script>
