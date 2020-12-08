<template>
  <panel :title="`Welcome ${jwtUser.given_name}!`">
    <!-- subtitle -->
    <p v-if="adUser" class="subtitle">
      <span v-if="expired">
        Your account has expired.
      </span>
      <span v-else>
        Your account will expire {{ expiresFromNow }}.
      </span>
    </p>

    <!-- content -->
    <div class="content">
      <p>
        Fill out this form to create your GoCMS user account. 
      </p>
      <b-field label="New Password" label-position="on-border">
        <b-input
        v-model="password"
        type="password"
        :required="true"
        placeholder="A new password, only for GoCMS"
        aria-placeholder="A new password, only for GoCMS"
        @keydown.enter.native="clickCreate"
        />
      </b-field>
      <b-field
      label="Call ID"
      label-position="on-border"
      >
        <b-input
        v-model="dn"
        placeholder="Your Phone Number"
        aria-placeholder="Your Phone Number"
        :required="true"
        @keydown.enter.native="clickCreate"
        />
      </b-field>
      <div style="padding-top: 1rem;">
        <b-button
        type="is-success"
        rounded
        expanded
        :disabled="!dn.length || !password.length"
        @click="clickCreate"
        >
          Create GoCMS User
        </b-button>
      </div>
    </div>
  </panel>
</template>