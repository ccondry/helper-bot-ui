<template>
  <div>
    <!-- name -->
    <b-field label="Name" label-position="on-border">
      <b-input v-model="model.name" :lazy="true" />
    </b-field>

    <!-- userRoomId -->
    <b-field label="User Room" label-position="on-border">
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
    
    <!-- staffRoomId -->
    <b-field label="Staff Room" label-position="on-border">
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
    
    <!-- hidden -->
    <b-field label="Hidden" label-position="on-border">
      <b-checkbox v-model="model.hidden" />
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
    }
  },

  computed: {
    ...mapGetters([
      'roomTitles'
    ]),
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
      'getRoomDetails'
    ]),
    clickRemoveRoom () {
      this.$emit('delete')
    }
  }
}
</script>
