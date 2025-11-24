# Wine Rack Application

## Overview
The Wine Rack Application is a web-based application that allows users to view and manage a collection of wines. The application fetches wine data from a Google Sheet and displays it in a user-friendly interface.

## Features
- Display a list of wines with details such as name, type, vintage, and description.
- Search functionality to filter wines based on user input.
- Responsive design for optimal viewing on various devices.

## Project Structure
```
wine-rack-app
├── src
│   ├── components
│   │   ├── WineRack.tsx
│   │   ├── WineCard.tsx
│   │   └── SearchBar.tsx
│   ├── services
│   │   └── googleSheetsApi.ts
│   ├── types
│   │   └── wine.ts
│   ├── utils
│   │   └── helpers.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd wine-rack-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your Google Sheets API credentials.
5. Start the application:
   ```
   npm start
   ```

## Usage
- Upon starting the application, the wine rack will display a list of wines fetched from the Google Sheet.
- Use the search bar to filter wines by name or type.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.