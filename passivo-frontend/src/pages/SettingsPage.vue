<template>
  <q-page class="settings-page q-pa-lg">
    <div class="settings-wrapper">
      <q-card flat bordered class="appearance-card">
        <q-card-section class="row q-col-gutter-xl items-start">
          <div class="col-12 col-md-7">
            <div class="section-eyebrow">CUSTOMIZATION</div>

            <div class="section-title">Appearance</div>

            <div class="section-subtitle">
              Personalize Passivo with light or dark mode and choose a color combination that
              applies across the whole application.
            </div>

            <q-btn-toggle
              v-model="theme.mode"
              class="mode-toggle q-mt-md"
              no-caps
              unelevated
              toggle-color="primary"
              text-color="primary"
              :options="[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ]"
              @update:model-value="theme.setMode"
            />
          </div>

          <div class="col-12 col-md-5">
            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-dot"></div>
                <div class="preview-dot"></div>
                <div class="preview-dot"></div>
              </div>

              <div class="preview-gradient"></div>

              <div class="preview-content">
                <div class="preview-pill preview-pill-primary"></div>
                <div class="preview-pill preview-pill-secondary"></div>

                <div class="preview-line"></div>
                <div class="preview-line short"></div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="preset-title">Theme presets</div>

          <div class="preset-subtitle">
            Pick a full color mix, for example green-blue or red-blue.
          </div>

          <div class="theme-grid">
            <button
              v-for="preset in theme.allPresets"
              :key="preset.key"
              class="theme-option"
              :class="{
                active: theme.presetKey === preset.key,
              }"
              @click="theme.setPreset(preset.key)"
            >
              <div class="theme-option-top">
                <div class="theme-swatches">
                  <span
                    :style="{
                      background: preset.primary,
                    }"
                  ></span>

                  <span
                    :style="{
                      background: preset.secondary,
                    }"
                  ></span>

                  <span
                    :style="{
                      background: preset.accent,
                    }"
                  ></span>
                </div>

                <q-icon
                  v-if="theme.presetKey === preset.key"
                  name="check_circle"
                  color="primary"
                  size="20px"
                />
              </div>

              <div class="theme-name">
                {{ preset.name }}
              </div>

              <div
                class="theme-gradient"
                :style="{
                  background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                }"
              ></div>
            </button>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="profile-card q-mt-lg">
        <q-card-section class="profile-header">
          <div class="profile-header-left">
            <div class="profile-icon">
              <q-icon name="person" />
            </div>

            <div>
              <div class="section-eyebrow">PROFILE</div>

              <div class="profile-title">Profile picture</div>

              <div class="profile-subtitle">
                Choose a profile picture that will appear in your Passivo account.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="profile-content">
          <div class="profile-picture-area">
            <div class="profile-preview-wrapper">
              <q-avatar size="110px" class="profile-preview">
                <img v-if="profileImagePreview" :src="profileImagePreview" />

                <q-icon v-else name="person" size="55px" color="white" />
              </q-avatar>

              <div class="profile-status">
                <strong>
                  {{ auth.user?.fullName || 'User' }}
                </strong>

                <span> JPG, PNG or WEBP </span>
              </div>
            </div>

            <div class="profile-picture-actions">
              <input
                ref="profileFileInput"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                @change="handleProfileImage"
              />

              <q-btn
                unelevated
                no-caps
                icon="photo_camera"
                label="Choose image"
                class="choose-image-btn"
                @click="openProfilePicker"
              />

              <q-btn
                v-if="profileImagePreview"
                outline
                no-caps
                icon="delete_outline"
                label="Remove"
                class="remove-image-btn"
                @click="removeProfileImage"
              />
            </div>
          </div>

          <q-banner v-if="profileImageError" rounded class="profile-error q-mt-lg">
            <div class="banner-content">
              <q-icon name="error_outline" size="21px" />

              {{ profileImageError }}
            </div>
          </q-banner>

          <q-banner v-if="profileImageSuccess" rounded class="profile-success q-mt-lg">
            <div class="banner-content">
              <q-icon name="check_circle" size="21px" />

              {{ profileImageSuccess }}
            </div>
          </q-banner>

          <div class="profile-save-row">
            <q-btn
              unelevated
              no-caps
              icon="save"
              label="Save profile picture"
              class="save-profile-btn"
              :disable="!profileImageChanged"
              @click="saveProfileImage"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="password-card q-mt-lg">
        <q-card-section class="password-header">
          <div class="password-header-left">
            <div class="security-icon">
              <q-icon name="lock_reset" />
            </div>

            <div>
              <div class="section-eyebrow">SECURITY</div>

              <div class="password-title">Change your password</div>

              <div class="password-subtitle">
                Verify your current password before choosing a new one.
              </div>
            </div>
          </div>

          <div v-if="currentPasswordVerified" class="verified-badge">
            <q-icon name="verified" />

            Identity verified
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="password-content">
          <q-banner v-if="passwordSuccess" rounded class="password-success q-mb-lg">
            <div class="banner-content">
              <q-icon name="check_circle" size="22px" />

              <span>
                {{ passwordSuccess }}
              </span>
            </div>
          </q-banner>

          <div v-if="!currentPasswordVerified" class="password-step">
            <div class="step-header">
              <div class="step-number">1</div>

              <div>
                <div class="step-title">Verify current password</div>

                <div class="step-description">
                  Enter your current Passivo password to verify your identity.
                </div>
              </div>
            </div>

            <div class="step-body">
              <q-input
                v-model="currentPassword"
                outlined
                color="primary"
                label="Current password"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="password-input"
                @keyup.enter="verifyCurrentPassword"
              >
                <template #prepend>
                  <q-icon name="lock_outline" />
                </template>

                <template #append>
                  <q-icon
                    :name="showCurrentPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showCurrentPassword = !showCurrentPassword"
                  />
                </template>
              </q-input>

              <q-banner v-if="passwordError" rounded class="password-error q-mt-md">
                <div class="banner-content">
                  <q-icon name="error_outline" size="21px" />

                  <span>
                    {{ passwordError }}
                  </span>
                </div>
              </q-banner>

              <div class="verify-footer">
                <div class="security-note">
                  <q-icon name="shield" />

                  <span> Your password is never stored in plaintext. </span>
                </div>

                <q-btn
                  unelevated
                  no-caps
                  icon="verified_user"
                  label="Verify password"
                  class="verify-btn"
                  :loading="verifyingPassword"
                  :disable="!currentPassword"
                  @click="verifyCurrentPassword"
                />
              </div>
            </div>
          </div>

          <div v-else class="password-step">
            <div class="step-header">
              <div class="step-number verified">
                <q-icon name="check" />
              </div>

              <div>
                <div class="step-title">Choose your new password</div>

                <div class="step-description">
                  Create a strong password that you haven't used before.
                </div>
              </div>
            </div>

            <div class="step-body">
              <div class="password-fields">
                <q-input
                  v-model="newPassword"
                  outlined
                  color="primary"
                  label="New password"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="password-input"
                >
                  <template #prepend>
                    <q-icon name="key" />
                  </template>

                  <template #append>
                    <q-icon
                      :name="showNewPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showNewPassword = !showNewPassword"
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="confirmNewPassword"
                  outlined
                  color="primary"
                  label="Confirm new password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="password-input"
                >
                  <template #prepend>
                    <q-icon name="key" />
                  </template>

                  <template #append>
                    <q-icon
                      :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showConfirmPassword = !showConfirmPassword"
                    />
                  </template>
                </q-input>
              </div>

              <div class="requirements-card">
                <div class="requirements-title">Password requirements</div>

                <div class="requirements-grid">
                  <div
                    class="requirement"
                    :class="{
                      valid: passwordChecks.length,
                    }"
                  >
                    <q-icon
                      :name="passwordChecks.length ? 'check_circle' : 'radio_button_unchecked'"
                    />

                    At least 8 characters
                  </div>

                  <div
                    class="requirement"
                    :class="{
                      valid: passwordChecks.uppercase,
                    }"
                  >
                    <q-icon
                      :name="passwordChecks.uppercase ? 'check_circle' : 'radio_button_unchecked'"
                    />

                    One uppercase letter
                  </div>

                  <div
                    class="requirement"
                    :class="{
                      valid: passwordChecks.lowercase,
                    }"
                  >
                    <q-icon
                      :name="passwordChecks.lowercase ? 'check_circle' : 'radio_button_unchecked'"
                    />

                    One lowercase letter
                  </div>

                  <div
                    class="requirement"
                    :class="{
                      valid: passwordChecks.number,
                    }"
                  >
                    <q-icon
                      :name="passwordChecks.number ? 'check_circle' : 'radio_button_unchecked'"
                    />

                    One number
                  </div>

                  <div
                    class="requirement"
                    :class="{
                      valid: passwordChecks.special,
                    }"
                  >
                    <q-icon
                      :name="passwordChecks.special ? 'check_circle' : 'radio_button_unchecked'"
                    />

                    One special character
                  </div>

                  <div
                    class="requirement"
                    :class="{
                      valid: passwordsMatch,
                    }"
                  >
                    <q-icon :name="passwordsMatch ? 'check_circle' : 'radio_button_unchecked'" />

                    Passwords match
                  </div>
                </div>
              </div>

              <q-banner v-if="passwordError" rounded class="password-error q-mt-lg">
                <div class="banner-content">
                  <q-icon name="error_outline" size="21px" />

                  <span>
                    {{ passwordError }}
                  </span>
                </div>
              </q-banner>

              <div class="password-actions">
                <q-btn
                  flat
                  no-caps
                  label="Cancel"
                  class="cancel-btn"
                  @click="resetPasswordChange"
                />

                <q-btn
                  unelevated
                  no-caps
                  icon="lock_reset"
                  label="Change password"
                  class="change-password-btn"
                  :loading="changingPassword"
                  :disable="!newPasswordValid || !passwordsMatch"
                  @click="changePassword"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeStore } from 'src/stores/themeStore'
