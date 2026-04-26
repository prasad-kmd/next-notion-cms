import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Better Auth
vi.mock("better-auth/react", () => ({
  useSession: () => ({
    data: null,
    isPending: false,
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

// Mock window.matchMedia for next-themes
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

// Polyfill for Request, Response, fetch if needed in older Node environments
// (Node 18+ has them globally)
