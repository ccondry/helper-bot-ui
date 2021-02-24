<template>
  <div>
    <!-- name -->
    <b-field label="Name" label-position="on-border">
      <b-input v-model="model.name" :lazy="true" />
    </b-field>

    <!-- userRoomId -->
    <b-field label="User Room ID" label-position="on-border">
      <b-input v-model="model.userRoomId" />
    </b-field>

    <!-- userRoomTitle -->
    <b-field label="User Room Title" label-position="on-border">
      <div class="control is-clearfix">
        <div>
          {{ userRoomTitle }}
        </div>
      </div>
    </b-field>

    <!-- is user in room? -->
    <b-field label="Bot In User Room?" label-position="on-border">
      <div class="control is-clearfix">
        <div>
          <!-- yes -->
          <b-tooltip
          v-if="isInUserRoom"
          label="The Helper user is in this room."
          >
            <b-tag
            type="is-success"
            >
            Yes
            </b-tag>
          </b-tooltip>

          <!-- no -->
          <b-tooltip
          v-else
          label="The Helper user is not in this room."
          >
            <b-tag
            type="is-warning"
            >
            No
            </b-tag>
          </b-tooltip>
        </div>
      </div>
    </b-field>

    <!-- add any person to user room -->
    <b-field label="Add Person to User Room" label-position="on-border">
      <div class="control is-clearfix">
        <div>
          <b-button
          type="is-success"
          rounded
          @click="addSomeoneToUserRoom"
          >
           Add Someone to User Room
          </b-button>
        </div>
      </div>
    </b-field>
    
    <br />

    <!-- staffRoomId -->
    <b-field label="Staff Room ID" label-position="on-border">
      <b-input v-model="model.staffRoomId" />
    </b-field>

    <!-- staffRoomTitle -->
    <b-field label="Staff Room Title" label-position="on-border">
      <div class="control is-clearfix">
        <div>
          {{ staffRoomTitle }}
        </div>
      </div>
    </b-field>

    <!-- is bot user in staff room? -->
    <b-field label="Bot In Staff Room?" label-position="on-border">
      <div class="control is-clearfix">
        <div>
          <!-- yes -->
          <b-tooltip
          v-if="isInStaffRoom"
          label="The Helper user is in this room."
          >
            <b-tag
            type="is-success"
            >
            Yes
            </b-tag>
          </b-tooltip>

          <!-- no -->
          <b-tooltip
          v-else
          label="The Helper user is in this room."
          >
            <b-tag
            type="is-warning"
            >
            No
            </b-tag>
          </b-tooltip>
        </div>
      </div>
    </b-field>

    <!-- add any person to staff room -->
    <b-field label="Add Person to Staff Room" label-position="on-border">
      <div class="control is-clearfix">
        <div>
          <b-button
          type="is-success"
          rounded
          @click="addSomeoneToStaffRoom"
          >
           Add Someone to Staff Room
          </b-button>
        </div>
      </div>
    </b-field>
    
    <!-- hidden -->
    <b-field label="Hidden" label-position="on-border">
      <b-tooltip label="Whether this room is shown to users on the home page of this site.">
        <b-checkbox v-model="model.hidden" />
      </b-tooltip>
    </b-field>

    <div class="buttons" style="display: flex; justify-content: flex-end;">
      <b-button
      type="is-danger"
      rounded
      @click="clickRemoveRoom"
      >
        Remove {{ model.name }} Room
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    model: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'roomTitles',
      'memberships',
      'jwtUser'
    ]),
    isInUserRoom () {
      return this.memberships[this.user._id].find(membership => {
        return membership.id === this.model.userRoomId
      })
    },
    isInStaffRoom () {
      return this.memberships[this.user._id].find(membership => {
        return membership.id === this.model.staffRoomId
      })
    },
    userRoomTitle () {
      try {
        return this.roomTitles[this.model.userRoomId] || 'Loading...'
      } catch (e) {
        return 'unknown'
      }
    },
    staffRoomTitle () {
      try {
        return this.roomTitles[this.model.staffRoomId] || 'Loading...'
      } catch (e) {
        return 'unknown'
      }
    }
  },

  mounted () {
    // load user room title
    if (!this.roomTitles[this.model.userRoomId]) {
      this.getRoomDetails(this.model.userRoomId)
    }
    // load staff room title
    if (!this.roomTitles[this.model.staffRoomId]) {
      this.getRoomDetails(this.model.staffRoomId)
    }
  },
  
  methods: {
    ...mapActions([
      'getRoomDetails',
      'joinRoom',
      'createMembership'
    ]),
    clickRemoveRoom () {
      this.$emit('delete')
    },
    clickJoinUserRoom () {
      this.joinRoom({
        userId: this.user._id,
        roomId: this.model.userRoomId
      })
    },
    clickJoinStaffRoom () {
      this.joinRoom({
        userId: this.user._id,
        roomId: this.model.staffRoomId
      })
    },
    addSomeoneToUserRoom () {
      this.$buefy.dialog.prompt({
        title: 'Add Person to Room',
        messae: 'Enter the email of the person you would like to add to this User room:',
        confirmText: 'Add Person to User Room',
        type: 'is-success',
        rounded: true,
        onConfirm: personEmail => {
          this.createMembership({
            userId: this.user._id,
            personEmail,
            roomId: this.model.userRoomId
          })
        }
      })
    },
    addSomeoneToStaffRoom () {
      this.$buefy.dialog.prompt({
        title: 'Add Person to Room',
        messae: 'Enter the email of the person you would like to add to this Staff room:',
        confirmText: 'Add Person to Staff Room',
        type: 'is-success',
        rounded: true,
        inputAttrs: {
          value: this.jwtUser.email
        },
        onConfirm: personEmail => {
          this.createMembership({
            userId: this.user._id,
            personEmail,
            roomId: this.model.staffRoomId
          })
        }
      })
    }
  }
}
</script>
