# Scheduler & Job Queue Guide

## Overview

The job scheduler uses **Bull** (Redis-backed queue) to handle:
1. **Scheduled Ad Posting** - Post ads at specific times automatically
2. **Metrics Syncing** - Periodically pull performance metrics from platforms
3. **Webhook Processing** - Handle real-time platform events
4. **Retry Logic** - Automatic retries on failure with exponential backoff

## Job Queues

### 1. Post Ad Queue
Posts ads at scheduled times.

**Features:**
- Automatic scheduling for future dates
- 3 automatic retries with exponential backoff
- Status tracking (DRAFT → SCHEDULED → POSTED)
- Failure logging

**Example:**
```bash
curl -X POST http://localhost:5000/api/scheduler/schedule-ad \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_123",
    "campaignId": "campaign_456",
    "clientId": "client_789",
    "platform": "FACEBOOK",
    "scheduledAt": "2024-06-15T10:00:00Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "12345",
    "adId": "ad_123",
    "platform": "FACEBOOK",
    "scheduledAt": "2024-06-15T10:00:00Z",
    "message": "Ad scheduled for posting"
  }
}
```

### 2. Metrics Sync Queue
Automatically syncs performance metrics every 4 hours.

**Features:**
- Recurring job (every 4 hours)
- Pulls impressions, clicks, conversions, spend from platforms
- Stores metrics by date
- Platform-agnostic design

**Example:**
```bash
curl -X POST http://localhost:5000/api/scheduler/sync-metrics-now \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client_789",
    "platform": "FACEBOOK",
    "campaignId": "campaign_456"
  }'
```

### 3. Webhook Queue
Handles real-time events from platforms.

**Planned for future:**
- Facebook webhook notifications
- Google Ads campaign status changes
- LinkedIn engagement events

## API Endpoints

### Scheduled Ads

#### GET /scheduler/scheduled-ads/client/:clientId
Get all scheduled ads for a client.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "jobId": "12345",
      "adId": "ad_123",
      "campaignId": "campaign_456",
      "platform": "FACEBOOK",
      "scheduledFor": "2024-06-15T10:00:00Z",
      "progress": 0,
      "state": "delayed"
    }
  ]
}
```

#### POST /scheduler/schedule-ad
Schedule an ad for posting.

**Request:**
```json
{
  "adId": "ad_123",
  "campaignId": "campaign_456",
  "clientId": "client_789",
  "platform": "FACEBOOK",
  "scheduledAt": "2024-06-15T10:00:00Z"
}
```

#### POST /scheduler/cancel-scheduled-ad/:jobId
Cancel a scheduled ad posting.

**Response:**
```json
{
  "success": true,
  "message": "Scheduled ad posting cancelled",
  "data": {
    "jobId": "12345"
  }
}
```

#### GET /scheduler/scheduled-ad/:jobId
Get the status of a scheduled ad job.

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "12345",
    "adId": "ad_123",
    "platform": "FACEBOOK",
    "state": "delayed",
    "progress": 0,
    "attempts": 0,
    "maxAttempts": 3,
    "failedReason": null
  }
}
```

### Metrics Sync

#### GET /scheduler/metrics-sync/client/:clientId
Get all metrics sync jobs for a client.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "jobId": "sync_123",
      "clientId": "client_789",
      "platform": "FACEBOOK",
      "adId": null,
      "campaignId": "campaign_456",
      "nextRunTime": "2024-06-15T14:00:00Z",
      "lastCompletedTime": "2024-06-15T10:00:00Z",
      "state": "active"
    }
  ]
}
```

#### POST /scheduler/sync-metrics-now
Trigger immediate metrics sync.

**Request:**
```json
{
  "clientId": "client_789",
  "platform": "FACEBOOK",
  "adId": "ad_123"
}
```

### Monitoring

#### GET /scheduler/health
Check job queue health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "postAd": {
      "waiting": 5,
      "active": 1,
      "completed": 42,
      "failed": 2,
      "delayed": 3,
      "paused": 0
    },
    "syncMetrics": {
      "waiting": 0,
      "active": 1,
      "completed": 120,
      "failed": 0,
      "delayed": 0,
      "paused": 0
    },
    "healthy": true
  }
}
```

#### GET /scheduler/stats/client/:clientId
Get queue statistics for a specific client.

**Response:**
```json
{
  "success": true,
  "data": {
    "clientId": "client_789",
    "totalScheduledAds": 10,
    "adsPosted": 7,
    "adsFailed": 1,
    "adsActive": 1,
    "adsDelayed": 1
  }
}
```

