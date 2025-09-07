# Reports API Integration

## Overview

The Interview Reports page has been updated to use real API data from the reports service instead of mock data.

## Architecture Flow

```
Frontend (my-app) → API Gateway (8081) → Report Service (8085) → PostgreSQL
```

## API Integration Details

### 1. API Client (`src/lib/api/reports.ts`)

- Defines TypeScript interfaces based on Swagger schema
- Implements API functions for all report endpoints
- Handles PDF downloads with proper blob handling

### 2. Data Transformation (`src/types/reports.ts`)

- Maps API data structure to frontend UI requirements
- Transforms backend enums to frontend display values
- Handles data normalization for competencies

### 3. React Hook (`src/hooks/useReports.ts`)

- Manages API state (loading, error, data)
- Provides functions for fetching and downloading reports
- Handles candidate data mapping (currently uses mock candidate info)

### 4. Updated Page (`src/app/(hr)/dashboard/interview-reports/page.tsx`)

- Replaced mock data with real API calls
- Added error handling and loading states
- Implemented PDF download functionality

## Available API Endpoints

| Endpoint                          | Method | Description                  |
| --------------------------------- | ------ | ---------------------------- |
| `/api/v1/reports`                 | POST   | Save ML report               |
| `/api/v1/reports/candidate`       | GET    | Get candidate report         |
| `/api/v1/reports/recommendations` | GET    | Get candidate recommendation |
| `/api/v1/reports/pdf`             | GET    | Download PDF report          |
| `/api/v1/reports/pdf/test`        | GET    | Download test PDF            |

## Configuration

The API base URL is configured in `src/lib/api/client.ts`:

- Development: `http://localhost:8081` (API Gateway)
- Production: Uses `NEXT_PUBLIC_API_URL` environment variable

## Testing

1. **Test PDF Download**: Click "Test PDF" button in the reports header
2. **Real Report PDF**: Select a report and click "Export PDF"
3. **Error Handling**: If no reports found, shows appropriate message with retry button

## Known Limitations

1. **Candidate Data**: Currently uses mock candidate names/positions since there's no "get all candidates" endpoint
2. **No "Get All Reports"**: API doesn't have endpoint to fetch all reports, so we fetch by known candidate IDs
3. **Interview Duration**: Not available in API, uses default "45 min"

## Future Improvements

1. Add candidates API integration to get real candidate data
2. Implement "get all reports" endpoint in backend
3. Add pagination for large datasets
4. Add real-time updates when new reports are generated
5. Implement toast notifications for better UX

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Error Handling

The integration includes comprehensive error handling:

- Network errors show retry button
- No data shows empty state
- PDF download errors are logged to console
- Loading states prevent UI flashing
