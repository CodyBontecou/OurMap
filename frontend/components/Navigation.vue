<template>
  <div class="flex">
    <Apps :apps="apps" />
    <AccountToggle :user="user" />
  </div>
</template>

<script>
  export default {
    data: () => {
      return {
        user: {
          name: 'bonteq',
          email: 'bontecouc@gmail.com',
          smallImg:
            'https://lh3.googleusercontent.com/ogw/ADGmqu_QV7NE0fo4V7KJ0CH1T4FrMmSd0dZjB3eSyEw=s32-c-mo',
          img: 'cody.jpg',
        },
      }
    },
    computed: {
      apps() {
        return this.$t('apps')
      },
    },
  }
</script>
