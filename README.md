# Quizzer Backend

This is the backend service for the Quizzer app, a dynamic pub quiz platform designed for social settings. The backend manages data, processes requests, and ensures real-time communication between the quiz master, teams, and the scoreboard.

## Features

- **Real-Time Communication:** Utilizes WebSocket for live updates between the frontend applications.
- **Quiz Management:** Handles creation, management, and progression of quiz nights.
- **User Interaction:** Processes team applications, question submissions, and scoring.
- **Multiple Quiz Support:** Capable of hosting multiple simultaneous quizzes in different locations.
- **Security:** Manages secure connections and data integrity between clients and server.

## Technical Stack

- **Node.js/Express:** For the server and API endpoints.
- **MongoDB:** Database for storing quiz data, questions, and scores.
- **WebSocket Protocol:** For real-time bidirectional communication.
- **Environment:** Configured to support diverse pub settings.
