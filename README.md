# Agentica React Native Template

A template for building React Native applications with Agentica integration.

## Features

- Real-time chat interface with ChatGPT
- Markdown support for message formatting
- Cross-platform support (iOS & Android)
- Agentica framework integration
- Type-safe API validation with Typia

## Tech Stack

### Core Dependencies

- **React Native**: Mobile application framework
- **TypeScript**: Type-safe JavaScript
- **Expo**: Development platform for React Native
- **Agentica**: Framework for AI integration

### Chat & UI

- **react-native-gifted-chat**: Chat interface components
- **react-native-markdown-display**: Markdown rendering for messages

### Native Integration (Example Code)

- **expo-calendar**: Native calendar API integration

## Getting Started

1. Install dependencies

```bash
npm install
```

3. Configure environment variables
   Create a `.env` file in the root directory with:

```
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server

```bash
npm start

# ios
npx pod-install
npm run ios

# android
npm run android
```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── components/          # Reusable UI components
├── constants/           # Application constants
├── controller/          # API controllers
│   └── calendar.ts      # Calendar API wrapper(Example)
└── shim.ts              # Polyfills
```

## Usage

### Extending the Template

To add new features:

1. Create new controllers in `src/controller/`
2. Implement Tool functions that can be used by the Agent! You can utilize native features (Camera, Calendar, SMS) as tools.
3. Use `typia.llm.application` to create a controller that will be passed to Agentica.
4. Apply your created Controller to Agentica in `App.tsx`.
5. Congratulations! Your code is now available for the Agent to use!

## Important Note

This template is a proof-of-concept template created to demonstrate whether Agentica can call native features.
To use this in a production environment, architectural modifications are required to properly secure the OpenAI Key.
