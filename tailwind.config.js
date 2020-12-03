module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
      },
      minHeight : {
        '1/2' : '50%',
        '1/3' : '33.333333%',
        '2/3' : '66.666667%',
        '1/2vh' : '50vh',
        '1/3vh' : '33vh',
        '2/3vh' : '66vh'
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [],
}
