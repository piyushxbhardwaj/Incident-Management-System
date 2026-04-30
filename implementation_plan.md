# Mission-Critical Incident Management System (IMS) Implementation Plan

Build a resilient, high-throughput IMS that handles 10k signals/sec, implements debouncing logic, and follows strict workflow and design patterns.

## User Review Required

> [!IMPORTANT]
> The system requires Docker to be running for MongoDB, PostgreSQL, and Redis.
> I will be refactoring the existing code to use Design Patterns (State and Strategy) as per requirements.

## Proposed Changes

### Infrastructure & Database

#### [NEW] [init.sql](file:///d:/Project/ims-system/backend/init.sql)
Initialize the PostgreSQL table for Work Items.

#### [MODIFY] [docker-compose.yml](file:///d:/Project/ims-system/docker-compose.yml)
Ensure ports and volumes are correctly configured.

---

### Backend (Express API & Logic)

#### [MODIFY] [server.js](file:///d:/Project/ims-system/backend/server.js)
- Implement rate limiting on `/api/signals`.
- Add throughput metrics logger (every 5s).

#### [NEW] [alertingStrategy.js](file:///d:/Project/ims-system/backend/src/services/alertingStrategy.js)
Implement the **Strategy Pattern** for different alert types (P0 for RDBMS, P2 for Cache, etc.).

#### [NEW] [workItemState.js](file:///d:/Project/ims-system/backend/src/services/workItemState.js)
Implement the **State Pattern** for transitions (OPEN → INVESTIGATING → RESOLVED → CLOSED).

#### [MODIFY] [workflowService.js](file:///d:/Project/ims-system/backend/src/services/workflowService.js)
Integrate the State Pattern and Alerting Strategy.

#### [MODIFY] [workItemService.js](file:///d:/Project/ims-system/backend/src/services/workItemService.js)
Add logic to check for existing active work items for a component before creating a new one.

---

### Worker (Async Processing)

#### [MODIFY] [signalWorker.js](file:///d:/Project/ims-system/backend/src/workers/signalWorker.js)
- Update debouncing logic.
- Link signals to Work Items in MongoDB.
- Ensure high-throughput handling.

---

### Frontend (React Dashboard)

#### [MODIFY] [App.js](file:///d:/Project/ims-system/frontend/src/App.js)
- Implement Live Feed with severity sorting.
- Add Incident Detail view with raw signals.
- Create RCA Form with mandatory validation.

## Verification Plan

### Automated Tests
- `npm test` in backend (if tests are added).
- Manual verification of throughput using a mock script.

### Manual Verification
1. Start infra with `docker-compose up -d`.
2. Run backend and worker.
3. Use a script to send 100 signals for one component and verify only 1 Work Item is created.
4. Verify RCA requirement when closing an incident.
5. Check console for metrics every 5 seconds.
