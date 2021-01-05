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
        '8': 8
      },
      minHeight : {
        '1/2' : '50%',
        '1/3' : '33.333333%',
        '2/3' : '66.666667%',
        '1/2vh' : '50vh',
        '1/3vh' : '33vh',
        '2/3vh' : '66vh'
      },
      maxHeight : {
        'max-h-screen-sm' : '640px',
        'max-h-screen-md' : '768px',
        'max-h-screen-lg' : '1024px'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked']
    }
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
  ]
}
