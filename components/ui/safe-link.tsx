"use client";

import Link from "next/link"
import React from "react"
import { siteConfig } from "@/lib/config"
import { posthog } from "@/lib/posthog-client"

interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
  /**
   * If true, bypasses the safe redirect page even for external links
   */
  bypassSafeRedirect?: boolean
}

export const SafeLink = ({ 
  href, 
  children, 
  className, 
  bypassSafeRedirect = false, 
  target, 
  rel, 
  ...props 
}: SafeLinkProps) => {
  
  // Helper to check if a URL is external
  const isExternal = (url: string) => {
    if (url.startsWith("/")) return false
    if (url.startsWith("#")) return false
    if (url.startsWith("mailto:")) return false
    if (url.startsWith("tel:")) return false
    
    try {
      const urlObj = new URL(url)
      // Check if hostname matches current site (assuming siteConfig.url is available and correct)
      const currentSiteUrl = siteConfig.url || "http://localhost:3000"
      const currentHostname = new URL(currentSiteUrl).hostname
      
      return urlObj.hostname !== currentHostname
    } catch {
      // If it's not a valid URL but doesn't start with /, #, mailto, etc., treat as safe/internal or handle safely
      return false
    }
  }

  const external = isExternal(href)

  const handleLinkClick = () => {
    if (external && posthog) {
      try {
        const urlObj = new URL(href);
        posthog.capture("outgoing_link_clicked", {
          target_domain: urlObj.hostname,
          link_url: href,
          source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        });
      } catch {
        // Fallback for relative or invalid URLs that were still flagged as external
        posthog.capture("outgoing_link_clicked", {
          link_url: href,
          source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        });
      }
    }
  };
  
  if (external && !bypassSafeRedirect) {
    const safeUrl = `/external-link?url=${encodeURIComponent(href)}`
    
    return (
      <Link 
        href={safeUrl} 
        className={className}
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleLinkClick}
        {...props}
      >
        {children}
      </Link>
    )
  }

  // Internal link or bypassed external link
  return (
    <Link 
      href={href} 
      className={className}
      target={target} // Allow original target for internal links if specified
      rel={rel}
      onClick={handleLinkClick}
      {...props}
    >
      {children}
    </Link>
  )
}
