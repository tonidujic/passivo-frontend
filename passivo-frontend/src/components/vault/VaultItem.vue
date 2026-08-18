<template>
  <q-card class="vault-item">
    <div
      :class="[
        'app-icon',
        {
          'password-icon': item.type === 'password',
          'note-icon': item.type === 'note',
          'file-icon': item.type === 'file',
        },
      ]"
    >
      <div v-if="item.type === 'note'" class="note-preview">
        <q-icon name="sticky_note_2" size="28px" />
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

      <q-icon v-else-if="item.type === 'file'" name="description" size="28px" />

      <img
        v-else-if="item.type === 'password' && item.website && faviconUrl"
        :src="faviconUrl"
        class="website-logo"
      />

      <span v-else>
        {{ item.icon }}
      </span>
    </div>

    <div class="item-info">
      <strong>
        {{ item.title }}
      </strong>

      <p>
        {{ item.subtitle }}
      </p>

      <q-badge
        v-if="item.type === 'password' && item.website"
        outline
        color="primary"
        class="q-mt-xs"
      >
        {{ cleanWebsite(item.website) }}
      </q-badge>

      <q-badge v-if="item.type === 'file'" outline color="secondary" class="q-mt-xs">
        {{ getFileType(item) }}
      </q-badge>

      <q-badge v-if="item.type === 'note'" outline color="accent" class="q-mt-xs"> NOTE </q-badge>
    </div>

    <div class="item-actions">
      <q-btn
        flat
        round
        :icon="item.favorite ? 'star' : 'star_border'"
        color="primary"
        class="favorite-btn"
        @click="$emit('toggle-favorite', item.id)"
      />

      <q-btn flat round dense icon="more_vert" class="more-btn">
        <q-menu anchor="bottom right" self="top right" class="vault-menu">
          <q-list>
            <template v-if="item.type === 'password'">
              <q-item clickable v-close-popup class="menu-item" @click="$emit('click-more', item)">
                <q-item-section avatar>
                  <div class="menu-icon">
                    <q-icon name="lock_open" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Open</div>

                  <div class="menu-subtitle">Reveal saved password</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup class="menu-item" @click="copyPassword">
                <q-item-section avatar>
                  <div class="menu-icon secondary-icon">
                    <q-icon name="content_copy" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Copy password</div>

                  <div class="menu-subtitle">Copy secret to clipboard</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup class="menu-item" @click="copyUsername">
                <q-item-section avatar>
                  <div class="menu-icon accent-icon">
                    <q-icon name="person" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Copy username</div>

                  <div class="menu-subtitle">Copy login username</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup class="menu-item" @click="openWebsite">
                <q-item-section avatar>
                  <div class="menu-icon secondary-icon">
                    <q-icon name="open_in_new" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Open website</div>

                  <div class="menu-subtitle">Go to saved website</div>
                </q-item-section>
              </q-item>
            </template>

            <template v-if="item.type === 'file'">
              <q-item clickable v-close-popup class="menu-item" @click="$emit('click-more', item)">
                <q-item-section avatar>
                  <div class="menu-icon secondary-icon">
                    <q-icon name="visibility" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Preview</div>

                  <div class="menu-subtitle">Open encrypted file</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup class="menu-item" @click="downloadFile">
                <q-item-section avatar>
                  <div class="menu-icon">
                    <q-icon name="download" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Download</div>

                  <div class="menu-subtitle">Save file to device</div>
                </q-item-section>
              </q-item>
            </template>

            <template v-if="item.type === 'note'">
              <q-item clickable v-close-popup class="menu-item" @click="$emit('click-more', item)">
                <q-item-section avatar>
                  <div class="menu-icon accent-icon">
                    <q-icon name="sticky_note_2" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <div class="menu-title">Open note</div>

                  <div class="menu-subtitle">Read encrypted note</div>
                </q-item-section>
              </q-item>
            </template>

            <q-separator spaced />

            <q-item clickable v-close-popup class="menu-item delete-menu-item" @click="deleteItem">
              <q-item-section avatar>
                <div class="menu-icon delete-menu-icon">
                  <q-icon name="delete" />
                </div>
              </q-item-section>

              <q-item-section>
                <div class="menu-title delete-menu-title">Delete</div>

                <div class="menu-subtitle">Remove from vault</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits([
  'click-more',
  'toggle-favorite',
  'copy-password',
  'copy-username',
  'open-website',
  'delete-item',
  'download-file',
])

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const item = props.item

function copyUsername() {
  emit('copy-username', props.item)
}

function copyPassword() {
  emit('copy-password', props.item)
}

function openWebsite() {
  emit('open-website', props.item)
}

function deleteItem() {
  emit('delete-item', props.item)
}

function downloadFile() {
  emit('download-file', props.item)
}