import { useAuthStore } from 'src/stores/authStore'

const theme = useThemeStore()
const auth = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

const currentPasswordVerified = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const verifyingPassword = ref(false)
const changingPassword = ref(false)

const passwordError = ref('')
const passwordSuccess = ref('')

const profileFileInput = ref(null)

const profileImagePreview = ref('')
const profileImageChanged = ref(false)

const profileImageError = ref('')
const profileImageSuccess = ref('')

const profileStorageKey = computed(() => {
  const userKey = auth.user?.id || auth.user?._id || auth.user?.email

  if (!userKey) {
    return null
  }

  return `passivoProfileImage:${userKey}`
})

function openProfilePicker() {
  profileFileInput.value?.click()
}

function handleProfileImage(event) {
  profileImageError.value = ''
  profileImageSuccess.value = ''

  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    profileImageError.value = 'Only JPG, PNG and WEBP images are allowed'

    return
  }

  if (file.size > 2 * 1024 * 1024) {
    profileImageError.value = 'Profile image must be smaller than 2 MB'

    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    profileImagePreview.value = reader.result
    profileImageChanged.value = true
  }

  reader.readAsDataURL(file)
}

function saveProfileImage() {
  profileImageError.value = ''
  profileImageSuccess.value = ''

  if (!profileImagePreview.value || !profileStorageKey.value) {
    return
  }

  localStorage.setItem(profileStorageKey.value, profileImagePreview.value)

  if (auth.user) {
    auth.user.profileImage = profileImagePreview.value
  }

  profileImageChanged.value = false

  profileImageSuccess.value = 'Profile picture saved successfully'
}

