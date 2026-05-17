<template>
  <q-card class="vault-item">
    <div class="app-icon">
      <div v-if="item.type === 'note'" class="note-preview">
        <q-icon name="sticky_note_2" />
      </div>

      <object
        v-else-if="item.type === 'file' && item.fileType === 'application/pdf' && item.previewUrl"
        :data="item.previewUrl"
        type="application/pdf"
        class="pdf-preview"
      />

      <img
        v-else-if="item.type === 'file' && item.previewUrl"
        :src="item.previewUrl"
        class="preview-image"
      />

      <q-icon v-else-if="item.type === 'file'" name="description" />

      <img
        v-else-if="item.type === 'password' && item.website"
        :src="getFaviconUrl(item.website)"
        class="website-logo"
      />

      <span v-else>
        {{ item.icon }}
      </span>
    </div>

    <div class="item-info">
      <strong>{{ item.title }}</strong>

      <p>{{ item.subtitle }}</p>

      <q-badge
        v-if="item.type === 'password' && item.website"
        outline
        color="green"
        class="q-mt-xs"
      >
        {{ cleanWebsite(item.website) }}
      </q-badge>

      <q-badge v-if="item.type === 'file'" outline color="green" class="q-mt-xs">
        {{ getFileType(item) }}
      </q-badge>

      <q-badge v-if="item.type === 'note'" outline color="green" class="q-mt-xs">
        {{ getFileType(item) }}
      </q-badge>
    </div>

    <q-btn
      flat
      round
      :icon="item.favorite ? 'star' : 'star_border'"
      color="green"
      @click="toggleFavorite"
    />

    <q-btn flat round dense icon="more_vert" @click="$emit('click-more')" />
  </q-card>
</template>

<script setup>
const props = defineProps({
  item: Object,
})

const emit = defineEmits(['click-more', 'toggle-favorite'])

function toggleFavorite() {
  emit('toggle-favorite', props.item.id)
}

function cleanWebsite(website) {
  if (!website) return ''

  return website.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

function getFaviconUrl(website) {
  const domain = cleanWebsite(website)

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

function getFileType(item) {
  const file = item.subtitle?.toLowerCase()

  if (file?.includes('.pdf')) return 'PDF'

  if (file?.includes('.txt')) return 'TEXT'

  if (file?.includes('.png') || file?.includes('.jpg') || file?.includes('.jpeg')) {
    return 'IMAGE'
  }

  return 'FILE'
}
</script>

<style scoped>
.vault-item {
  height: 110px;

  padding: 0 20px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  gap: 16px;

  background: rgba(255, 255, 255, 0.85);

  box-shadow: 0 12px 30px rgba(24, 42, 31, 0.06);
}

.app-icon {
  width: 62px;
  height: 62px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.website-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.item-info {
  flex: 1;
}

.item-info strong {
  font-size: 17px;
  color: #17201a;
}

.item-info p {
  margin: 2px 0 0;
  font-size: 14px;
  color: #6c766f;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.favorite {
  font-size: 24px;
  color: #2f8f2f;
}
.note-icon {
  font-size: 48px;
  color: #408923;
}
.note-preview {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: #fff4bf;
  color: #87ce0c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
</style>
