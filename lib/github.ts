import type {
  GitHubUser,
  GitHubRepo,
  SimpleUser,
  SimpleRepo,
} from "@/types/github";

import { siteConfig } from "./config";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_USERNAME = siteConfig.githubUsername;

// Get GitHub token from environment variable (optional, increases rate limit)
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

/**
 * Fetch data from GitHub API with optional authentication
 */
async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  // Add authentication if token is available
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Get GitHub user profile data
 */
export async function getGitHubUser(): Promise<SimpleUser> {
  const user = await fetchGitHub<GitHubUser>(`/users/${GITHUB_USERNAME}`);

  return {
    username: user.login,
    name: user.name || user.login,
    avatar: user.avatar_url,
    bio: user.bio || "",
    location: user.location || "",
    website: user.blog || "",
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    profileUrl: user.html_url,
  };
}

/**
 * Get GitHub user repositories
 * @param limit - Maximum number of repositories to return (default: 6)
 * @param sort - Sort by 'updated', 'created', 'pushed', or 'full_name' (default: 'updated')
 */
export async function getGitHubRepos(
  limit: number = 6,
  sort: "updated" | "created" | "pushed" | "full_name" = "updated",
): Promise<SimpleRepo[]> {
  const repos = await fetchGitHub<GitHubRepo[]>(
    `/users/${GITHUB_USERNAME}/repos?sort=${sort}&per_page=100`,
  );

  // Filter out forks and archived repos, then sort by stars
  const filteredRepos = repos
    .filter((repo) => !repo.fork && !repo.archived && !repo.disabled)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);

  return filteredRepos.map((repo) => ({
    name: repo.name,
    description: repo.description || "No description available",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || "Unknown",
    url: repo.html_url,
    topics: repo.topics,
    updated_at: repo.updated_at,
  }));
}

/**
 * Get pinned repositories (Note: This requires GraphQL API or scraping)
 * For now, we'll just return top starred repos as a fallback
 */
export async function getPinnedRepos(): Promise<SimpleRepo[]> {
  // This is a simplified version - getting actual pinned repos requires GraphQL
  return getGitHubRepos(6, "updated");
}
