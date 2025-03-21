# ThunderBuddyFrontend

ThunderBuddyFrontend is an Expo-based React Native application that provides a simple login and home screen. It uses React Navigation for manual routing, React Native Paper for UI components, and NativeWind for Tailwind CSS styling.

![ThunderBuddyFrontend Mockup](ThunderBuddyFrontendMockup.png)

## Features

- **Login & Home Screens**: A login screen that simulates authentication (using a fake API) and a home screen that greets the user.
- **Manual Routing with React Navigation**: Uses a native stack navigator to manage screen transitions.
- **Context API for State Management**: Manages user state (username) with React’s Context API.
- **Tailwind Styling via NativeWind**: Applies utility-first styling using NativeWind, which integrates Tailwind CSS classes into React Native.

## Getting Started

Follow these instructions to clone the repository and set up the project for local development.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) (use `npx expo` to run commands locally; avoid using the legacy global expo-cli)

### Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd ThunderBuddyFrontend
```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Set Up Tailwind (NativeWind)**

   Make sure you have the following configuration files in your project root:

   **babel.config.js**

   ```js
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: ['nativewind/babel'],
     };
   };
   ```

   **tailwind.config.js**

   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './App.{js,jsx,ts,tsx}',
       './components/**/*.{js,jsx,ts,tsx}',
       './screens/**/*.{js,jsx,ts,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

   **postcss.config.js**

   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. **Run the Project**

   Start the Expo development server and clear the cache:

   ```bash
   npx expo start -c
   ```

   This command will launch Expo and provide options to open the app on an Android emulator, iOS simulator, or on a physical device via QR code.

## Project Structure

```
ThunderBuddyFrontend/
├── App.js
├── package.json
├── babel.config.js
├── tailwind.config.js
├── postcss.config.js
├── app/
│   └── components/
│       ├── Home.js
│       └── LogIn.js
├── context/
│   └── UserContext.jsx
├── assets/
│   └── images/
│       ├── icon.png
│       ├── adaptive-icon.png
│       ├── splash-icon.png
│       └── favicon.png  (optional – if not provided, remove favicon reference in app.json)
└── ThunderBuddyFrontendMockup.png
```

## Troubleshooting

- **Favicon Error on Web**:  
  If you encounter an error related to a missing favicon, either add a favicon image at `./assets/images/favicon.png` or remove the `"favicon"` property from your Expo configuration.

- **Clearing Cache**:  
  If unexpected behavior occurs, try restarting with a clear cache:
  ```bash
  npx expo start -c
  ```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License

This project is open source and available under the [MIT License](LICENSE).

```

```
