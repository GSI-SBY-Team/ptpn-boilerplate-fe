<script setup>
import { Form } from "vee-validate";
import * as Yup from "yup";
function onSubmit(values) {
  alert(JSON.stringify(values, null, 2));
}

function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.classList.add("invalid");
  setTimeout(() => {
    submitBtn.classList.remove("invalid");
  }, 1000);
}

// Using yup to generate a validation schema
// https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

</script>

<template>
  <div>
    <Form
      :validation-schema="schema"
      @invalid-submit="onInvalidSubmit"
    >
    <v-row>
      <v-col cols="12">
      <v-label class="mb-2 font-weight-medium">Email</v-label>
      <FormsFormValidationTextInput
        name="email1"
        type="email" 
        success-message="Got it, we won't spam you!"
      />
    </v-col>
    <v-col cols="12">
      <v-label class="mb-2 font-weight-medium">Password</v-label>
      <FormsFormValidationTextInput
        name="password1"
        type="password"
        success-message="Nice and secure!"
      />
    </v-col>
    <v-col cols="12">
      <div class=" d-sm-flex align-center mb-4">
        <v-checkbox density="compact"  hide-details color="primary" label="Remember this Device"></v-checkbox>
        <div class="ml-auto"><NuxtLink to="javascript:void(0)" class="text-primary text-decoration-none">Forgot password?</NuxtLink></div>
        </div>
      <v-btn type="submit" class="submit-btn mt-2" flat color="primary">Submit</v-btn>
    </v-col>
    </v-row>
    </Form>
  </div>
</template>
