# AquaTrack 💧



AquaTrack is a community-driven, web-based platform designed to tackle water scarcity challenges in urban areas of Kenya 🌍. It empowers residents to report real-time water availability 🚰, track scheduled water truck deliveries 🚚, and access critical water access information to improve community resource management.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Future Enhancements](#future-enhancements)


## Project Overview
AquaTrack addresses the pressing issue of water scarcity in Kenya's urban centers by providing a user-friendly platform for residents to:
- Report water availability or shortages in their area 💧.
- View scheduled water truck deliveries with approximate times and GPS locations 🚚.
- Contribute to a community-driven database for better water resource management 🌊.

The platform is designed to be mobile-friendly 📱, ensuring accessibility for users across devices, and aims to foster collaboration among communities to ensure equitable water access.

## Features
- **Real-Time Water Status Reporting** 💧: Submit reports on water availability, shortages, or expected truck deliveries with priority levels (Low, Medium, High, Urgent).
- **Delivery Schedule Tracking** 🚚: View and filter water truck delivery schedules by location or date (e.g., Today, Tomorrow, This Week).
- **Community-Driven Insights** 🌍: Aggregates user-submitted reports to display active reports, locations, and deliveries.
- **Mobile-Friendly Interface** 📱: Optimized for seamless use on smartphones, tablets, and desktops.
- **Actionable Notifications** 🔔: Provides updates on schedule changes and new delivery information.

## Technologies Used
- **HTML5**: Core structure for the web pages.
- **CSS3**: Styling for a clean, responsive, and user-friendly interface.
- **JavaScript** (assumed): For dynamic filtering and form handling (not explicitly shown in provided files but implied for interactivity).
- **No Backend Dependencies** (current state): Static HTML pages; future enhancements may include a backend for data storage.



## Installation
To run AquaTrack locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/aquatrack.git
   ```
2. Navigate to the project directory:
   ```bash
   cd aquatrack
   ```


## Usage
### Home Page (`index.html`) 🏠
- **Overview**: Displays AquaTrack’s mission, current statistics (e.g., 247 active reports, 156 locations, 23 deliveries), and links to report or view schedules.
- **Navigation**: Use the top navigation bar or quick links to access the Report and Schedule pages.

### Report Page (`report.html`) 💧
- **Purpose**: Allows users to submit water status reports.
- **Steps**:
  1. Enter your name and location.
  2. Select water status (e.g., Water Available 🚰, Water Shortage, etc.).
  3. Choose a priority level (Low to Urgent).
  4. Add optional notes and consent to follow-up if needed.
  5. Submit the report or reset the form.
- **Tips**: Follow the provided reporting tips for accurate and helpful submissions.

### Schedule Page (`schedule.html`) 🚚
- **Purpose**: Displays water truck delivery schedules.
- **Features**:
  - Filter deliveries by location or date (All Dates, Today, Tomorrow, This Week).
  - View approximate delivery times (with a 30-60 minute variance).
  - Check GPS-marked locations for precise delivery points 📍.
  - Clear filters to reset the view.

## Contributing
We welcome contributions to enhance AquaTrack! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request with a clear description of your changes.

Please ensure your contributions align with AquaTrack’s mission to improve water access in Kenya 🌍. For major changes, open an issue first to discuss your ideas.

## Future Enhancements
- **Backend Integration** 🗄️: Add a database
