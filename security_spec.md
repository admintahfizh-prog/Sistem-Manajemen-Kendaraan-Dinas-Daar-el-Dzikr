# Security Specification for Kendaraan Yayasan Firestore

## Data Invariants
1. `vehicles`: Managed by coordinator and public read for checking vehicle status and capacity. Document IDs must be valid string IDs.
2. `bookings`: Created by users requesting vehicle bookings; status transitions managed through approvals, handovers, and completions.
3. `infaqRecords`: Logged for completed journeys or manual infaq payments with positive amount and receipt number.
4. `settings`: Maintained for institutional details, bank transfer accounts, coordinator phone & PIN. Document ID `current`.
5. `sopClauses`: Chapters and articles of SOP, readable by all users, editable by coordinator.
6. `notifications`: System notifications created on booking events and read by users/coordinator.

## The Dirty Dozen Payloads (Security Attack Vectors)
1. Injecting 2MB payload into `vehicles` notes to exhaust storage.
2. Direct client overwrite of non-existent fields (`isSuperAdmin: true`) on bookings.
3. Negative `amount` or string value for `amount` in `infaqRecords`.
4. Overwriting `createdAt` timestamp on existing booking documents.
5. Path poisoning with non-alphanumeric special characters in `{bookingId}`.
6. Malformed `settings` update omitting required foundation name and coordinator pin.
7. Attempting to delete `settings/current` document.
8. Modifying vehicle plateNumber to an arbitrary 500-character payload.
9. Modifying someone else's booking code during an update.
10. Creating a notification with invalid types (e.g., boolean instead of AppNotification object).
11. Blanket write injection on wildcard paths.
12. Attempting to bypass schema verification with unregistered ghost fields.
