<template>
  <q-card class="vault-item">
    <div class="app-icon">
      <q-icon v-if="item.type === 'file'" name="description" />
      <span v-else>{{ item.icon }}</span>
    </div>

    <div class="item-info">
      <strong>{{ item.title }}</strong>
      <p>{{ item.subtitle }}</p>
    </div>

    <q-icon
      v-if="item.type === 'password'"
      :name="item.favorite ? 'star' : 'star_border'"
      class="favorite"
    />

    <q-btn flat round dense icon="more_vert" />
  </q-card>
</template>

<script setup>
defineProps({
  item: Object,
})
</script>
