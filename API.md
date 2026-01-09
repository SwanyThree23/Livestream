# SwanyThree Ultimate API Documentation

**Base URL**: `http://localhost:3001/api` (development) or `https://your-domain.com/api` (production)

**Version**: 1.0.0

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true | false,
  "data": { ... },        // On success
  "error": "message"      // On error
}
```

---

## Authentication Endpoints

### Register New User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "subscription_tier": "free",
      "created_at": "2024-01-09T12:00:00Z"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Validation:**
- Email: Must be valid email format
- Username: 3-50 characters, alphanumeric + underscore only
- Password: Minimum 8 characters

---

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "subscription_tier": "pro",
      "avatar_url": "https://...",
      "bio": "Content creator",
      "created_at": "2024-01-09T12:00:00Z"
    }
  }
}
```

---

### Refresh Token

**POST** `/auth/refresh`

Refresh expired JWT token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## Stream Endpoints

### List Streams

**GET** `/streams`

List user's streams with optional filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (draft, scheduled, live, ended)
- `platform` (optional): Filter by platform
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "streams": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "My Live Stream",
        "description": "Stream description",
        "status": "live",
        "platforms": ["twitch", "youtube"],
        "scheduled_at": null,
        "started_at": "2024-01-09T12:00:00Z",
        "ended_at": null,
        "thumbnail_url": "https://...",
        "tags": ["gaming", "tutorial"],
        "category": "Gaming",
        "is_public": true,
        "created_at": "2024-01-09T11:00:00Z",
        "updated_at": "2024-01-09T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### Create Stream

**POST** `/streams`

Create a new stream.

**Headers:** `Authorization: Bearer <token>`

**Required Subscription:** Basic or higher

**Request Body:**
```json
{
  "title": "My Live Stream",
  "description": "Stream description",
  "platforms": ["twitch", "youtube"],
  "scheduled_at": "2024-01-10T15:00:00Z",
  "tags": ["gaming", "tutorial"],
  "category": "Gaming",
  "is_public": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stream created successfully",
  "data": {
    "stream": { ... }
  }
}
```

---

### Start Stream

**POST** `/streams/:id/start`

Start a stream on selected platforms.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Stream started successfully",
  "data": {
    "stream": { ... },
    "platforms": ["twitch", "youtube"]
  }
}
```

**Errors:**
- `404`: Stream not found
- `400`: Stream already live
- `400`: No connected platforms

---

### Stop Stream

**POST** `/streams/:id/stop`

Stop a live stream.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Stream stopped successfully",
  "data": {
    "stream": { ... }
  }
}
```

---

### Get Stream Analytics

**GET** `/streams/:id/analytics`

Get detailed analytics for a stream.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "aggregated": {
      "total_viewers": 1250,
      "peak_viewers": 342,
      "total_likes": 89,
      "total_shares": 23,
      "total_comments": 156,
      "total_watch_time": 2850,
      "total_revenue": 47.50
    },
    "metrics": [
      {
        "id": "uuid",
        "stream_id": "uuid",
        "platform": "twitch",
        "viewers_current": 150,
        "viewers_peak": 200,
        "viewers_total": 500,
        "likes": 45,
        "shares": 12,
        "comments": 78,
        "watch_time_minutes": 1200,
        "revenue_amount": "25.00",
        "recorded_at": "2024-01-09T12:30:00Z"
      }
    ]
  }
}
```

---

## AI Endpoints

### Generate Podcast Script

**POST** `/ai/podcast/generate`

Generate a podcast script using Claude Sonnet 4.

**Headers:** `Authorization: Bearer <token>`

**Required Subscription:** Basic or higher

**Request Body:**
```json
{
  "topic": "The Future of AI in Healthcare",
  "duration": "10",
  "tone": "professional",
  "speakers": "2"
}
```

**Parameters:**
- `topic`: String (required)
- `duration`: "5" | "10" | "15" | "20" | "30" (default: "10")
- `tone`: "professional" | "casual" | "entertaining" | "educational" (default: "professional")
- `speakers`: "1" | "2" | "3" (default: "2")

**Response:**
```json
{
  "success": true,
  "data": {
    "script": "[SPEAKER 1]: Welcome to today's podcast...\n\n[SPEAKER 2]: Thanks for having me...",
    "metadata": {
      "topic": "The Future of AI in Healthcare",
      "duration": "10",
      "tone": "professional",
      "speakers": "2",
      "tokensUsed": 2847
    }
  }
}
```

---

### Generate Content Ideas

**POST** `/ai/content/ideas`

Generate content ideas for specific platform and niche.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "niche": "Tech Reviews",
  "platform": "youtube",
  "count": 10
}
```

**Parameters:**
- `niche`: String (required)
- `platform`: "twitch" | "youtube" | "facebook" | "twitter" | "tiktok" | "instagram" | "linkedin"
- `count`: Number 1-20 (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "ideas": "[Generated content ideas in text format]",
    "metadata": {
      "niche": "Tech Reviews",
      "platform": "youtube",
      "count": 10
    }
  }
}
```

---

### Optimize Content

**POST** `/ai/content/optimize`

Optimize content for a specific platform.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Original content text here...",
  "platform": "youtube",
  "goal": "engagement"
}
```

