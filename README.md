# Sahulat Connect: Bridging the Informal Service Gap

## Project Overview

Sahulat Connect is an innovative mobile application primarily designed for Android, aimed at streamlining the process of finding and booking informal services. Leveraging advanced AI agents, the application intelligently understands user requests, discovers suitable service providers, facilitates booking, and provides automated follow-up. This project seeks to bridge the informal service gap by making essential services more accessible and efficient for users.

## Features

Sahulat Connect employs a multi-agent AI system to deliver a seamless user experience:

*   **Natural Language Understanding (Linguist Agent)**: Interprets user queries to accurately identify service needs and preferences.
*   **Provider Discovery & Ranking (Scout Agent)**: Efficiently searches and ranks available service providers based on the user's intent and location.
*   **Booking & Confirmation (Negotiator Agent)**: Manages the booking process, verifies availability, and confirms appointments with selected providers.
*   **Follow-Up Automation (Butler Agent)**: Schedules reminders and follow-up actions to ensure service delivery and user satisfaction.
*   **Intuitive User Interface**: Built with React and styled with modern components for a smooth and responsive experience.
*   **Android Native Integration**: Utilizes Capacitor for robust performance and access to native device features on Android.

## Technologies Used

*   **Frontend**: React.js
*   **Build Tool**: Vite
*   **Mobile Framework**: Capacitor (for Android)
*   **Styling & Animation**: Framer Motion, Lucide React
*   **Routing**: React Router DOM
*   **Language**: JavaScript (ES6+)

## Getting Started

Follow these steps to set up and run Sahulat Connect on your local machine.

### Prerequisites

Ensure you have the following installed:

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Android Studio (for Android development)
*   Java Development Kit (JDK)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/muhammadzeeshan5784-dotcom/Sahulat-Connect-Bridging-the-Informal-Service-Gap.git
    cd Sahulat-Connect-Bridging-the-Informal-Service-Gap
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    ```

### Running the Application

#### Web Development (Optional)

To run the application in a web browser for development purposes:

```bash
npm run dev
# or yarn dev
```

This will start the Vite development server, and you can access the application in your browser at `http://localhost:5173` (or another port if 5173 is in use).

#### Android Development

1.  **Add Android platform (if not already added)**:
    ```bash
    npx cap add android
    ```

2.  **Build the web assets**:
    ```bash
    npm run build
    # or yarn build
    ```

3.  **Copy web assets to Android project**:
    ```bash
    npx cap copy android
    ```

4.  **Open Android Studio**:
    ```bash
    npx cap open android
    ```
    From Android Studio, you can run the application on an emulator or a connected physical device.

## Project Structure

*   `src/`: Contains the main application source code.
    *   `src/components/`: Reusable React components.
    *   `src/pages/`: Top-level page components for routing.
    *   `src/engine/`: Core AI agent logic (Linguist, Scout, Negotiator, Butler).
*   `android/`: Android native project files (managed by Capacitor).
*   `public/`: Static assets.
*   `dist/`: Built web assets (generated after `npm run build`).

## Contributing

We welcome contributions to Sahulat Connect! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the [MIT License](LICENSE).
