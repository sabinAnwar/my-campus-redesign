/**
 * Readability Analysis Library
 * ============================
 * 
 * This module implements scientific readability formulas for analyzing text complexity
 * in both English and German languages. It is part of a Bachelor's thesis (Bachelorarbeit)
 * research project on educational content accessibility.
 * 
 * @module readability
 * @author Sabin Elanwar
 * @version 1.0.0
 * @date 2025-01-28
 * 
 * References:
 * - Flesch, R. (1948). "A new readability yardstick"
 * - Amstad, T. (1978). "Wie verständlich sind unsere Zeitungen?"
 * - DuBay, W. H. (2004). "The Principles of Readability"
 */

/**
 * Interface for readability analysis results
 * Contains scores, interpretation, and metadata
 */
export interface ReadabilityResult {
  /** Flesch Reading Ease score (0-100, higher = easier) */
  score: number;
  
  /** Human-readable interpretation of the score */
  interpretation: 'sehr leicht' | 'leicht' | 'mittel' | 'schwer' | 'sehr schwer';
  
  /** English interpretation */
  interpretationEN: 'very easy' | 'easy' | 'medium' | 'difficult' | 'very difficult';
  
  /** Average sentence length in words */
  avgSentenceLength: number;
  
  /** Average word length in syllables */
  avgWordLength: number;
  
  /** Total number of sentences analyzed */
  sentenceCount: number;
  
  /** Total number of words analyzed */
  wordCount: number;
  
  /** Total number of syllables counted */
  syllableCount: number;
  
  /** Detected language (de or en) */
  language: 'de' | 'en';
  
  /** Formula used for calculation */
  formula: 'Flesch Reading Ease' | 'Amstad Readability';
}

/**
 * Counts the number of syllables in a word
 * 
 * Algorithm:
 * 1. Count vowel groups (consecutive vowels = 1 syllable)
 * 2. Subtract silent 'e' at end of word
 * 3. Ensure minimum of 1 syllable per word
 * 
 * @param word - The word to analyze
 * @returns Number of syllables in the word
 * 
 * @example
 * countSyllables("hello") // returns 2
 * countSyllables("education") // returns 4
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  // Remove punctuation
  word = word.replace(/[^a-zäöüß]/gi, '');
  
  // Count vowel groups
  const vowels = word.match(/[aeiouyäöü]+/gi);
  let syllables = vowels ? vowels.length : 0;

  // Subtract silent 'e' at the end (English)
  if (word.endsWith('e') && syllables > 1) {
    syllables--;
  }

  // Ensure at least 1 syllable
  return Math.max(syllables, 1);
}

/**
 * Splits text into sentences
 * 
 * Uses regex to identify sentence boundaries based on:
 * - Period (.), exclamation mark (!), question mark (?)
 * - Followed by whitespace or end of string
 * - Handles common abbreviations (Dr., Prof., etc.)
 * 
 * @param text - The text to split into sentences
 * @returns Array of sentences
 * 
 * @example
 * splitIntoSentences("Hello world. How are you?")
 * // returns ["Hello world", "How are you"]
 */
function splitIntoSentences(text: string): string[] {
  // Remove common abbreviations that might confuse sentence detection
  const cleaned = text
    .replace(/Dr\./g, 'Dr')
    .replace(/Prof\./g, 'Prof')
    .replace(/etc\./g, 'etc')
    .replace(/z\.B\./g, 'zB')
    .replace(/d\.h\./g, 'dh');

  // Split on sentence-ending punctuation
  const sentences = cleaned
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return sentences.length > 0 ? sentences : [text];
}

/**
 * Splits text into words
 * 
 * Removes:
 * - Extra whitespace
 * - Punctuation (except hyphens within words)
 * - Empty strings
 * 
 * @param text - The text to split into words
 * @returns Array of words
 * 
 * @example
 * splitIntoWords("Hello, world!")
 * // returns ["Hello", "world"]
 */
function splitIntoWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map(word => word.replace(/[^\w\säöüß-]/gi, ''))
    .filter(word => word.length > 0);
}

/**
 * Detects the language of the text
 * 
 * Simple heuristic based on:
 * - German-specific characters (ä, ö, ü, ß)
 * - Common German words (der, die, das, und, ist)
 * 
 * @param text - The text to analyze
 * @returns Detected language code ('de' or 'en')
 * 
 * @example
 * detectLanguage("Das ist ein deutscher Text")
 * // returns "de"
 */
function detectLanguage(text: string): 'de' | 'en' {
  const germanChars = /[äöüß]/i;
  const germanWords = /\b(der|die|das|und|ist|sind|werden|wurde|ein|eine|mit|für|von|auf|zu)\b/i;
  
  if (germanChars.test(text) || germanWords.test(text)) {
    return 'de';
  }
  
  return 'en';
}

/**
 * Interprets the Flesch Reading Ease score
 * 
 * Score ranges (based on Flesch, 1948):
 * - 90-100: Very easy (5th grade)
 * - 80-90: Easy (6th grade)
 * - 70-80: Fairly easy (7th grade)
 * - 60-70: Standard (8th-9th grade)
 * - 50-60: Fairly difficult (10th-12th grade)
 * - 30-50: Difficult (College)
 * - 0-30: Very difficult (College graduate)
 * 
 * @param score - The Flesch Reading Ease score
 * @param language - The language of the text
 * @returns Interpretation object with German and English labels
 */