const faviconUrl = computed(() => {
  if (!item.website) {
    return null
  }

  const domain = cleanWebsite(item.website)

  if (!domain.includes('.')) {
    return null
  }

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
})

function cleanWebsite(website) {
  if (!website) {
    return ''
  }

  return website.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

function getFileType(item) {
  const file = item.subtitle?.toLowerCase()

  if (file?.includes('.pdf')) {
    return 'PDF'
  }

  if (file?.includes('.txt')) {
    return 'TEXT'
  }

  if (file?.includes('.png') || file?.includes('.jpg') || file?.includes('.jpeg')) {
    return 'IMAGE'
  }

  return 'FILE'
}
</script>

<style scoped>
.vault-item {
  min-height: 112px;

  padding: 18px 22px;

  border-radius: 22px;

  display: flex;
  align-items: center;

  gap: 18px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  color: var(--app-text);

  box-shadow: 0 14px 36px color-mix(in srgb, var(--q-primary) 6%, transparent);

  transition:
    transform 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.vault-item:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--q-primary) 30%, var(--app-border));

  box-shadow: 0 18px 45px color-mix(in srgb, var(--q-primary) 10%, transparent);
}

.app-icon {
  width: 62px;
  height: 62px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  flex-shrink: 0;

  color: var(--app-text);
}

.password-icon {
  border-radius: 50%;
}

.website-logo {
  width: 54px;
  height: 54px;

  border-radius: 50%;

  object-fit: cover;

  background: var(--app-surface-2);

  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.file-icon {
  border-radius: 16px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-secondary) 18%, transparent),
    color-mix(in srgb, var(--q-primary) 11%, transparent)
  );

  color: var(--q-secondary);

  border: 1px solid color-mix(in srgb, var(--q-secondary) 16%, transparent);
}

.preview-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 16px;
}

.pdf-preview {
  width: 100%;
  height: 100%;

  border: none;

  pointer-events: none;

  border-radius: 16px;
}

.note-icon {
  border-radius: 16px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-accent) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 11%, transparent)
  );

  color: var(--q-accent);

  border: 1px solid color-mix(in srgb, var(--q-accent) 16%, transparent);
}

.note-preview {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  flex: 1;

  min-width: 0;
}

.item-info strong {
  display: block;

  font-size: 17px;
  font-weight: 900;

  color: var(--app-text);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info p {
  margin: 3px 0 0;

  font-size: 14px;

  color: var(--app-text-muted);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info :deep(.q-badge) {
  font-weight: 700;
}

.item-actions {
  display: flex;
  align-items: center;

  gap: 4px;

  flex-shrink: 0;
}

.favorite-btn {
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.08);

  background: color-mix(in srgb, var(--q-primary) 10%, transparent);
}

.more-btn {
  color: var(--app-text-muted);
}

.more-btn:hover {
  color: var(--q-secondary);

  background: color-mix(in srgb, var(--q-secondary) 10%, transparent);
}
</style>

<style>
.vault-menu {
  width: 290px;

  padding: 12px;

  border-radius: 24px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 3%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  color: var(--app-text);

  backdrop-filter: blur(18px);

  box-shadow: 0 22px 70px color-mix(in srgb, var(--q-primary) 10%, rgba(0, 0, 0, 0.15));
}

.vault-menu .q-list {
  padding: 0;
}

.vault-menu .menu-item {
  min-height: 76px;

  padding: 12px;

  border-radius: 18px;

  margin-bottom: 8px;

  color: var(--app-text);

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.vault-menu .menu-item:hover {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--q-primary) 11%, transparent),
    color-mix(in srgb, var(--q-secondary) 8%, transparent)
  );

  transform: translateX(2px);
}

.vault-menu .menu-icon {
  width: 46px;
  height: 46px;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 11%, transparent)
  );

  color: var(--q-primary);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
}

.vault-menu .secondary-icon {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-secondary) 18%, transparent),
    color-mix(in srgb, var(--q-primary) 8%, transparent)
  );

  color: var(--q-secondary);
}

.vault-menu .accent-icon {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-accent) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 8%, transparent)
  );

  color: var(--q-accent);
}

.vault-menu .menu-title {
  font-size: 15px;

  font-weight: 900;

  color: var(--app-text);
}

.vault-menu .menu-subtitle {
  margin-top: 3px;

  font-size: 12px;

  color: var(--app-text-muted);
}

.vault-menu .q-separator {
  background: var(--app-border);
}

.vault-menu .delete-menu-item:hover {
  background: color-mix(in srgb, #ef4444 10%, transparent);
}

.vault-menu .delete-menu-icon {
  background: color-mix(in srgb, #ef4444 12%, transparent);

  color: #ef4444;
}

.vault-menu .delete-menu-title {
  color: #ef4444;
}
</style>
