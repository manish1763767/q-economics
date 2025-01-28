# Q-economics

A modern platform for Economics Mock Tests and Previous Year Question Papers.

## Features

- Interactive Mock Tests for Economics subjects
- Previous Year Question Papers
- Responsive Design
- Dynamic Content Loading

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Sequelize

## Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/q-economics.git
cd q-economics
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install
```

3. Setup environment variables
Create a `.env` file in the backend directory with:
```
DATABASE_URL=your_postgres_database_url
NODE_ENV=development
```

4. Start the server
```bash
npm run dev
```

## Deployment

The project is configured for deployment on Render using `render.yaml`. It will automatically:
- Set up a PostgreSQL database
- Deploy the web service
- Serve static files
- Configure domain routing

Visit: [q-economics.onrender.com](https://q-economics.onrender.com)
