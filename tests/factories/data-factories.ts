export const createMockBlogPost = (overrides = {}) => ({
  id: "mock-post-id",
  slug: "mock-post-slug",
  title: "Mock Blog Post",
  description: "This is a mock blog post for testing purposes.",
  date: "2023-01-01",
  author: "Test Author",
  tags: ["test", "mock"],
  content: "Mock content",
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: "mock-user-id",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  ...overrides,
});

export const createMockComment = (overrides = {}) => ({
  id: "mock-comment-id",
  content: "This is a mock comment.",
  authorId: "mock-user-id",
  authorName: "Test User",
  createdAt: new Date().toISOString(),
  ...overrides,
});
