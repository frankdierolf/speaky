<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Speaky - Voice Chat with AI'
const description = 'Experience real-time voice interaction with ChatGPT. Ask it to show toast notifications and see the magic happen!'

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
          <UButton to="https://github.com/frankdierolf/speaky" target="_blank" label="Source Code"
            icon="i-simple-icons-github" color="neutral" variant="ghost" size="xs" />
          <UButton to="https://deck.speaky.wtf" target="_blank" label="Deck" icon="i-lucide-presentation"
            color="neutral" variant="ghost" size="xs" />
          <UButton to="https://changelog.speaky.wtf" target="_blank" label="Changelog" icon="i-lucide-scroll-text"
            color="neutral" variant="ghost" size="xs" />
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
