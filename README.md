# Rule Evaluator - Backend

This is the backend API for the Rule Evaluator application. It receives rule evaluation requests from the frontend, processes them, and returns the result.

## Features

- **Evaluate Rules**: Accepts requests with a rule ID and corresponding data, and evaluates the rule logic based on the provided data.
- **Express Server**: Lightweight Node.js server for handling API requests.
- **Rule Logic**: Evaluates complex rules with multiple conditions (`AND`, `OR`) and fields.

## Tech Stack

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Web framework for building APIs.
- **MongoDB (optional)**: For storing and managing rule data (if needed).

## Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git

## Setup

### 1. Clone the Repository
    ```bash
    git clone https://github.com/ayushman075/rule-backend
    cd rule-backend

### 2. Create .env file
PORT=3000
MONGODB_URI=mongodb+srv://kumarayushmanpandey075:9Jl7Z8MRIXbzYvIi@cluster0.mgeqh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=https://ruli-frontend.vercel.app

### 3. Installing dependencies and running locally
    ```bash
    npm install
    nodemon index.js

This project provides a comprehensive solution for evaluating complex rules using a full-stack architecture. It features a robust backend server built with Express to handle rule evaluation logic, including parsing and processing complex conditions. The frontend, developed with React and Ant Design, offers a user-friendly interface for managing rules and inputting data. Together, the system allows for dynamic evaluation of conditions, supporting multiple fields and logical operators like AND and OR.

By setting up this project, you can gain insights into building and integrating full-stack applications, including handling frontend-backend communication, managing state in a React application, and implementing rule-based evaluation in a Node.js environment. This project can be further extended and customized to meet specific rule evaluation needs or incorporated into larger systems where rule processing is required.
