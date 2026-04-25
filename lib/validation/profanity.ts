import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import { BlockedWord } from "@/types/validation";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

/**
 * Finds blocked words in the provided text and returns their positions.
 */
export function findBlockedWords(text: string): BlockedWord[] {
  try {
    const matches = matcher.getAllMatches(text);
    return matches.map((match) => ({
      word: text.substring(match.startIndex, match.endIndex),
      startIndex: match.startIndex,
      endIndex: match.endIndex,
    }));
  } catch (error) {
    console.error("Error finding blocked words:", error);
    return [];
  }
}

/**
 * Checks if the provided text contains profanity.
 */
export function hasProfanity(text: string): boolean {
  try {
    return matcher.hasMatch(text);
  } catch (error) {
    console.error("Error checking profanity:", error);
    return false; // Fail-open
  }
}
