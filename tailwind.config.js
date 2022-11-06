const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            // fontFamily: {
            //     sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            // },
            colors: {
                'primary': colors.indigo,
                'secondary': colors.gray,
                'success': colors.green,
                'danger': colors.red,
                'warning': colors.yellow,
                'info': colors.blue,
            }
        },
    },

    plugins: [
        require('@tailwindcss/forms'),
        function ({ addVariant }) {
            addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)')
            addVariant('children', '& > *')
            addVariant('scrollbar', '&::-webkit-scrollbar')
            addVariant('scrollbar-track', '&::-webkit-scrollbar-track')
            addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb')
        }


    ],
};