function interpretScore(score: number, language: 'de' | 'en'): {
  de: ReadabilityResult['interpretation'];
  en: ReadabilityResult['interpretationEN'];
} {
  if (score >= 80) {
    return { de: 'sehr leicht', en: 'very easy' };
  } else if (score >= 60) {
    return { de: 'leicht', en: 'easy' };
  } else if (score >= 40) {
    return { de: 'mittel', en: 'medium' };
  } else if (score >= 20) {
    return { de: 'schwer', en: 'difficult' };
  } else {
    return { de: 'sehr schwer', en: 'very difficult' };
  }
}

/**
 * Calculates the Flesch Reading Ease score for English text
 * 
 * Formula (Flesch, 1948):
 * Score = 206.835 - (1.015 × ASL) - (84.6 × AWL)
 * 
 * Where:
 * - ASL = Average Sentence Length (words per sentence)
 * - AWL = Average Word Length (syllables per word)
 * 
 * @param text - The English text to analyze
 * @returns Readability analysis result
 * 
 * @example
 * calculateFleschReadingEase("This is a simple sentence.")
 * // returns { score: 85.2, interpretation: "sehr leicht", ... }
 */
export function calculateFleschReadingEase(text: string): ReadabilityResult {
  const sentences = splitIntoSentences(text);
  const words = splitIntoWords(text);
  
  if (words.length === 0 || sentences.length === 0) {
    throw new Error('Text must contain at least one sentence and one word');
  }

  // Count syllables for all words
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Calculate averages
  const avgSentenceLength = words.length / sentences.length;
  const avgWordLength = syllableCount / words.length;

  // Flesch Reading Ease formula
  const score = Math.max(0, Math.min(100, 
    206.835 - (1.015 * avgSentenceLength) - (84.6 * avgWordLength)
  ));

  const interpretation = interpretScore(score, 'en');

  return {
    score: Math.round(score * 10) / 10,
    interpretation: interpretation.de,
    interpretationEN: interpretation.en,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    sentenceCount: sentences.length,
    wordCount: words.length,
    syllableCount,
    language: 'en',
    formula: 'Flesch Reading Ease'
  };
}

/**
 * Calculates the Amstad Readability Index for German text
 * 
 * Formula (Amstad, 1978):
 * Score = 180 - ASL - (58.5 × AWL)
 * 
 * This is an adaptation of the Flesch formula for German language,
 * accounting for differences in sentence structure and word formation.
 * 
 * Where:
 * - ASL = Average Sentence Length (words per sentence)
 * - AWL = Average Word Length (syllables per word)
 * 
 * @param text - The German text to analyze
 * @returns Readability analysis result
 * 
 * @example
 * calculateAmstadReadability("Das ist ein einfacher Satz.")
 * // returns { score: 78.5, interpretation: "sehr leicht", ... }
 */
export function calculateAmstadReadability(text: string): ReadabilityResult {
  const sentences = splitIntoSentences(text);
  const words = splitIntoWords(text);
  
  if (words.length === 0 || sentences.length === 0) {
    throw new Error('Text must contain at least one sentence and one word');
  }

  // Count syllables for all words
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Calculate averages
  const avgSentenceLength = words.length / sentences.length;
  const avgWordLength = syllableCount / words.length;

  // Amstad Readability formula (German adaptation of Flesch)
  const score = Math.max(0, Math.min(100,
    180 - avgSentenceLength - (58.5 * avgWordLength)
  ));

  const interpretation = interpretScore(score, 'de');

  return {
    score: Math.round(score * 10) / 10,
    interpretation: interpretation.de,
    interpretationEN: interpretation.en,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    sentenceCount: sentences.length,
    wordCount: words.length,
    syllableCount,
    language: 'de',
    formula: 'Amstad Readability'
  };
}

/**
 * Automatically analyzes text readability using the appropriate formula
 * 
 * This is the main entry point for readability analysis.
 * It automatically detects the language and applies the correct formula:
 * - German text → Amstad Readability Index
 * - English text → Flesch Reading Ease
 * 
 * @param text - The text to analyze (any language)
 * @returns Readability analysis result
 * 
 * @example
 * analyzeReadability("This is an English text.")
 * // Uses Flesch Reading Ease
 * 
 * analyzeReadability("Das ist ein deutscher Text.")
 * // Uses Amstad Readability
 */
export function analyzeReadability(text: string): ReadabilityResult {
  const language = detectLanguage(text);
  
  if (language === 'de') {
    return calculateAmstadReadability(text);
  } else {
    return calculateFleschReadingEase(text);
  }
}

/**
 * Batch analyzes multiple texts
 * 
 * Useful for analyzing entire courses, multiple documents, or
 * comparing readability across different content types.
 * 
 * @param texts - Array of texts to analyze
 * @returns Array of readability results
 * 
 * @example
 * const results = batchAnalyze([
 *   "First text to analyze.",
 *   "Zweiter Text zum Analysieren."
 * ]);
 */
export function batchAnalyze(texts: string[]): ReadabilityResult[] {
  return texts.map(text => analyzeReadability(text));
}

/**
 * Calculates average readability score across multiple results
 * 
 * @param results - Array of readability results
 * @returns Average score
 * 
 * @example
 * const avg = calculateAverageScore([result1, result2, result3]);
 */
export function calculateAverageScore(results: ReadabilityResult[]): number {
  if (results.length === 0) return 0;
  const sum = results.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / results.length) * 10) / 10;
}
