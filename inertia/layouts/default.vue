<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link, Form } from '@adonisjs/inertia/vue'
import { translate } from '~/lib/i18n'

const page = usePage<Data.SharedProps>()
const isAuthPage = computed(() => ['/login', '/signup'].includes(page.url.split('?')[0]))
const locale = computed(() => page.props.locale ?? 'fr')
const t = (key: Parameters<typeof translate>[1]) => translate(locale.value, key)
const showScrollTop = ref(false)
let revealObserver: IntersectionObserver | null = null

const updateScrollTop = () => {
  showScrollTop.value = window.scrollY > 360
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const setupScrollReveal = async () => {
  await nextTick()
  revealObserver?.disconnect()

  const revealItems = Array.from(
    document.querySelectorAll<HTMLElement>(
      'main > *, main .hero, main .cards, main .cards > *, main .form-container'
    )
  ).filter((item) => !item.classList.contains('scroll-top-button'))

  revealItems.forEach((item, index) => {
    item.classList.remove('is-visible')
    item.classList.add('scroll-reveal')
    item.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 80}ms`)
  })

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -70px 0px',
    }
  )

  revealItems.forEach((item) => revealObserver?.observe(item))
}

watch(
  () => page.url,
  () => {
    toast.dismiss()
    setupScrollReveal()
    updateScrollTop()
  }
)

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error)
    }
    if (flashMessages.success) {
      toast.success(flashMessages.success)
    }
  },
  { immediate: true }
)

onMounted(() => {
  setupScrollReveal()
  updateScrollTop()
  window.addEventListener('scroll', updateScrollTop, { passive: true })
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  window.removeEventListener('scroll', updateScrollTop)
})
</script>

<template>
  <header :class="{ 'auth-header': isAuthPage }">
    <div>
      <div>
        <a href="/">
          <img
            class="brand-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Coat_of_Arms_Democratic_Republic_of_Congo.png"
            alt="Logo RDC"
          />
        </a>
      </div>
      <div>
        <nav>
          <template v-if="page.props.user">
            <span>{{ page.props.user.initials }}</span>
            <Form route="session.destroy">
              <button type="submit">{{ t('nav.logout') }}</button>
            </Form>
          </template>
          <template v-else>
            <Link route="new_account.create" class="nav-button nav-button-outline">
              {{ t('nav.signup') }}
            </Link>
            <Link route="session.create" class="nav-button nav-button-primary">
              {{ t('nav.login') }}
            </Link>
          </template>
        </nav>
      </div>
    </div>
  </header>

  <main :class="{ 'auth-page': isAuthPage }">
    <slot />
  </main>

  <button
    type="button"
    class="scroll-top-button"
    :class="{ 'is-visible': showScrollTop }"
    aria-label="Remonter au debut de la page"
    @click="scrollToTop"
  >
    &uarr;
  </button>

  <Toaster position="top-center" rich-colors />
</template>