function removeProfileImage() {
  profileImagePreview.value = ''

  if (profileStorageKey.value) {
    localStorage.removeItem(profileStorageKey.value)
  }

  if (auth.user) {
    auth.user.profileImage = null
  }

  if (profileFileInput.value) {
    profileFileInput.value.value = ''
  }

  profileImageChanged.value = false
  profileImageError.value = ''

  profileImageSuccess.value = 'Profile picture removed'
}

watch(
  profileStorageKey,
  (key) => {
    localStorage.removeItem('passivoProfileImage')

    profileImagePreview.value = ''
    profileImageChanged.value = false
    profileImageError.value = ''
    profileImageSuccess.value = ''

    if (!key) {
      if (auth.user) {
        auth.user.profileImage = null
      }

      return
    }

    const savedImage = localStorage.getItem(key)

    if (savedImage) {
      profileImagePreview.value = savedImage

      if (auth.user) {
        auth.user.profileImage = savedImage
      }
    } else {
      if (auth.user) {
        auth.user.profileImage = null
      }
    }
  },
  {
    immediate: true,
  },
)

const passwordChecks = computed(() => {
  return {
    length: newPassword.value.length >= 8,

    uppercase: /[A-Z]/.test(newPassword.value),

    lowercase: /[a-z]/.test(newPassword.value),

    number: /[0-9]/.test(newPassword.value),

    special: /[^A-Za-z0-9]/.test(newPassword.value),
  }
})

