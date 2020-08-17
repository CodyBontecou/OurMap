<template>
  <!--  TODO: Move some of this logic into a 'Navigation' component -->
  <div class="flex">
    <Apps :apps="apps"/>
    <AccountToggle :user="user"/>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      user: {
        name: "bonteq",
        email: "bontecouc@gmail.com",
        smallImg: "https://lh3.googleusercontent.com/ogw/ADGmqu_QV7NE0fo4V7KJ0CH1T4FrMmSd0dZjB3eSyEw=s32-c-mo",
        img: "cody.jpg"
      },
      apps: [
        {
          name: "account",
          img: "cody.jpg",
          to: "#"
        },
        {
          name: "favorites",
          img: "logo.png",
          to: "#"
        },
        {
          name: "blog",
          img: "logo.png",
          to: "#"
        },
        {
          name: "contribute",
          img: "logo.png",
          to: "#"
        },
        {
          name: "about",
          img: "logo.png",
          to: "#"
        }
      ]
    };
  }
};
</script>
