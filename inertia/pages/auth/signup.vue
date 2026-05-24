<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { Form } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'
import { translate } from '~/lib/i18n'

const page = usePage<Data.SharedProps>()
const locale = computed(() => page.props.locale ?? 'fr')
const t = (key: Parameters<typeof translate>[1]) => translate(locale.value, key)

const roleOptions = [
  { value: 'inspection', label: 'Inspection' },
  { value: 'director', label: "Direction d'école" },
  { value: 'finance_director', label: 'Direction financière' },
  { value: 'discipline_director', label: 'Direction de discipline' },
  { value: 'teacher', label: 'Enseignant' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Élève' },
]
</script>

<template>
  <div class="form-container auth-panel">
    <div class="auth-panel-header">
      <img
        class="auth-emblem"
        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Coat_of_Arms_Democratic_Republic_of_Congo.png"
        alt="Armoiries de la République démocratique du Congo"
      />
      <h1>{{ t('auth.signup.title') }}</h1>
      <p>{{ t('auth.signup.subtitle') }}</p>
    </div>

    <div>
      <Form route="new_account.store" #default="{ processing, errors }">
        <div>
          <label for="fullName">{{ t('auth.fields.fullName') }}</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            :data-invalid="errors.fullName ? 'true' : undefined"
          />
          <div v-if="errors.fullName">{{ errors.fullName }}</div>
        </div>

        <div>
          <label for="email">{{ t('auth.fields.email') }}</label>
          <input
            type="email"
            name="email"
            id="email"
            autocomplete="email"
            :data-invalid="errors.email ? 'true' : undefined"
          />
          <div v-if="errors.email">{{ errors.email }}</div>
        </div>

        <div>
          <label for="role">{{ t('auth.fields.role') }}</label>
          <select
            name="role"
            id="role"
            :data-invalid="errors.role ? 'true' : undefined"
          >
            <option value="" disabled selected>Sélectionner un rôle</option>
            <option v-for="role in roleOptions" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
          <div v-if="errors.role">{{ errors.role }}</div>
        </div>

        <div>
          <label for="password">{{ t('auth.fields.password') }}</label>
          <input
            type="password"
            name="password"
            id="password"
            autocomplete="new-password"
            :data-invalid="errors.password ? 'true' : undefined"
          />
          <div v-if="errors.password">{{ errors.password }}</div>
        </div>

        <div>
          <label for="passwordConfirmation">{{ t('auth.fields.passwordConfirmation') }}</label>
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            autocomplete="new-password"
            :data-invalid="errors.passwordConfirmation ? 'true' : undefined"
          />
          <div v-if="errors.passwordConfirmation">{{ errors.passwordConfirmation }}</div>
        </div>

        <div>
          <button type="submit" class="button" :disabled="processing">
            {{ t('auth.signup.submit') }}
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
