import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock Notion API
  http.get("https://api.notion.com/v1/databases/:id", () => {
    return HttpResponse.json({
      object: "database",
      id: "mock-db-id",
      properties: {},
    });
  }),

  // Mock PostHog
  http.post("https://app.posthog.com/e/", () => {
    return HttpResponse.json({ status: 1 });
  }),

  // Add more handlers as needed
];
