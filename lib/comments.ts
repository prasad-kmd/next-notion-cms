/**
 * Formats a comment with user attribution.
 * Format: [Name|ID|Avatar]: content
 */
export function formatComment(name: string, id: string, content: string, avatar?: string): string {
  const meta = [name, id, avatar || ""].join("|");
  return `[${meta}]: ${content}`;
}

export interface ParsedComment {
  author: {
    name: string;
    id: string;
    avatar?: string;
  };
  content: string;
  isBot: boolean;
}

/**
 * Parses a comment string to extract attribution and content.
 */
export function parseComment(text: string): ParsedComment {
  // Use a regex that correctly handles the pipe characters without requiring extra spaces
  const match = text.match(/^\[(.*?)\|(.*?)\|(.*?)\]: ([\s\S]*)$/);
  
  // Try a more flexible match if the strict one fails (for initial implementation or manual comments)
  const flexibleMatch = text.match(/^\[(.*?)\]: ([\s\S]*)$/);

  if (match) {
    const [, name, id, avatar, content] = match;
    return {
      author: {
        name: name.trim(),
        id: id.trim(),
        avatar: avatar.trim() || undefined,
      },
      content: content.trim(),
      isBot: false,
    };
  }

  if (flexibleMatch) {
    const [, namePart, content] = flexibleMatch;
    // namePart might contain | separated values
    const parts = namePart.split("|");
    return {
      author: {
        name: parts[0]?.trim() || "Anonymous",
        id: parts[1]?.trim() || "legacy",
        avatar: parts[2]?.trim() || undefined,
      },
      content: content.trim(),
      isBot: false,
    };
  }

  return {
    author: {
      name: "Notion User",
      id: "notion",
    },
    content: text,
    isBot: true,
  };
}

/**
 * Basic profanity filter
 */
const BLACKLIST = [
  "spam", "scam", "offensive", "badword", // Placeholder words
];

export function containsProfanity(text: string): boolean {
  const lowercaseText = text.toLowerCase();
  return BLACKLIST.some((word) => lowercaseText.includes(word));
}
