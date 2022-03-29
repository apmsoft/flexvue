module.exports = {
    // darkMode: 'media',
    content: [
    "./_topadm/t1/**/*.{html,js}",
    "./v1/**/*.{html,js}"
    ],
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
            },
            colors :{
                'blue-light' : '#EFF7FD',
                'blue-lightd6' : '#D6E1EA',
                'blue-default' : '#37A0EA',
                'blue-dark' : '#2786C8',
                'gray-light' : '#F3F6F9',
                'gray-default' : '#5B7688',
                'gray-dark' : '#19496A',
                'cblue-default' : '#ECEBFB',
                'clube-dark' : '#3D3DD9'
            }
        },
    },
    variants: {
        extend: {
            backgroundColor: ['checked']
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
    ]
}