const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './public/index.html',
  ],
  theme: {},
  plugins: [require('@tailwindcss/forms')],
};

export default config;
