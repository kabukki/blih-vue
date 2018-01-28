export const snackbar = {
  data () {
    return {
      snackbar: {
        show: false,
        color: '',
        message: ''
      }
    };
  },
  methods: {
    showSnackbar (color, message) {
      this.snackbar = {
        show: true,
        color,
        message
      };
    }
  }
};