const newPasswordValid = computed(() => {
  return Object.values(passwordChecks.value).every(Boolean)
})

const passwordsMatch = computed(() => {
  return newPassword.value.length > 0 && newPassword.value === confirmNewPassword.value
})

async function verifyCurrentPassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!currentPassword.value) {
    passwordError.value = 'Enter your current password'

    return
  }

  verifyingPassword.value = true

  try {
    await auth.verifyCurrentPassword(currentPassword.value)

    currentPasswordVerified.value = true
  } catch (err) {
    passwordError.value =
      err.response?.data?.message || err.message || 'Current password is incorrect'
  } finally {
    verifyingPassword.value = false
  }
}

async function changePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!newPasswordValid.value) {
    passwordError.value = 'Your new password does not meet all security requirements'

    return
  }

  if (!passwordsMatch.value) {
    passwordError.value = 'Passwords do not match'

    return
  }

  if (currentPassword.value === newPassword.value) {
    passwordError.value = 'New password must be different from your current password'

    return
  }

  changingPassword.value = true

  try {
    await auth.changePassword({
      currentPassword: currentPassword.value,

      newPassword: newPassword.value,
    })

    passwordSuccess.value = 'Your password has been changed successfully.'

    currentPassword.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''

    currentPasswordVerified.value = false

    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  } catch (err) {
    passwordError.value = err.response?.data?.message || err.message || 'Password change failed'
  } finally {
    changingPassword.value = false
  }
}

function resetPasswordChange() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''

  currentPasswordVerified.value = false

  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false

  passwordError.value = ''
  passwordSuccess.value = ''
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;

  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--q-primary) 8%, transparent),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom left,
      color-mix(in srgb, var(--q-secondary) 6%, transparent),
      transparent 30%
    ),
    var(--app-page-bg);

  color: var(--app-text);
}

.settings-wrapper {
  max-width: 1040px;

  padding-bottom: 50px;
}

.appearance-card,
.profile-card,
.password-card {
  border-radius: 24px;

  background: linear-gradient(
    145deg,
    var(--app-surface),
    color-mix(in srgb, var(--q-primary) 2%, var(--app-surface))
  );

  border: 1px solid var(--app-border);

  color: var(--app-text);

  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.section-eyebrow {
  margin-bottom: 10px;

  color: var(--q-secondary);

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 1.2px;
}

.section-title {
  margin-bottom: 10px;

  color: var(--app-text);

  font-size: 32px;
  font-weight: 900;

  line-height: 1.1;
}

.section-subtitle {
  max-width: 560px;

  color: var(--app-text-muted);

  font-size: 15px;

  line-height: 1.7;
}

.mode-toggle {
  overflow: hidden;

  border-radius: 14px;

  background: var(--app-surface-2);

  border: 1px solid var(--app-border);
}

.preview-card {
  min-height: 220px;

  padding: 16px;

  border-radius: 22px;

  background: var(--app-surface-2);

  border: 1px solid var(--app-border);
}

.preview-header {
  display: flex;

  gap: 8px;

  margin-bottom: 14px;
}

.preview-dot {
  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: var(--app-text-muted);
}

.preview-gradient {
  height: 78px;

  margin-bottom: 16px;

  border-radius: 18px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));
}

.preview-content {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.preview-pill {
  height: 14px;

  border-radius: 999px;
}

.preview-pill-primary {
  width: 70%;

  background: var(--q-primary);
}

.preview-pill-secondary {
  width: 50%;

  background: var(--q-secondary);
}

.preview-line {
  height: 10px;

  border-radius: 999px;

  background: color-mix(in srgb, var(--app-text-muted) 45%, transparent);
}

.preview-line.short {
  width: 65%;
}

.preset-title {
  margin-bottom: 4px;

  color: var(--app-text);

  font-size: 18px;
  font-weight: 800;
}

.preset-subtitle {
  margin-bottom: 18px;

  color: var(--app-text-muted);

  font-size: 14px;
}

.theme-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));

  gap: 16px;
}

