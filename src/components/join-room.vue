<template>
  <panel title="Join a Support Room" aria-id="join-support-room">
    <p v-if="!room">
      Join one of our Webex Teams support rooms:
    </p>
    <b-field v-if="!room">
      <b-select 
      v-model="roomId"
      expanded
      rounded
      >
        <option :value="null" disabled selected>
          Choose a Webex Room
        </option>
        <option
        v-for="(r, index) of filteredRooms"
        :key="index"
        :value="r.id"
        >
          {{ r.title }}
        </option>
      </b-select>
    </b-field>
    <b-field
    v-if="roomId"
    >
      <b-button
      type="is-primary"
      rounded
      expanded
      @click="clickJoinSupportRoom"
      >
        Join {{ selectedRoomTitle }}
      </b-button>
    </b-field>
    <b-loading :active="isLoading || isWorking" :is-full-page="false" />
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    bot: {
      type: String,
      required: false,
      default: ''
    },
    room: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      roomId: null
    }
  },

  computed: {
    ...mapGetters([
      'jwtUser',
      'rooms',
      'working',
      'loading'
    ]),
    filteredRooms () {
      if (this.bot) {
        return this.rooms.filter(v => v.bot === this.bot)
      }
      if (this.room) {
        return this.rooms.filter(v => v.id === this.room)
      }
      return this.rooms
    },
    isWorking () {
      return this.working.room.join
    },
    isLoading () {
      return this.loading.room.list
    },
    selectedRoomTitle () {
      try {
        console.log('this.roomId', this.roomId)
        const room = this.rooms.find(v => v.id === this.roomId)
        console.log('found room', room)
        return room.title
      } catch (e) {
        return 'Support Room'
      }
    }
  },

  mounted () {
    if (this.room) {
      this.roomId = this.room
    }
  },

  methods: {
    ...mapActions([
      'joinSupportRoom'
    ]),
    clickJoinSupportRoom () {
      this.$buefy.dialog.confirm({
        title: 'Join Webex Teams Support Room',
        message: `Join the <b>${this.selectedRoomTitle}</b> Webex Teams Room as <b>${this.jwtUser.email}</b>?`,
        rounded: true,
        confirmText: 'Join',
        type: 'is-success',
        onConfirm: () => {
          this.joinSupportRoom({
            id: this.roomId,
            title: this.selectedRoomTitle
          })
        }
      })
    }
  }
}
</script>