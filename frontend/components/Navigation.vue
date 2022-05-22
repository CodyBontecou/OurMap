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
        // return this.$t('apps')
        return {
          name: 'apps',
          apps: [
            {
              name: 'account',
              img: {
                src: 'cody.jpg',
                alt: '',
              },
              to: 'account',
            },
            {
              name: 'favorites',
              img: {
                src: 'logo.png',
                alt: '',
              },
              to: '#',
            },
            {
              name: 'blog',
              img: {
                src: 'logo.png',
                alt: '',
              },
              to: '#',
            },
            {
              name: 'contribute',
              img: {
                src: 'logo.png',
                alt: '',
              },
              to: '#',
            },
            {
              name: 'about',
              img: {
                src: 'logo.png',
                alt: '',
              },
              to: 'about',
            },
            {
              name: 'contact',
              img: {
                src: 'logo.png',
                alt: '',
              },
              to: '#',
            },
          ],
        }
      },
    },
  }
</script>