.theme-option {
  appearance: none;

  padding: 16px;

  border-radius: 18px;

  border: 1px solid var(--app-border);

  background: linear-gradient(145deg, var(--app-surface), var(--app-surface-2));

  color: var(--app-text);

  cursor: pointer;

  text-align: left;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.theme-option:hover {
  transform: translateY(-2px);

  border-color: var(--q-primary);

  box-shadow: 0 10px 22px color-mix(in srgb, var(--q-primary) 10%, transparent);
}

.theme-option.active {
  border-color: var(--q-primary);

  box-shadow: 0 0 0 2px color-mix(in srgb, var(--q-primary) 25%, transparent);
}

.theme-option-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.theme-swatches {
  display: flex;

  gap: 8px;
}

.theme-swatches span {
  width: 20px;
  height: 20px;

  border-radius: 50%;

  border: 1px solid color-mix(in srgb, var(--app-text) 15%, transparent);
}

.theme-name {
  margin-bottom: 12px;

  color: var(--app-text);

  font-size: 15px;
  font-weight: 800;
}

.theme-gradient {
  height: 60px;

  border-radius: 14px;

  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.profile-header {
  padding: 26px;
}

.profile-header-left {
  display: flex;
  align-items: center;

  gap: 18px;
}

.profile-icon {
  width: 62px;
  height: 62px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 20px;

  color: var(--q-primary);

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 14%, transparent)
  );

  font-size: 29px;
}

.profile-title {
  margin-bottom: 5px;

  color: var(--app-text);

  font-size: 25px;
  font-weight: 900;
}

.profile-subtitle {
  color: var(--app-text-muted);

  font-size: 14px;
}

.profile-content {
  padding: 30px;
}

.profile-picture-area {
  max-width: 760px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 30px;

  padding: 24px;

  border-radius: 20px;

  background: var(--app-surface-2);

  border: 1px solid var(--app-border);
}

.profile-preview-wrapper {
  display: flex;
  align-items: center;

  gap: 20px;
}

.profile-preview {
  flex-shrink: 0;

  padding: 0 !important;

  overflow: hidden;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-size: 36px;
  font-weight: 900;

  border: 4px solid color-mix(in srgb, var(--q-primary) 18%, transparent);

  box-shadow: 0 12px 28px color-mix(in srgb, var(--q-primary) 15%, transparent);
}

.profile-preview :deep(.q-avatar__content) {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 !important;

  overflow: hidden;

  border-radius: 50%;
}

.profile-preview :deep(img) {
  width: 100% !important;
  height: 100% !important;

  min-width: 100%;
  min-height: 100%;

  max-width: none;

  display: block;

  object-fit: cover !important;
  object-position: center center;

  border-radius: 50%;
}

