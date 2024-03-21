import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        // './resources/js/**/*.jsx',
        // './index.html',
        './resources/js/**/*.{js,ts,jsx,tsx}',
        './resources/**/*.{html,jsx,js}',
        './node_modules/tw-elements/dist/js/**/*.js',
    ],

    theme: {
        extend: {
            screens:{
                'xxs':'100px',
            },
            fontSize: {
                xxs: ['5px', '11px']
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
