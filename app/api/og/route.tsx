import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { env } from "@/lib/env";

export const runtime = "edge";

/**
 * Strips HTML tags from a string using a simple state machine.
 * Completely avoids ReDoS vulnerabilities flagged by CodeQL.
 * Safe for user-controlled query parameters.
 */
function stripTags(html: string): string {
  if (typeof html !== "string") return "";
  
  let result = "";
  let inTag = false;
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    if (char === "<" && !inTag) {
      inTag = true;
    } else if (char === ">" && inTag) {
      inTag = false;
      continue;
    } else if (!inTag) {
      result += char;
    }
  }
  return result.trim();
}

/**
 * Sanitizes text for use in OG image generation.
 * Uses the safe stripTags implementation.
 */
function sanitizeText(text: string): string {
  const stripped = stripTags(text);
  // Additional escaping for defense-in-depth (ImageResponse JSX will also escape, but we sanitize early)
  return stripped
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title = sanitizeText(
    searchParams.get("title") || "PrasadM's Blogfolio"
  );
  const description = sanitizeText(
    searchParams.get("description") ||
      "Personal blogfolio documenting my engineering and development journey."
  );

  // Explicit allow-list to prevent tainted data from searchParams flowing into dynamic values
  const rawType = searchParams.get("type") || "default";
  const allowedTypes = new Set([
    "research",
    "articles",
    "blog",
    "projects",
    "tools",
    "tutorials",
    "wiki",
    "snippets",
    "pages",
    "default",
  ]);
  const type = allowedTypes.has(rawType) ? rawType : "default";

  const typeLabels: Record<string, string> = {
    research: "Research Article",
    articles: "Articles",
    blog: "Blog",
    projects: "Projects",
    tools: "Tools",
    tutorials: "Tutorial",
    wiki: "Wiki",
    snippets: "Snippet",
    pages: "Site Page",
    default: "Welcome Back",
  };

  // Accent colors based on content type for a dynamic feel
  const accents: Record<string, string> = {
    research: "#10b981", // Emerald
    articles: "#3b82f6", // Blue
    blog: "#f59e0b", // Amber
    projects: "#8b5cf6", // Violet
    tools: "#c3e42fff",
    tutorials: "#f43f5e", // Rose
    wiki: "#84cc16", // Lime
    snippets: "#eab308", // Yellow
    pages: "#0ea6ccff",
    default: "#6366f1", // Indigo
  };

  const accentColor = accents[type] || accents.default;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#030712",
        color: "white",
        // fontFamily: '"Inter", "sans-serif"',
        fontFamily: '"Google Sans", "sans-serif"',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Engineering Grid Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${accentColor}15 1px, transparent 1px), linear-gradient(90deg, ${accentColor}15 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

      {/* Ambient Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, ${accentColor}50 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-50px",
          width: "400px",
          height: "400px",
          background: `radial-gradient(circle, ${accentColor}50 0%, transparent 50%)`,
          borderRadius: "50%",
        }}
      />

      {/* Main Content Layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          padding: "80px",
          zIndex: 10,
        }}
      >
        {/* Top Content: Badge, Title, and Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: accentColor,
                boxShadow: `0 0 15px ${accentColor}`,
              }}
            />
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: accentColor,
              }}
            >
              {typeLabels[type] || "PrasadM's Blogfolio"}
            </span>
          </div>

          <h1
            style={{
              fontSize: "84px",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.04em",
              maxWidth: "1000px",
              backgroundImage:
                "linear-gradient(to bottom right, #ffffff 60%, rgba(255,255,255,0.5))",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: "32px",
              color: "#9ca3af",
              lineHeight: 1.4,
              maxWidth: "850px",
              margin: 0,
              fontWeight: 400,
            }}
          >
            {description.length > 140
              ? description.substring(0, 140) + "..."
              : description}
          </p>
        </div>

        {/* Bottom Branding Section */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "16px 28px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Logo with Dynamic Glow */}
            <div
              style={{
                width: "64px",
                height: "64px",
                background: `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)`,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${accentColor}44`,
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${env.SITE_URL}/img/blogfolios_og_icon.png`}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "24px", fontWeight: 700, color: "white" }}
              >
                PrasadM's Blogfolio
              </span>
              <span
                style={{ fontSize: "16px", color: "#6b7280", fontWeight: 500 }}
              >
                by Prasad Madhuranga
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "20px",
              fontWeight: 600,
              color: "#9ca3af",
              padding: "12px 20px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: `2px solid ${accentColor}`,
              }}
            />
            <span>prasadm.vercel.app</span>
          </div>
        </div>
      </div>

      {/* Bottom-right corner accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "120px",
          height: "120px",
          background: `linear-gradient(135deg, transparent 50%, ${accentColor}33 100%)`,
        }}
      />
    </div>,
    {
      width: 1280,
      height: 720,
    },
  );
}