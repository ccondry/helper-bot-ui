<template>
  <div>
    <!-- name -->
    <b-field label="Name" label-position="on-border">
      <b-input v-model="model.name" />
    </b-field>

    <!-- userRoomId -->
    <b-field label="User Room" label-position="on-border">
      <b-input v-model="model.userRoomId" />
    </b-field>
    
    <!-- staffRoomId -->
    <b-field label="Staff Room" label-position="on-border">
      <b-input v-model="model.staffRoomId" />
    </b-field>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true
    }
  }
}
</script>
