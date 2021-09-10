<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Create Support Room Pair
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
        placeholder="An internal name for this pair of rooms"
        required
        />
      </b-field>

      <b-field label="Staff Room Title">
        <b-input
        v-model="mutableModel.staffRoomTitle"
        placeholder="My Demo - Staff Room"
        required
        />
      </b-field>

      <b-field label="User Room Title">
        <b-input
        v-model="mutableModel.userRoomTitle"
        placeholder="My Demo - User Support"
        required
        />
      </b-field>

      <b-field
      v-if="!hasDirectRoomId"
      label="Direct Messages Room Title"
      >
        <b-input
        v-model="mutableModel.directRoomTitle"
        placeholder="My Demo - Direct Messages"
        required
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
          Create
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    hasDirectRoomId: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      mutableModel: {
        staffRoomTitle: '',
        userRoomTitle: '',
        directRoomTitle: '',
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
