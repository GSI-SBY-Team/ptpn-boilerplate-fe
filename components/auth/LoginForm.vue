<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Form } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const recapcha = ref("");
const isCapcha = ref(true);
const captcha = ref<string[]>([]);
const captchaLength = 5;
const fontVariationsArr = [20, 24, 28, 32, 36];
const rotationVariationsArr = [-15, -10, 0, 10, 15];
const fontVariations = ref<number[]>([]);
const rotationVariations = ref<number[]>([]);
const captchaCanvas = ref<HTMLCanvasElement | null>(null);

const passwordRules = ref([(v: string) => !!v || "Password wajib diisi"]);
const usernameRules = ref([(v: string) => !!v || "Username wajib diisi"]);

const isHuman = ref(false);
const showCaptcha = ref(false);
const isLoading = ref(false);

const canCheckRobot = computed(() => {
  return username.value.trim() !== "" && password.value.trim() !== "";
});

function getRandomCharacter() {
  const symbols = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function createCaptcha() {
  let tempCaptcha = "";
  fontVariations.value = [];
  rotationVariations.value = [];

  for (let i = 0; i < captchaLength; i++) {
    fontVariations.value.push(
      fontVariationsArr[Math.floor(Math.random() * fontVariationsArr.length)]
    );
    rotationVariations.value.push(
      rotationVariationsArr[
        Math.floor(Math.random() * rotationVariationsArr.length)
      ]
    );
    tempCaptcha += getRandomCharacter();
  }

  captcha.value = tempCaptcha.split("");

  if (captchaCanvas.value) {
    const canvas = captchaCanvas.value;
    const ctx = canvas.getContext("2d");
    canvas.width = 120;
    canvas.height = 40;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 26px Georgia";
    ctx.fillStyle = "#000";
    ctx.fillText(tempCaptcha, 5, 30);
  }
}

function handleRobotCheck() {
  if (!canCheckRobot.value) {
    alert("Silakan isi username dan password terlebih dahulu!");
    isHuman.value = false; 
    return;
  }

  if (isHuman.value) {
    isLoading.value = true;
    setTimeout(() => {
      showCaptcha.value = true;
      isLoading.value = false;
      setTimeout(() => {
        createCaptcha();
      }, 100);
    }, 500);
  } else {
    showCaptcha.value = false;
    recapcha.value = "";
    isCapcha.value = true;
    isLoading.value = false;
  }
}

async function onSubmit() {
  if (!isHuman.value) {
    alert("Silakan centang kotak 'I'm not a robot' terlebih dahulu.");
    return;
  }

  if (showCaptcha.value) {
    const resultString = captcha.value.join("");
    if (recapcha.value.toUpperCase() !== resultString) {
      isCapcha.value = false;
      createCaptcha();
      return;
    } else {
      isCapcha.value = true;
    }
  }

  await authStore
    .login({
      username: username.value,
      password: password.value,
    })
    .catch((err: any) => {
      console.log("err log : ", err);
    });
}

onMounted(() => {
});
</script>

<template>
  <Form @submit="onSubmit" v-slot="{ errors, isSubmitting }" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">
      Username
    </v-label>
    <VTextField
      v-model="username"
      placeholder="Username . . ."
      :rules="usernameRules"
      class="mb-5"
      required
      hide-details="auto"
    ></VTextField>

    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">
      Password
    </v-label>
    <VTextField
      v-model="password"
      placeholder="Password . . ."
      :rules="passwordRules"
      required
      hide-details="auto"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      class="pwdInput mb-4"
    ></VTextField>

    <div class="recaptcha-container mb-4">
      <div v-if="isLoading" class="recaptcha-box loading-state">
        <div class="loading-spinner">
          <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
        </div>
        <span class="loading-text">Memverifikasi...</span>
        <div class="recaptcha-logo">
          <div class="logo-container">
            <div class="recaptcha-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path fill="#34a853" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!showCaptcha" class="recaptcha-box" :class="{ 'disabled': !canCheckRobot }">
        <div class="checkbox-container" @click="canCheckRobot ? (isHuman = !isHuman, handleRobotCheck()) : null">
          <div class="checkbox-wrapper">
            <input 
              type="checkbox" 
              v-model="isHuman" 
              @change="handleRobotCheck"
              class="hidden-checkbox"
              :disabled="!canCheckRobot"
            >
            <div class="custom-checkbox" :class="{ 'checked': isHuman, 'disabled': !canCheckRobot }">
              <v-icon v-if="isHuman" color="success" size="18">mdi-check</v-icon>
            </div>
          </div>
          <span class="checkbox-label" :class="{ 'disabled': !canCheckRobot }">I'm not a robot</span>
        </div>
        <div class="recaptcha-logo">
          <div class="logo-container">
            <div class="recaptcha-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path fill="#34a853" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="recaptcha-box captcha-mode">
        <div class="captcha-content">
          <div class="captcha-header">
            <div class="success-check">
              <v-icon color="success" size="18">mdi-check</v-icon>
            </div>
            <span class="verified-text">Verifikasi captcha</span>
          </div>
          
          <div class="captcha-challenge">
            <v-row no-gutters>
              <v-col cols="8">
                <div class="app-captcha">
                  <div class="np-captcha-container">
                    <div class="np-captcha">
                      <canvas ref="captchaCanvas"></canvas>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="refresh-container">
                  <v-icon @click="createCaptcha" class="refresh-icon">mdi-refresh</v-icon>
                </div>
              </v-col>
            </v-row>

            <v-text-field
              v-model="recapcha"
              placeholder="Masukkan Captcha"
              required
              hide-details="auto"
              dense
              outlined
              class="captcha-input"
              @input="recapcha = recapcha.toUpperCase()"
            />

            <v-alert v-if="!isCapcha" dense variant="text" color="error" class="captcha-error">
              Captcha tidak tepat!
            </v-alert>
          </div>
        </div>
        
        <div class="recaptcha-logo">
          <div class="logo-container">
            <div class="recaptcha-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path fill="#34a853" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="recaptcha-footer">
        <div class="recaptcha-terms">
          <span>reCAPTCHA</span>
          <div class="terms-links">
            <a href="#" class="terms-link">Privacy</a>
            <span class="separator">-</span>
            <a href="#" class="terms-link">Terms</a>
          </div>
        </div>
      </div>
    </div>

    <v-btn
      size="large"
      :loading="isSubmitting"
      color="primary"
      :disabled="!username || !password || !isHuman"
      block
      type="submit"
      flat
      class="mt-4"
    >
      Login
    </v-btn>

    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>

<style lang="css" scoped>
.app-captcha {
  text-align: center;
  color: #000;
}
.np-captcha-container {
  background: #eee;
  background-image: url("/images/backgrounds/captcha-bg.png");
  margin-bottom: 8px;
}
.np-captcha {
  font-size: 5px;
}

.recaptcha-container {
  max-width: 300px;
  margin: 0;
}

.recaptcha-box {
  border: 2px solid #d3d3d3;
  border-radius: 3px;
  background: #f9f9f9;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  min-height: 60px;
}

.recaptcha-box:hover {
  border-color: #4285f4;
}

.loading-state {
  justify-content: flex-start;
  gap: 12px;
}

.loading-spinner {
  margin-right: 8px;
}

.loading-text {
  font-size: 14px;
  color: #666;
  flex: 1;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.checkbox-container:has(.disabled) {
  cursor: not-allowed;
}

.checkbox-wrapper {
  position: relative;
  margin-right: 12px;
}

.hidden-checkbox {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #d3d3d3;
  border-radius: 2px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.custom-checkbox.checked {
  background: #4CAF50;
  border-color: #4CAF50;
}

.custom-checkbox.disabled {
  background: #f5f5f5;
  border-color: #e0e0e0;
  cursor: not-allowed;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
  font-weight: 400;
  user-select: none;
}

.checkbox-label.disabled {
  color: #999;
  cursor: not-allowed;
}

.recaptcha-box.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recaptcha-box.disabled:hover {
  border-color: #d3d3d3;
}

.captcha-mode {
  flex-direction: column;
  align-items: stretch;
  padding: 16px;
  min-height: auto;
}

.captcha-content {
  width: 100%;
  margin-bottom: 12px;
}

.captcha-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.success-check {
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verified-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.captcha-challenge {
  margin-top: 12px;
}

.app-captcha {
  text-align: center;
  color: #000;
}

.np-captcha-container {
  background: #eee;
  background-image: url("/images/backgrounds/captcha-bg.png");
  margin-bottom: 8px;
  border-radius: 4px;
}

.np-captcha {
  font-size: 5px;
}

.refresh-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.refresh-icon {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.refresh-icon:hover {
  background-color: rgba(0,0,0,0.1);
}

.captcha-input {
  margin-top: 8px;
}

.captcha-error {
  margin-top: 8px;
  font-size: 12px;
}

.recaptcha-logo {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recaptcha-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recaptcha-footer {
  margin-top: 8px;
  text-align: right;
}

.recaptcha-terms {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 10px;
  color: #666;
}

.recaptcha-terms > span {
  margin-right: 8px;
  font-weight: 500;
}

.terms-links {
  display: flex;
  align-items: center;
}

.terms-link {
  color: #4285f4;
  text-decoration: none;
  font-size: 10px;
}

.terms-link:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 4px;
  color: #999;
}

.captcha-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}
</style>