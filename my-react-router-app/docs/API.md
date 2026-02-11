# API Documentation

This document provides comprehensive documentation for all API endpoints in the My Campus Redesign application.

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Courses API](#courses-api)
3. [Grades API](#grades-api)
4. [News API](#news-api)
5. [Forum API](#forum-api)
6. [Room Booking API](#room-booking-api)
7. [File Management API](#file-management-api)
8. [Contact API](#contact-api)
9. [Practical Reports API](#practical-reports-api)
10. [Error Handling](#error-handling)

---

## Authentication API

### POST /api/login

Authenticates a user and creates a session.

**Request Body**:
```json
{
  "username": "student@example.com",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Response Headers**:
```
Set-Cookie: session=<token>; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax
```

**Error Responses**:
- `400`: Missing credentials
- `401`: Invalid credentials

**Example**:
```typescript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await response.json();
```

---

### POST /api/logout

Logs out the current user and destroys the session.

**Request**: No body required (cookie authentication)

**Success Response** (200):
```json
{
  "success": true
}
```

**Response Headers**:
```
Set-Cookie: session=; HttpOnly; Path=/; Max-Age=0
```

---

### POST /api/request-password-reset

Initiates a password reset by sending an email with a reset token.

**Request Body**:
```json
{
  "email": "student@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "If an account exists with that email, a reset link has been sent."
}
```

**Note**: Always returns success to prevent email enumeration.

---

### POST /api/reset-password

Resets a user's password using a valid token.

**Request Body**:
```json
{
  "token": "reset-token-string",
  "newPassword": "NewSecurePassword123!"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password has been reset successfully."
}
```

**Error Responses**:
- `400`: Invalid or expired token
- `400`: Password does not meet requirements

---

## Courses API

### GET /api/courses

Retrieves a list of courses, optionally filtered.

**Query Parameters**:
- `majorId` (optional): Filter by major/program
- `semester` (optional): Filter by semester number
- `search` (optional): Search by course title or code

**Success Response** (200):
```json
{
  "courses": [
    {
      "id": "uuid",
      "code": "DLBWPGES01",
      "title_de": "Geschichte",
      "title_en": "History",
      "credits": 5,
      "semester": 1,
      "description_de": "Einführung in die Geschichte",
      "description_en": "Introduction to History",
      "major": {
        "id": "uuid",
        "name_de": "Betriebswirtschaftslehre",
        "name_en": "Business Administration"
      }
    }
  ],
  "total": 42
}
```

**Example**:
```typescript
const response = await fetch('/api/courses?semester=1&majorId=uuid');
const { courses } = await response.json();
```

---

### GET /api/courses/:courseId

Retrieves detailed information about a specific course.

**URL Parameters**:
- `courseId`: Course UUID

**Success Response** (200):
```json
{
  "course": {
    "id": "uuid",
    "code": "DLBWPGES01",
    "title_de": "Geschichte",
    "title_en": "History",
    "credits": 5,
    "semester": 1,
    "description_de": "Vollständige Beschreibung...",
    "description_en": "Full description...",
    "learningOutcomes": ["Outcome 1", "Outcome 2"],
    "instructor": "Dr. Schmidt",
    "schedule": {
      "day": "Monday",
      "time": "10:00-12:00",
      "room": "A101"
    }
  }
}
```

**Error Responses**:
- `404`: Course not found

---

## Grades API

### GET /api/grades

Retrieves all grades for the authenticated user.

**Authentication**: Required (session cookie)

**Query Parameters**:
- `semester` (optional): Filter by semester

**Success Response** (200):
```json
{
  "grades": [
    {
      "id": "uuid",
      "value": 1.7,
      "course": {
        "code": "DLBWPGES01",
        "title_de": "Geschichte",
        "title_en": "History"
      },
      "credits": 5,
      "examDate": "2025-12-10T09:00:00Z",
      "teacher": "Dr. Schmidt",
      "semester": 1
    }
  ],
  "statistics": {
    "average": 2.1,
    "totalCredits": 30,
    "completedCourses": 6
  }
}
```

---

### GET /api/grades/transcript

Generates and returns a PDF transcript.

**Authentication**: Required

**Query Parameters**:
- `format` (optional): `pdf` or `json` (default: `pdf`)

**Success Response** (200):
- Content-Type: `application/pdf` or `application/json`

---

## News API

### GET /api/news

Retrieves news articles.

**Query Parameters**:
- `category` (optional): Filter by category (campus, academic, events)
- `featured` (optional): Filter featured articles (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Success Response** (200):
```json
{
  "news": [
    {
      "id": "uuid",
      "title_de": "Neue Bibliothek eröffnet",
      "title_en": "New Library Opens",
      "content_de": "Die neue Bibliothek...",
      "content_en": "The new library...",
      "imageUrl": "/uploads/library.jpg",
      "category": "campus",
      "featured": true,
      "publishedAt": "2026-02-10T10:00:00Z",
      "author": "Campus Team"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

### GET /api/news/:slug

Retrieves a single news article by slug or ID.

**URL Parameters**:
- `slug`: News article slug or UUID

**Success Response** (200):
```json
{
  "news": {
    "id": "uuid",
    "slug": "neue-bibliothek-eroeffnet",
    "title_de": "Neue Bibliothek eröffnet",
    "title_en": "New Library Opens",
    "content_de": "Vollständiger Artikel...",
    "content_en": "Full article...",
    "imageUrl": "/uploads/library.jpg",
    "category": "campus",
    "publishedAt": "2026-02-10T10:00:00Z",
    "author": "Campus Team",
    "tags": ["library", "campus", "facilities"]
  }
}
```

**Error Responses**:
- `404`: News article not found

---

## Forum API

### GET /api/forum/topics

Retrieves forum topics.

**Query Parameters**:
- `courseId` (optional): Filter by course
- `pinned` (optional): Filter pinned topics
- `page` (optional): Page number

**Success Response** (200):
```json
{
  "topics": [
    {
      "id": "uuid",
      "title": "Question about Assignment 3",
      "courseId": "course-uuid",
      "pinned": false,
      "likes": 5,
      "postCount": 12,
      "createdAt": "2026-02-01T14:30:00Z",
      "lastActivity": "2026-02-10T16:45:00Z",
      "author": {
        "id": "user-uuid",
        "firstName": "Jane",
        "lastName": "Doe"
      }
    }
  ]
}
```

---

### GET /api/forum/topics/:topicId/posts

Retrieves posts for a specific topic.

**URL Parameters**:
- `topicId`: Topic UUID

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Posts per page

**Success Response** (200):
```json
{
  "posts": [
    {
      "id": "uuid",
      "content": "This is my answer to the question...",
      "topicId": "topic-uuid",
      "userId": "user-uuid",
      "author": {
        "firstName": "John",
        "lastName": "Smith"
      },
      "likes": 3,
      "createdAt": "2026-02-02T10:15:00Z"
    }
  ]
}
```

---

### POST /api/forum/topics

Creates a new forum topic.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "My Question Title",
  "courseId": "course-uuid",
  "content": "Initial post content..."
}
```

**Success Response** (201):
```json
{
  "topic": {
    "id": "uuid",
    "title": "My Question Title",
    "courseId": "course-uuid",
    "createdAt": "2026-02-11T17:00:00Z"
  }
}
```

---

### POST /api/forum/topics/:topicId/posts

Adds a post to a topic.

**Authentication**: Required

**URL Parameters**:
- `topicId`: Topic UUID

**Request Body**:
```json
{
  "content": "My response to the topic..."
}
```

**Success Response** (201):
```json
{
  "post": {
    "id": "uuid",
    "content": "My response to the topic...",
    "topicId": "topic-uuid",
    "createdAt": "2026-02-11T17:05:00Z"
  }
}
```

---

### POST /api/forum/posts/:postId/like

Toggles a like on a forum post.

**Authentication**: Required

**URL Parameters**:
- `postId`: Post UUID

**Success Response** (200):
```json
{
  "liked": true,
  "likes": 4
}
```

---

## Room Booking API

### GET /api/room-bookings

Retrieves room bookings.

**Authentication**: Required

**Query Parameters**:
- `campus` (optional): Filter by campus location
- `date` (optional): Filter by date (YYYY-MM-DD)
- `roomNumber` (optional): Filter by room number

**Success Response** (200):
```json
{
  "bookings": [
    {
      "id": "uuid",
      "date": "2026-02-15",
      "startTime": "10:00:00",
      "endTime": "12:00:00",
      "campus": "Berlin",
      "roomNumber": "B201",
      "purpose": "Study Group",
      "userId": "user-uuid",
      "createdAt": "2026-02-10T14:30:00Z"
    }
  ]
}
```

---

### POST /api/room-bookings

Creates a new room booking.

**Authentication**: Required

**Request Body**:
```json
{
  "date": "2026-02-15",
  "startTime": "10:00",
  "endTime": "12:00",
  "campus": "Berlin",
  "roomNumber": "B201",
  "purpose": "Study Group"
}
```

**Success Response** (201):
```json
{
  "booking": {
    "id": "uuid",
    "date": "2026-02-15",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "campus": "Berlin",
    "roomNumber": "B201"
  }
}
```

**Error Responses**:
- `400`: Invalid time range
- `409`: Room already booked for that time

---

### DELETE /api/room-bookings/:bookingId

Cancels a room booking.

**Authentication**: Required (must be booking owner)

**URL Parameters**:
- `bookingId`: Booking UUID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Booking cancelled"
}
```

**Error Responses**:
- `403`: Not authorized to cancel this booking
- `404`: Booking not found

---

## File Management API

### POST /api/upload

Uploads a file.

**Authentication**: Required

**Request**: Multipart form data

**Form Fields**:
- `file`: File to upload
- `type`: File type (document, image, video)
- `courseId` (optional): Associated course

**Success Response** (201):
```json
{
  "file": {
    "id": "uuid",
    "filename": "document.pdf",
    "url": "/uploads/documents/uuid-document.pdf",
    "type": "document",
    "size": 1048576,
    "uploadedAt": "2026-02-11T17:10:00Z"
  }
}
```

**Error Responses**:
- `400`: No file provided
- `400`: File too large (max 10MB)
- `415`: Unsupported file type

---

### GET /api/files

Retrieves user's files.

**Authentication**: Required

**Query Parameters**:
- `type` (optional): Filter by file type
- `courseId` (optional): Filter by course

**Success Response** (200):
```json
{
  "files": [
    {
      "id": "uuid",
      "filename": "notes.pdf",
      "url": "/uploads/documents/uuid-notes.pdf",
      "type": "document",
      "size": 524288,
      "uploadedAt": "2026-02-05T12:00:00Z"
    }
  ]
}
```

---

### DELETE /api/files/:fileId

Deletes a file.

**Authentication**: Required (must be file owner)

**URL Parameters**:
- `fileId`: File UUID

**Success Response** (200):
```json
{
  "success": true,
  "message": "File deleted"
}
```

---

## Contact API

### POST /api/contact/submit

Submits a contact/support form.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Technical Support",
  "message": "I need help with...",
  "category": "technical"
}
```

**Success Response** (201):
```json
{
  "submission": {
    "id": "uuid",
    "ticketNumber": "TICKET-12345",
    "status": "PENDING",
    "submittedAt": "2026-02-11T17:15:00Z"
  },
  "message": "Your request has been submitted. We'll respond within 24 hours."
}
```

---

### GET /api/contact/submissions

Retrieves user's contact submissions.

**Authentication**: Required

**Success Response** (200):
```json
{
  "submissions": [
    {
      "id": "uuid",
      "ticketNumber": "TICKET-12345",
      "subject": "Technical Support",
      "status": "IN_PROGRESS",
      "submittedAt": "2026-02-10T14:00:00Z",
      "updatedAt": "2026-02-11T10:30:00Z"
    }
  ]
}
```

---

## Practical Reports API

### GET /api/praxis/reports

Retrieves practical work reports.

**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status (DUE, SUBMITTED, APPROVED)
- `year` (optional): Filter by year

**Success Response** (200):
```json
{
  "reports": [
    {
      "id": "uuid",
      "weekNumber": 5,
      "year": 2026,
      "startDate": "2026-02-03",
      "endDate": "2026-02-09",
      "hoursWorked": 40,
      "activities": "Project work, meetings...",
      "status": "SUBMITTED",
      "submittedAt": "2026-02-09T16:00:00Z"
    }
  ]
}
```

---

### POST /api/praxis/reports

Submits a practical work report.

**Authentication**: Required

**Request Body**:
```json
{
  "weekNumber": 5,
  "year": 2026,
  "startDate": "2026-02-03",
  "endDate": "2026-02-09",
  "hoursWorked": 40,
  "activities": "Detailed description of work activities..."
}
```

**Success Response** (201):
```json
{
  "report": {
    "id": "uuid",
    "weekNumber": 5,
    "status": "SUBMITTED",
    "submittedAt": "2026-02-11T17:20:00Z"
  }
}
```

---

## Error Handling

All API endpoints follow a consistent error response format:

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context about the error"
    }
  }
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid request data |
| 401 | `UNAUTHORIZED` | Authentication required |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict |
| 422 | `VALIDATION_ERROR` | Validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

### Example Error Responses

**Validation Error** (422):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**Authentication Error** (401):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please log in."
  }
}
```

**Not Found** (404):
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Course with ID 'abc123' not found"
  }
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Login attempts**: 5 attempts per 15 minutes

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1644595200
```

---

## Versioning

The API currently does not use explicit versioning. Breaking changes will be communicated in advance.

Future versions may use URL versioning: `/api/v2/...`

---

## Authentication

Most endpoints require authentication via session cookie. The cookie is automatically included in requests when using `fetch` with `credentials: 'same-origin'` or `credentials: 'include'`.

**Example**:
```typescript
const response = await fetch('/api/grades', {
  credentials: 'same-origin'
});
```

For API clients, include the session cookie in the `Cookie` header:
```
Cookie: session=<token>
```

---

For questions or issues with the API, please open an issue on GitHub or contact the development team.
