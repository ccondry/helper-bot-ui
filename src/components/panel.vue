<template>
  <b-collapse
  :aria-id="ariaId"
  class="panel"
  animation="slide"
  >
    <div
    v-if="title.length"
    slot="trigger"
    class="panel-heading"
    role="button"
    :aria-controls="ariaId"
    >
      <strong>{{ title }}</strong>
    </div>
    <!-- <div
    class="panel-block"
    style="background-color: white;"
    :style="!title.length ? 'border-radius: 6px;' : ''"
    >
      <slot />
    </div> -->
    <div class="panel-block box">
      <div class="content">
        <slot /> 
      </div>
    </div>
  </b-collapse>
</template>

<script>
export default {
  props: {
    title: {
      default: '',
      type: String
    },
    ariaId: {
      default: '',
      type: String
    }
  }
}
</script>