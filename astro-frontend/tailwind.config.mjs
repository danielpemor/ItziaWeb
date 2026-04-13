import fg from 'fast-glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = fg.sync([
  'src/**/*.astro',
  'src/**/*.tsx',
  'src/**/*.ts',
  'src/**/*.jsx',
  'src/**/*.js',
], {
  cwd: __dirname,
  absolute: true,
});

    /** @type {import('tailwindcss').Config} */
    export default {
      content: files,
      theme: {
        extend: {
    colors: {
      teal: {
        50:  '#f0f7fa',
        100: '#d9edf4',
        200: '#a8d4e4',
        300: '#6cb4cc',
        400: '#3a91b0',
        500: '#1D4E5F',  // primary
        600: '#163d4d',
        700: '#112e3a',
        800: '#0c2029',
        900: '#071318',
      },
      sage: {
        // mantener igual
      },
      terra: {
        400: '#C17D5C',
        500: '#a66444',
      },
    },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':   '0 2px 20px rgba(46,41,37,0.06)',
        'medium': '0 4px 40px rgba(46,41,37,0.10)',
        'sage':   '0 4px 30px rgba(122,158,126,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'float':   'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};