**Parameters:**
- `content`: String (required)
- `platform`: Platform name (required)
- `goal`: "engagement" | "views" | "conversions" | "shares" (default: "engagement")

**Response:**
```json
{
  "success": true,
  "data": {
    "optimized": "[Optimized content with recommendations]",
    "original": "Original content text here...",
    "metadata": {
      "platform": "youtube",
      "goal": "engagement"
    }
  }
}
```

---

### Chat with AI

**POST** `/ai/chat`

Have a conversation with Claude AI.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "How can I improve my stream engagement?",
  "conversationId": "uuid"  // Optional, for continuing conversation
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Here are some strategies to improve your stream engagement...",
    "conversationId": "uuid",
    "tokensUsed": 156
  }
}
```

---

### Get AI Usage

**GET** `/ai/usage`

Get AI usage statistics for last 30 days.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "totalTokens": 25847,
    "totalRequests": 42,
    "byType": {
      "podcast": 15,
      "idea": 12,
      "optimization": 10,
      "chat": 5
    },
    "estimatedCost": "0.23"
  }
}
```

---

## User Endpoints

### Get Profile

**GET** `/users/profile`

Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "subscription_tier": "pro",
      "avatar_url": "https://...",
      "bio": "Content creator",
      "created_at": "2024-01-09T12:00:00Z",
      "last_login": "2024-01-10T08:30:00Z"
    }
  }
}
```

---

### Update Profile

**PUT** `/users/profile`

Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "newusername",
  "bio": "Updated bio text",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ... }
  }
}
```

---

### Get OAuth Connections

**GET** `/users/oauth-connections`

Get user's connected OAuth platforms.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "connections": [
      {
        "id": "uuid",
        "provider": "twitch",
        "is_active": true,
        "created_at": "2024-01-09T12:00:00Z"
      }
    ]
  }
}
```

---

## Monetization Endpoints

### Get Subscription

**GET** `/monetization/subscription`

Get current subscription details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "user_id": "uuid",
      "stripe_customer_id": "cus_xxx",
      "stripe_subscription_id": "sub_xxx",
      "plan": "pro",
      "status": "active",
      "current_period_start": "2024-01-01T00:00:00Z",
      "current_period_end": "2024-02-01T00:00:00Z",
      "cancel_at_period_end": false
    }
  }
}
```

---

### Create Checkout Session

**POST** `/monetization/create-checkout`

Create Stripe checkout session for subscription.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "plan": "pro"
}
```

**Parameters:**
- `plan`: "basic" | "pro" | "enterprise"

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/..."
  }
}
```

---

## WebSocket Events

Connect to WebSocket namespaces with JWT authentication:

```javascript
const socket = io('ws://localhost:3001/streams', {
  auth: { token: 'your_jwt_token' }
});
```

### Stream Namespace (`/streams`)

**Client → Server Events:**
- `stream:join` - Join stream room
  ```javascript
  socket.emit('stream:join', { streamId: 'uuid' });
  ```

- `stream:leave` - Leave stream room
  ```javascript
  socket.emit('stream:leave', { streamId: 'uuid' });
  ```

**Server → Client Events:**
- `stream:status:update` - Stream status changed
  ```javascript
  socket.on('stream:status:update', ({ streamId, status, data, timestamp }) => {
    // Handle status update
  });
  ```

- `stream:metrics:update` - Real-time metrics
  ```javascript
  socket.on('stream:metrics:update', ({ streamId, metrics, timestamp }) => {
    // Handle metrics update
  });
  ```

---

### Chat Namespace (`/chat`)

**Client → Server Events:**
- `chat:join` - Join chat room
- `chat:message` - Send message
- `chat:typing` - Send typing indicator
- `chat:read` - Mark message as read
- `chat:reaction` - Add reaction to message

**Server → Client Events:**
- `chat:message:new` - New message received
- `chat:typing:update` - User typing status
- `chat:read:update` - Message read status
- `chat:reaction:new` - New reaction added
- `user:online` - User came online
- `user:offline` - User went offline

---

### Notifications Namespace (`/notifications`)

**Client → Server Events:**
- `notifications:fetch` - Fetch notifications
- `notifications:read` - Mark as read
- `notifications:read:all` - Mark all as read

**Server → Client Events:**
- `notifications:list` - List of notifications
- `notifications:new` - New notification
- `notifications:unread:count` - Unread count update

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions or subscription |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

- **Global**: 100 requests per 15 minutes per IP
- Limit resets every 15 minutes
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Best Practices

1. **Always handle errors gracefully**
2. **Store JWT securely** (not in localStorage for sensitive apps)
3. **Implement token refresh** before expiration
4. **Use WebSockets** for real-time features
5. **Validate input** on client side
6. **Handle rate limits** with exponential backoff
7. **Log errors** for debugging

---

**Need help?** Open an issue on GitHub or check the README.md
