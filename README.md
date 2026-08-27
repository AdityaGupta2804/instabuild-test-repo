# instabuild-test-app

A minimal full-stack demo repository for testing the [InstaBuild](../InstaBuild-main/) CI/CD platform.

## Project Structure

```
instabuild-test-app/
├── .mini-ci.yml          # InstaBuild pipeline configuration
├── backend/
│   ├── package.json
│   └── server.js         # Express API (port 3000)
├── frontend/
│   ├── package.json
│   ├── index.html        # Static HTML page
│   └── src/main.js       # Frontend JavaScript
└── tests/
    ├── test.js           # API tests (uses Node assert)
    └── run-with-server.js # Test runner that starts/stops server
```

## Local Setup

### Run the backend

```bash
cd backend
npm install
npm start
```

Backend will be available at http://localhost:3000

### Run tests

With the backend running:

```bash
node tests/test.js
```

Or run tests with auto server start/stop:

```bash
node tests/run-with-server.js
```

### Test the frontend

Open `frontend/index.html` in a browser, or serve it:

```bash
cd frontend
npx serve .
```

Click "Check Backend Health" (requires backend running on localhost:3000).

## Deployment

### Backend → Render

1. Create a new **Web Service** on Render
2. Connect the repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Deploy

### Frontend → Vercel

1. Import the repository on Vercel
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Other
   - **Output Directory**: `.` (root of frontend/)
3. Edit `frontend/src/main.js` and replace `API_URL` with your Render backend URL
4. Deploy

## Running Through InstaBuild

1. Push this repository to GitHub (or any Git host)
2. Open InstaBuild dashboard at http://localhost:5173
3. Go to **Trigger New Build**
4. Enter the Git repository URL
5. Optionally add Vercel token and Render webhook
6. Click **Trigger Build**

## Testing InstaBuild — Recommended Flow

1. **Run the normal pipeline** → should succeed
2. **Inspect streamed logs** in InstaBuild build detail page
3. **Uncomment the Intentional Failure step** in `.mini-ci.yml`
4. **Commit and push** the change
5. **Run the pipeline again** → should fail
6. **Open build details** in InstaBuild
7. **Trigger AI analysis** → verify InstaBuild identifies the simulated database error and suggests a fix
8. **Re-comment** the failure step
9. **Run the pipeline again** → should succeed

## Testing AI Analysis

The commented-out step in `.mini-ci.yml` simulates a database connection timeout error. When uncommented:

- The build will fail with a clear stack trace
- InstaBuild's AI analysis should identify:
  - **Root Cause**: Simulated database connection timeout
  - **Category**: `runtime_error` or `network_error`
  - **Suggested Fix**: Check database connection string and network connectivity
