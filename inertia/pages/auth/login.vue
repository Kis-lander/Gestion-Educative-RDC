<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { Form } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'
import { translate } from '~/lib/i18n'

const page = usePage<Data.SharedProps>()
const locale = computed(() => page.props.locale ?? 'fr')
const t = (key: Parameters<typeof translate>[1]) => translate(locale.value, key)
</script>

<template>
  <div class="form-container auth-panel">
    <div class="auth-panel-header">
      <img
        class="auth-emblem"
        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Coat_of_Arms_Democratic_Republic_of_Congo.png"
        alt="Armoiries de la République démocratique du Congo"
      />
      <h1>{{ t('auth.login.title') }}</h1>
      <p>{{ t('auth.login.subtitle') }}</p>
    </div>

    <div>
      <Form route="session.store" #default="{ processing, errors }">
        <div>
          <label for="email">{{ t('auth.fields.email') }}</label>
          <input
            type="email"
            name="email"
            id="email"
            autocomplete="username"
            :data-invalid="errors.email ? 'true' : undefined"
          />
          <div v-if="errors.email">{{ errors.email }}</div>
        </div>

        <div>
          <label for="password">{{ t('auth.fields.password') }}</label>
          <input
            type="password"
            name="password"
            id="password"
            autocomplete="current-password"
            :data-invalid="errors.password ? 'true' : undefined"
          />
          <div v-if="errors.password">{{ errors.password }}</div>
        </div>

        <div>
          <button type="submit" class="button" :disabled="processing">
            {{ t('auth.login.submit') }}
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
