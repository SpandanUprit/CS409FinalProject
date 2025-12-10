# Movielationships

**Movielationships** is a web application designed for movie lovers who are tired of generic suggestions. We help you discover hidden gems and new favorites based on deep connections to the movies you already love—going beyond simple genre matching.

## Features

* **Smart Recommendations:** Find movies similar to your favorites based on nuanced relationships (themes, tone, directors, and more).
* **Favorites Collection:** 'Heart' the movies you love to refine your recommendation profile.
* **Watchlist:** Keep track of the movies you discover and want to watch later so you never forget a title.
* **Personalized Profile:** Manage your preferences and viewing history in one place.

## Getting Started

Follow these instructions to get a local copy of the project up and running on your machine.

### Prerequisites

Ensure you have the following installed on your local machine:
* **Node.js** (v16 or higher recommended)
* **npm** (usually installed automatically with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/movielationships.git](https://github.com/your-username/movielationships.git)
    cd movielationships
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    * Create a `.env` file in the root directory.
    * Add your required API keys (e.g., Supabase or Movie Database keys).
    * *Example:*
        ```env
        VITE_SUPABASE_PROJECT_ID=aqejcjjmeienghvmeqyg
        VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZWpjamptZWllbmdodm1lcXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTE1MjQsImV4cCI6MjA4MDg2NzUyNH0.yBOz7XdqqOFr4PStMFFqvmS0DI1WUYemmyA2prqZl90
        ```

### Running the App

To start the local development server:

```bash
npm run dev
