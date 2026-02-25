/**
 * Turkish character conversion utilities.
 *
 * The reading-analysis API returns pronunciation-error words in ASCII
 * (e.g. "karincalarin" instead of "karıncaların"). These helpers map
 * ASCII-transliterated words back to their proper Turkish equivalents
 * using the original text and/or transcript as reference.
 */

function normalizeToAscii(text: string): string {
  return text
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .replace(/â/g, 'a')
    .replace(/Â/g, 'A')
    .replace(/î/g, 'i')
    .replace(/Î/g, 'I')
    .replace(/û/g, 'u')
    .replace(/Û/g, 'U')
    .toLowerCase();
}

function buildAsciiToTurkishMap(text: string): Map<string, string> {
  const map = new Map<string, string>();
  const words = text.split(/\s+/);
  for (const word of words) {
    const cleaned = word.replace(/[.,!?;:"'()\[\]{}«»""''…–—\-]/g, '');
    if (!cleaned) continue;
    const ascii = normalizeToAscii(cleaned);
    if (!map.has(ascii)) {
      map.set(ascii, cleaned);
    }
  }
  return map;
}

/**
 * Convert an ASCII-transliterated Turkish word back to proper Turkish
 * by matching against one or more reference texts (original story text,
 * transcript, etc.).
 */
export function asciiToTurkish(asciiWord: string, ...referenceTexts: string[]): string {
  if (!asciiWord) return asciiWord;
  const asciiLower = asciiWord.toLowerCase();
  for (const text of referenceTexts) {
    if (!text) continue;
    const map = buildAsciiToTurkishMap(text);
    const match = map.get(asciiLower);
    if (match) return match;
  }
  return asciiWord;
}

/**
 * Convert all pronunciation errors in an array from ASCII to Turkish.
 * Each error has { expected, actual } fields that may need conversion.
 */
export function convertErrorsToTurkish(
  errors: Array<{ expected: string; actual: string }>,
  originalText: string,
  transcript?: string,
): Array<{ expected: string; actual: string }> {
  const refs = [originalText, transcript].filter(Boolean) as string[];
  return errors.map((err) => ({
    expected: asciiToTurkish(err.expected, ...refs),
    actual: err.actual ? asciiToTurkish(err.actual, ...refs) : err.actual,
  }));
}