.profile-status {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.profile-status strong {
  color: var(--app-text);

  font-size: 17px;
  font-weight: 900;
}

.profile-status span {
  color: var(--app-text-muted);

  font-size: 12px;
}

.profile-picture-actions {
  display: flex;
  align-items: center;

  gap: 10px;
}

.choose-image-btn,
.save-profile-btn {
  min-height: 46px;

  padding: 0 20px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;

  box-shadow: 0 10px 24px color-mix(in srgb, var(--q-primary) 20%, transparent);
}

.remove-image-btn {
  min-height: 46px;

  border-radius: 14px;

  color: #ef4444;
}

.profile-save-row {
  max-width: 760px;

  display: flex;
  justify-content: flex-end;

  margin-top: 20px;
}

.profile-error,
.profile-success {
  max-width: 760px;

  border-radius: 14px;
}

.profile-error {
  color: #ef4444;

  background: color-mix(in srgb, #ef4444 9%, var(--app-surface));

  border: 1px solid color-mix(in srgb, #ef4444 18%, transparent);
}

.profile-success {
  color: var(--q-primary);

  background: color-mix(in srgb, var(--q-primary) 10%, var(--app-surface));

  border: 1px solid color-mix(in srgb, var(--q-primary) 20%, transparent);
}

.password-header {
  padding: 26px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
}

.password-header-left {
  display: flex;
  align-items: center;

  gap: 18px;
}

.security-icon {
  width: 62px;
  height: 62px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 20px;

  color: var(--q-primary);

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 14%, transparent)
  );

  font-size: 29px;
}

.password-title {
  margin-bottom: 5px;

  color: var(--app-text);

  font-size: 25px;
  font-weight: 900;
}

.password-subtitle {
  color: var(--app-text-muted);

  font-size: 14px;
}

.verified-badge {
  display: flex;
  align-items: center;

  gap: 6px;

  padding: 8px 13px;

  border-radius: 999px;

  color: var(--q-primary);

  background: color-mix(in srgb, var(--q-primary) 12%, transparent);

  border: 1px solid color-mix(in srgb, var(--q-primary) 18%, transparent);

  font-size: 12px;
  font-weight: 800;
}

.password-content {
  padding: 30px;
}

.password-step {
  max-width: 760px;
}

.step-header {
  display: flex;
  align-items: center;

  gap: 14px;

  margin-bottom: 26px;
}

.step-number {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  color: white;

  font-weight: 900;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  box-shadow: 0 8px 18px color-mix(in srgb, var(--q-primary) 20%, transparent);
}

.step-title {
  color: var(--app-text);

  font-size: 17px;
  font-weight: 900;
}

.step-description {
  margin-top: 3px;

  color: var(--app-text-muted);

  font-size: 13px;
}

.step-body {
  padding-left: 54px;
}

.password-fields {
  display: grid;

  gap: 16px;

  max-width: 620px;
}

.password-input {
  max-width: 620px;
}

.password-input :deep(.q-field__control) {
  border-radius: 14px;
}

.password-input :deep(.q-field__prepend) {
  color: var(--q-primary);
}

.password-input :deep(.q-field__append) {
  color: var(--app-text-muted);
}

.verify-footer {
  max-width: 620px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-top: 22px;
}

.security-note {
  display: flex;
  align-items: center;

  gap: 7px;

  color: var(--app-text-muted);

  font-size: 12px;
}

.security-note .q-icon {
  color: var(--q-secondary);
}

.verify-btn,
.change-password-btn {
  min-height: 48px;

  padding: 0 22px;

  border-radius: 14px;

  background: linear-gradient(135deg, var(--q-primary), var(--q-secondary));

  color: white;

  font-weight: 800;

  box-shadow: 0 12px 26px color-mix(in srgb, var(--q-primary) 20%, transparent);
}

.requirements-card {
  max-width: 620px;

  margin-top: 20px;

  padding: 18px;

  border-radius: 18px;

  background: var(--app-surface-2);

  border: 1px solid var(--app-border);
}

.requirements-title {
  margin-bottom: 13px;

  color: var(--app-text);

  font-size: 13px;
  font-weight: 900;
}

.requirements-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 11px 18px;
}

.requirement {
  display: flex;
  align-items: center;

  gap: 7px;

  color: var(--app-text-muted);

  font-size: 12px;
  font-weight: 700;

  transition: color 0.2s ease;
}

.requirement .q-icon {
  font-size: 18px;
}

.requirement.valid {
  color: var(--q-primary);
}

.password-actions {
  max-width: 620px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 12px;

  margin-top: 25px;
}

.cancel-btn {
  min-height: 48px;

  border-radius: 14px;

  color: var(--app-text-muted);

  font-weight: 700;
}

.password-error,
.password-success {
  max-width: 620px;

  border-radius: 14px;
}

.password-error {
  color: #ef4444;

  background: color-mix(in srgb, #ef4444 9%, var(--app-surface));

  border: 1px solid color-mix(in srgb, #ef4444 18%, transparent);
}

.password-success {
  color: var(--q-primary);

  background: color-mix(in srgb, var(--q-primary) 10%, var(--app-surface));

  border: 1px solid color-mix(in srgb, var(--q-primary) 20%, transparent);
}

.banner-content {
  display: flex;
  align-items: center;

  gap: 9px;

  font-weight: 700;
}

:deep(.q-separator) {
  background: var(--app-border);
}

:deep(.q-btn-toggle .q-btn) {
  color: var(--app-text);
}

:deep(.q-btn-toggle .q-btn--active) {
  color: white !important;
}

@media (max-width: 750px) {
  .profile-picture-area {
    align-items: flex-start;

    flex-direction: column;
  }

  .profile-picture-actions {
    width: 100%;

    flex-direction: column;
  }

  .choose-image-btn,
  .remove-image-btn,
  .save-profile-btn {
    width: 100%;
  }

  .password-header {
    align-items: flex-start;

    flex-direction: column;
  }

  .step-body {
    padding-left: 0;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
  }

  .verify-footer {
    flex-direction: column;

    align-items: stretch;
  }

  .password-actions {
    flex-direction: column-reverse;
  }

  .verify-btn,
  .change-password-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
