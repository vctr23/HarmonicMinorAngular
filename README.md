# HarmonicMinorAngular

## Table of Contents

- [Introduction](#introduction)
- [Screenshots](#screenshots)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Keys Configuration](#api-keys-configuration)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contact](#contact)

## Introduction

HarmonicMinorAngular is an Angular-based project designed to [briefly describe the main project goal, e.g., simplify learning and exploring music theory concepts through an intuitive web interface]. This app is intended for enthusiasts and musicians who want to browse, compare, and explore different musical concepts in an intuitive and visual way.

## Screenshots

| Landing Page | Register Page |
|:---:|:---:
|<img src="https://github.com/user-attachments/assets/0b936109-61c9-48f6-82f6-beff2caf9bb7" width="550"/>|<img src="https://github.com/user-attachments/assets/8d7c8bf4-71da-4936-b304-b575459db886" width="550"/>|<img src="https://github.com/user-attachments/assets/7325bc34-b6a8-423f-9fcf-8a70af68ae36" width="550"/>| <img src="[https://github.com/user-attachments/assets/d582a69a-225c-48df-833e-197ad1553ac9](https://github.com/user-attachments/assets/ec1284e4-423e-4de9-91b5-ac31a0f49a0a)" width="550"/>
| Category Page | Product Page | 
|<img src="https://github.com/user-attachments/assets/7325bc34-b6a8-423f-9fcf-8a70af68ae36" width="550"/>| <img src="https://github.com/user-attachments/assets/d582a69a-225c-48df-833e-197ad1553ac9](https://github.com/user-attachments/assets/ec1284e4-423e-4de9-91b5-ac31a0f49a0a" width="550"/>|
## Features

- **Implements user authentication:** Uses secure methods to authenticate users with Firebase Auth.
- **Database management:** Stores and retrieves user data from Firebase Firestore.
- **Image Loading:** loaded images are stored and compressed in Firebase Storage.
- **Navigation:** Includes navigation components to easily switch between app sections.
- **Responsive design:** Works well on both desktop and mobile devices.

## Installation

To install HarmonicMinorAngular, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/vctr23/HarmonicMinorAngular.git
   cd HarmonicMinorAngular
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the application in development mode:

```bash
ng serve
```

Then open your browser at [http://localhost:4200](http://localhost:4200).

It is also being hosted on Firebase Hosting at the moment, you can access it via these two links:
- [https://harmonicminor-2025.web.app/](https://harmonicminor-2025.web.app/).
- [https://harmonicminor-2025.firebaseapp.com/](https://harmonicminor-2025.firebaseapp.com/).

## API Keys Configuration

Some features require private keys (API Keys). You must add your own Firebase keys in Angular’s environment files:
1. Generate the files:
   ```bash
   ng generate environments
   ```
   
2. Edit the files:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts` (Production)

3. Add your keys to the environment object, for example:
   ```typescript
   export const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_DOMINIO.firebaseapp.com",
     projectId: "TU_PROJECT_ID",
     storageBucket: "TU_PROJECT_ID.appspot.com",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID",
   };
   ```
   > **Important:** Never upload your private keys to a public repository.

## Technologies Used

- **Angular:** Main frontend framework.
- **TypeScript:** Strongly-typed programming language.
- **RxJS:** Reactive programming for asynchronous data handling.
- **HTML5 + SCSS:** Structure and styles for the application.
- **Router:** Navigation between routes.
- **Firebase:** library to connect their services with the app.

## License

This project is licensed under the **Apache 2.0 License**. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or comments about HarmonicMinorAngular, please contact:

- Name: Víctor Sánchez Melero
- GitHub: [vctr23](https://github.com/vctr23)

---
