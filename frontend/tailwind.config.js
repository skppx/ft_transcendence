/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif']
      },
      colors: {
        pong: {
          purple: {
            100: '#6659FD',
            200: '#473ADE',
            300: '#6659FD',
            400: '#6659FD',
            500: '#6659FD',
            600: '#6659FD',
            700: '#6659FD',
            800: '#6659FD',
            900: '#6659FD'
          },
          white: '#ECEDFF',
          blue: {
            100: '#6E6FA5',
            200: '#38396F',
            300: '#2A2957',
            400: '#24244F',
            500: '#161748',
            600: '#3C3B6C',
            700: '#161748',
            800: '#161748',
            900: '#161748'
          }
        },
        'blue-pong-1': '#6E6FA5',
        'blue-pong-2': '#2A2957',
        'blue-pong-3': '#1C1C45',
        'blue-pong-4': '#38396F',
        'green-login': '#00BABC',
        'profile-purple': '#6659FD',
        'profile-red': '#FF030A',
        'profile-green': '#0BED08',
        'profile-yellow': '#F6FA00'
      },
      backgroundImage: {
        default: "url('/images/background.png')",
        'profile-default': "url('/images/background_profile.png')"
      }
    }
  },
  plugins: []
};