## Complete Workflow Example

### 1. Create Ad and Schedule Posting

```bash
# 1. Create ad first
curl -X POST http://localhost:5000/api/campaigns/campaign_456/ads \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "FACEBOOK",
    "title": "Summer Sale",
    "body": "Get 50% off",
    "imageUrl": "https://example.com/image.jpg",
    "linkUrl": "https://example.com/product"
  }'

# Response includes ad ID: "ad_123"

# 2. Schedule the ad for posting
curl -X POST http://localhost:5000/api/scheduler/schedule-ad \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_123",
    "campaignId": "campaign_456",
    "clientId": "client_789",
    "platform": "FACEBOOK",
    "scheduledAt": "2024-06-15T10:00:00Z"
  }'

# Response: Job scheduled with ID "12345"

# 3. Check job status
curl -X GET "http://localhost:5000/api/scheduler/scheduled-ad/12345" \
  -H "Authorization: Bearer TOKEN"

# 4. At scheduled time, job automatically posts ad
# Status changes to POSTED
```

### 2. Monitor Metrics

```bash
# 1. Sync metrics immediately
curl -X POST http://localhost:5000/api/scheduler/sync-metrics-now \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "clientId": "client_789",
    "platform": "FACEBOOK",
    "adId": "ad_123"
  }'

# 2. Check sync job status
curl -X GET "http://localhost:5000/api/scheduler/metrics-sync/client/client_789" \
  -H "Authorization: Bearer TOKEN"

# 3. Check queue health
curl -X GET "http://localhost:5000/api/scheduler/health" \
  -H "Authorization: Bearer TOKEN"

# 4. Get client statistics
curl -X GET "http://localhost:5000/api/scheduler/stats/client/client_789" \
  -H "Authorization: Bearer TOKEN"
```

## Architecture Details

### Job States
- `delayed` - Waiting for scheduled time
- `active` - Currently processing
- `completed` - Successfully processed
- `failed` - Permanently failed (after 3 attempts)
- `paused` - Paused by user

### Retry Logic
Jobs automatically retry up to 3 times with exponential backoff:
- 1st attempt: immediately
- 2nd attempt: 2 seconds later
- 3rd attempt: 4 seconds later

### Redis Persistence
- Jobs are persisted in Redis
- Jobs survive server restarts
- Delayed jobs resume when server restarts

### Monitoring
Access Bull UI to visualize job queue:
```
npm install @adminjs/bullmq --save
```

## Integration with Platforms

### Facebook Integration (Future)
```typescript
// Would use FacebookAdManager.createAd()
// Posts ad creative to selected ad set
// Updates ad status in database
```

### Google Ads Integration (Future)
```typescript
// Would use GoogleAdsManager.createAd()
// Creates text/display ads in ad group
// Sets initial status to PAUSED
```

### LinkedIn Integration (Future)
```typescript
// Would use LinkedInAdManager.launchCampaign()
// Posts sponsored content
// Sets campaign status to ACTIVE
```

## Performance Metrics

Track these metrics for each client:
- Total scheduled ads
- Successfully posted ads
- Failed posting attempts
- Average posting time
- Metrics sync frequency
- Queue processing speed

## Troubleshooting

### Jobs Not Processing
1. Check Redis is running: `redis-cli ping`
2. Check queue health: `GET /api/scheduler/health`
3. Check server logs for errors
4. Ensure job data is valid

### Scheduled Ads Not Posting
1. Verify platform account is connected
2. Check campaign status is ACTIVE
3. Verify scheduled time has passed
4. Check job state: `GET /api/scheduler/scheduled-ad/:jobId`

### High Failure Rate
1. Check platform API credentials
2. Verify API rate limits aren't exceeded
3. Check network connectivity
4. Review platform-specific error codes

## Configuration

### Environment Variables
```bash
REDIS_URL=redis://localhost:6379
BULL_JOB_ATTEMPTS=3
BULL_BACKOFF_TYPE=exponential
SYNC_METRICS_INTERVAL=14400000 # 4 hours in ms
```

### Recommended Settings
- `SYNC_METRICS_INTERVAL`: 4 hours (not too frequent, not too sparse)
- `BULL_JOB_ATTEMPTS`: 3 (balances reliability with user notification)
- `BACKOFF_TYPE`: exponential (prevents platform rate limits)

## Next Steps

1. **Implement platform API calls** in processor functions
2. **Add webhook endpoints** for real-time platform events
3. **Build analytics dashboard** showing job history
4. **Create job management UI** in frontend
5. **Add bulk scheduling** for multiple ads at once
