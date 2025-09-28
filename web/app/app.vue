<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Speaky - Voice Blockchain'
const description = 'Voice-controlled ETH wallet. Check balance, send to ENS.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-lucide-ghost" />

    <UFooter>
      <template #right>
        <div class="flex items-center gap-2">
          <UButton
            to="https://github.com/frankdierolf/speaky"
            target="_blank"
            label="Source Code"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            size="xs"
          />
          <UButton
            to="https://deck.speaky.wtf"
            target="_blank"
            label="Deck"
            icon="i-lucide-presentation"
            color="neutral"
            variant="ghost"
            size="xs"
          />
          <UButton
            to="https://changelog.speaky.wtf"
            target="_blank"
            label="Changelog"
            icon="i-lucide-scroll-text"
            color="neutral"
            variant="ghost"
            size="xs"
          />
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
