# System Monitor & Logging

This document provides an overview of the System Monitor feature, which provides real-time health tracking and historical logging for the platform's core services.

## Overview

The System Monitor is an admin-only dashboard located at `/dashboard/system-monitor`. it tracks the following services:

1.  **Notion CMS**: Monitor API connectivity and database accessibility.
2.  **Supabase Database**: Track database performance, user counts, and connection health.
3.  **PostHog Analytics**: Verify event tracking and project connectivity.

## Features

- **Real-time Health Checks**: Manual and automatic (30s interval) refreshing of service statuses.
- **Performance Metrics**: Latency (ms), user counts, database size, and more.
- **System Logging**: Every health check and administrative action (like cache purging) is logged to the database.
- **Log Retention**: Automatic 7-day log retention with manual cleanup capability.
- **Cache Management**: Direct interface to purge Notion content caches.
- **Public Status Page**: A consumer-friendly `/status` page for end-users.

## Architecture

### Database Schema

The system uses a `system_logs` table in PostgreSQL (managed via Drizzle):

- `id`: UUID Primary Key
- `service`: 'notion' | 'supabase' | 'posthog' | 'system'
- `level`: 'info' | 'warning' | 'error'
- `message`: Human-readable description
- `metadata`: JSONB blob for technical details (latency, response codes)
- `created_at`: Timestamp with index for fast cleanup

### Health Check Logic

Statuses are determined based on:
- **Operational**: Responds correctly within 2 seconds.
- **Degraded**: Responds but exceeds 2 seconds latency.
- **Error**: API call fails, times out (>10s), or returns an error status.

## Public Status Mapping

The public status page at `/status` simplifies internal metrics for users:

- **Website**: Operational if the app is serving requests.
- **Content**: Operational if Notion is reachable.
- **Authentication**: Operational if Supabase is reachable.
- **Comments**: Operational if both Notion and Supabase are healthy.

## Administrative Actions

### Cache Purge
The "Purge Notion Cache" button calls `revalidateTag("notion-content")`, forcing the Next.js Data Cache to refresh content from the Notion API on the next request.

### Log Cleanup
The system automatically attempts to delete logs older than 7 days with a 10% probability on every new log entry. Admins can also trigger a full cleanup manually from the dashboard.

## Adding New Services

To monitor a new service:
1. Add the service to `LogService` type in `lib/system-logs.ts`.
2. Implement a check function in `lib/system-monitor/health-checks.ts`.
3. Create a new API endpoint in `app/api/admin/system/`.
4. Update the `ServiceCard` grid in `app/dashboard/system-monitor/page.tsx`.
