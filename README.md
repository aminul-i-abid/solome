# Solome - Task Management System

Solome is a robust task management system built with NestJS, designed to help individuals efficiently organize, track, and complete their projects and tasks.

## Features

### User Management

- User registration and authentication
- Secure password handling
- JWT-based authentication with refresh token support
- User profile management

### Project Management

- Create and manage multiple projects
- Track project status (IN_PROGRESS, COMPLETED)
- Project description and progression tracking
- Project-specific task organization

### Task Management

- Create, update, and delete tasks
- Task categorization with labels
- Priority levels (LOW, MEDIUM, HIGH)
- Task status tracking (TODO, IN_PROGRESS, COMPLETED)
- Due date management
- File attachments support
- Task comments
- Subtask creation and management

### Time Tracking

- Track time spent on tasks
- Record start and end times
- Calculate task duration

### Label Management

- Create custom labels
- Color-coding for better organization
- Associate labels with tasks

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd solome
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

- Copy `.env.example` to `.env`
- Update the database connection string and other required variables

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

## API Documentation

The API documentation is available through Swagger UI when the application is running:

- Access Swagger UI: `http://localhost:3000/docs`

## Development

### Available Scripts

- `npm run start:dev` - Start the development server
- `npm run build` - Build the application
- `npm run start:prod` - Start the production server
- `npm run test` - Run tests
- `npm run lint` - Run linting

### Database Management

- `npx prisma studio` - Open Prisma Studio to manage database
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma Client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
