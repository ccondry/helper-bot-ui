<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Add Support Room Pair
      </p>
      <button
      type="button"
      class="delete"
      style="margin-left: 0.5rem;"
      @click="$emit('close')"
      />
    </header>

    <section class="modal-card-body">
      <b-field label="Name">
        <b-input
        v-model="mutableModel.name"
        placeholder="A name for this pair of rooms"
        required
        />
      </b-field>

      <b-field label="Staff Room ID">
        <b-input
        v-model="mutableModel.staffRoomId"
        placeholder="Webex Teams Room ID"
        required
        type="textarea"
        />
      </b-field>

      <b-field label="User Room ID">
        <b-input
        v-model="mutableModel.userRoomId"
        placeholder="Webex Teams Room ID"
        required
        type="textarea"
        />
      </b-field>
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
          Add
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mutableModel: {
        staffRoomId: '',
        userRoomId: '',
        name: ''
      }
    }
  },

  methods: {
    submit () {
      this.$emit('submit', this.mutableModel)
      this.$emit('close')
    }
  }
}
</script>
