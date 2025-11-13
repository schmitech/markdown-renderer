/**
 * Utility: mask segments that must be preserved verbatim (fenced & inline code, math blocks).
 */
function maskCodeSegments(src: string) {
  const masks: Record<string, string> = {};
  let i = 0;

  // Mask display math blocks $$...$$ first (before code blocks to avoid conflicts)
  // Handle both empty and non-empty math blocks
  src = src.replace(/\$\$([\s\S]*?)\$\$/g, (_m, body) => {
    const key = `__DISPLAY_MATH_${i++}__`;
    // Preserve empty math blocks as-is (they'll be rendered by KaTeX)
    masks[key] = `$$${body}$$`;
    return key;
  });

  // Mask fenced code blocks ``` ``` and ~~~ ~~~
  src = src.replace(/(^|\n)(```|~~~)([^\n]*)\n([\s\S]*?)\n\2(\n|$)/g, (_m, p1, fence, info, body, p5) => {
    const key = `__FENCED_CODE_${i++}__`;
    masks[key] = `${p1}${fence}${info}\n${body}\n${fence}${p5}`;
    return key;
  });

  // Mask inline code `...`
  src = src.replace(/`([^`]+)`/g, (_m) => {
    const key = `__INLINE_CODE_${i++}__`;
    masks[key] = _m;
    return key;
  });

  return { masked: src, masks };
}

/**
 * Mask inline math $...$ but only if it doesn't look like currency
 */
function maskInlineMath(src: string) {
  const masks: Record<string, string> = {};
  let i = 0;

  // Mask inline math $...$ (but not $$...$$ which are already masked)
  // Only mask if it doesn't look like currency (must be ONLY a number, not starting with a number)
  src = src.replace(/(?<!\$)\$(?!\$)([^$\n]+?)(?<!\$)\$(?!\$)/g, (_m, body) => {
    const trimmed = body.trim();
    // Don't mask if it looks like currency (must be ONLY digits, commas, decimals, and optional suffixes)
    // This regex matches the full currency pattern: digits (with commas), optional decimals, optional k/m/b suffix
    // It must match the ENTIRE string, not just the start
    const looksLikeCurrency = /^-?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s?[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion)?$/.test(trimmed);
    if (looksLikeCurrency) return _m;
    
    const key = `__INLINE_MATH_${i++}__`;
    masks[key] = `$${body}$`;
    return key;
  });

  return { masked: src, masks };
}

function unmaskCodeSegments(src: string, masks: Record<string, string>) {
  for (const [k, v] of Object.entries(masks)) {
    src = src.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), v);
  }
  return src;
}

/**
 * Enhanced markdown preprocessing that handles both currency and math notation
 * without clobbering each other.
 */
export const preprocessMarkdown = (content: string): string => {
  if (!content || typeof content !== 'string') return '';

  try {
    // Normalize line endings
    let processed = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 0) Mask code blocks/inline code and display math FIRST so we never touch them during preprocessing
    //    This is critical for preserving $ symbols in Mermaid, PlantUML, and other code blocks
    const { masked, masks } = maskCodeSegments(processed);
    processed = masked;
    
    // 0.5) Process currency BEFORE masking inline math to avoid conflicts
    //      Temporarily replace currency with placeholders
    const currencyMap = new Map<string, string>();
    let idx = 0;

    // Range helper: replace ranges like $5-$10 or $5–$10 with placeholders for BOTH sides
    // Currency pattern: must be followed by space, punctuation, end of string, or valid suffix (k/m/b)
    // Must NOT be followed by a letter (unless it's a valid suffix)
    const currencyCore = String.raw`-?\$\(?\d{1,3}(?:,\d{3})*(?:\.\d+)?\)?(?:\s?(?:[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion))?|\$-?\d+(?:\.\d+)?(?:\s?(?:[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion))?`;
    const rangeRegex = new RegExp(
      String.raw`(${currencyCore})(\s?[–-]\s?)(${currencyCore})`,
      'g'
    );

    processed = processed.replace(rangeRegex, (_m, left, dash, right) => {
      const lph = `__CURRENCY_${idx++}__`;
      const rph = `__CURRENCY_${idx++}__`;
      currencyMap.set(lph, left);
      currencyMap.set(rph, right);
      return `${lph}${dash}${rph}`;
    });

    // Single currency amounts - must be followed by space, punctuation, or end of string
    // Use negative lookahead to ensure it's not followed by a letter (unless it's a valid suffix)
    const singleCurrencyRegex = new RegExp(
      String.raw`-?\$\(?\d{1,3}(?:,\d{3})*(?:\.\d+)?\)?(?:\s?(?:[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion))?(?!\w)|\$-?\d+(?:\.\d+)?(?:\s?(?:[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion))?(?!\w)`,
      'g'
    );
    processed = processed.replace(singleCurrencyRegex, (match, offset, string) => {
      // Double-check: if followed by a letter (and not a valid suffix), it's not currency
      const afterMatch = string.substring(offset + match.length);
      if (afterMatch.match(/^[a-zA-Z]/) && !match.match(/[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion$/)) {
        return match; // Don't replace, it's probably part of math like $10n$
      }
      const ph = `__CURRENCY_${idx++}__`;
      currencyMap.set(ph, match);
      return ph;
    });

    // Now mask inline math (currency is already protected)
    const { masked: mathMasked, masks: mathMasks } = maskInlineMath(processed);
    processed = mathMasked;
    // Merge math masks into main masks
    Object.assign(masks, mathMasks);
    
    // Auto-detect and wrap common math patterns that might not have delimiters
    // This helps catch expressions like "x^2 + y^2 = z^2" and wrap them properly
    const mathPatterns = [
      // Equations with equals sign and math operators
      /(?:^|\s)([a-zA-Z0-9]+\s*[\^_]\s*[a-zA-Z0-9{}]+(?:\s*[+\-*/]\s*[a-zA-Z0-9]+\s*[\^_]\s*[a-zA-Z0-9{}]+)*\s*=\s*[^$\n]+)(?:\s|$)/g,
      // Fractions not already wrapped
      /(?:^|\s)(\\frac\{[^}]+\}\{[^}]+\})(?:\s|$)/g,
      // Square roots, integrals, sums not already wrapped
      /(?:^|\s)(\\(?:sqrt|int|sum|prod|lim|log|ln|sin|cos|tan|exp)\b[^$\n]{0,50})(?:\s|$)/g,
      // Chemical formulas (e.g., H2O, CO2, Ca(OH)2)
      /(?:^|\s)([A-Z][a-z]?(?:\d+)?(?:\([A-Z][a-z]?(?:\d+)?\))?(?:\d+)?(?:[+-]\d*)?)+(?:\s|$)/g,
    ];
    
    // Wrap detected patterns in $ delimiters if not already wrapped
    mathPatterns.forEach(pattern => {
      processed = processed.replace(pattern, (match, expr) => {
        // Check if already wrapped in $ or $$
        if (match.includes('$')) return match;
        // Avoid wrapping single-letter words like "I" that are not math
        const trimmed = String(expr ?? '').trim();
        if (/^[A-Za-z]$/.test(trimmed)) return match;

        // Heuristics: only auto-wrap if it clearly looks like math or chemistry
        const looksLikeMath = /[\\^_+=<>]|\\b(?:frac|sqrt|sum|int|lim|log|ln|sin|cos|tan|exp)\b/.test(trimmed);
        const hasDigit = /\d/.test(trimmed);
        const hasParens = /[()]/.test(trimmed);
        const uppercaseCount = (trimmed.match(/[A-Z]/g) || []).length;
        const lowercaseCount = (trimmed.match(/[a-z]/g) || []).length;
        const hasTwoElementTokens = uppercaseCount >= 2; // e.g., NaCl, CO2 (with digits handled separately)

        const looksLikeChemistry = hasDigit || hasParens || (hasTwoElementTokens && lowercaseCount > 0);

        if (!looksLikeMath && !looksLikeChemistry) return match;

        return match.replace(expr, `$${expr}$`);
      });
    });

    // 1) Normalize LaTeX delimiters to markdown-math friendly forms
    //    \[...\] -> $$...$$   and   \(...\) -> $...$
    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_m, p1) => `\n$$${p1}$$\n`);
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_m, p1) => `$${p1}$`);

    // 2) Protect stray $ that aren't math (e.g., isolated dollar signs in prose)
    //    If we see $word$ that doesn't look like math, escape both sides.
    //    Skip if it's already a placeholder (currency or math)
    processed = processed.replace(
      /(?<!\\)\$(?!\$)([^$\n]*?)(?<!\\)\$(?!\$)/g,
      (m, inner) => {
        // Skip if this is already a placeholder
        if (m.includes('__CURRENCY_') || m.includes('__INLINE_MATH_') || m.includes('__DISPLAY_MATH_')) {
          return m;
        }
        
        // Handle empty math blocks - leave them as-is (KaTeX will handle them)
        if (inner.trim() === '') {
          return m;
        }
        
        // Much more aggressive math detection - assume math unless it's clearly currency
        const isLikelyCurrency = /^\d+(?:,\d{3})*(?:\.\d{2})?$/.test(inner.trim());
        const hasBackslash = /\\/.test(inner);
        const hasMathOperators = /[+\-*/=<>^_{}()]/.test(inner);
        const hasLettersAndNumbers = /[a-zA-Z].*\d|\d.*[a-zA-Z]/.test(inner);
        const hasGreekLetters = /\\(?:alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|omega)/.test(inner);
        const hasMathFunctions = /\\(?:frac|sqrt|sum|int|lim|log|ln|sin|cos|tan|exp)/.test(inner);
        
        // It's probably math if it has any math-like characteristics
        const isProbablyMath = !isLikelyCurrency && (
          hasBackslash || 
          hasMathOperators || 
          hasLettersAndNumbers || 
          hasGreekLetters || 
          hasMathFunctions ||
          inner.length > 1 // Single characters are likely variables
        );
        
        if (isProbablyMath) return m;
        return `\\$${inner}\\$`;
      }
    );

    // 3) Restore currency placeholders BUT escape the leading '$' so remark-math won't pair them
    //    This is the key to allowing $…$ math while keeping $ amounts literal.
    currencyMap.forEach((original, ph) => {
      const escaped = original.replace(/\$/g, '\\$');
      processed = processed.replace(new RegExp(ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), escaped);
    });

    // 5) Unmask code segments
    processed = unmaskCodeSegments(processed, masks);

    // 6) Final tidy
    processed = processed.trimEnd() + '\n';
    return processed;
  } catch (err) {
    console.warn('Error preprocessing markdown:', err);
    return content;
  }
};

/**
 * Utility: detect likely math without false positives from currency
 */
export const containsMathNotation = (text: string): boolean => {
  const withoutCurrency = text.replace(/\$\s?\d+(?:,\d{3})*(?:\.\d+)?\b/gi, '');
  const patterns = [
    /\$\$[\s\S]+?\$\$/,
    /(?<!\\)\$[^$\n]+?(?<!\\)\$/,
    /\\\[[\s\S]+?\\\]/,
    /\\\([^)]+?\\\)/,
  ];
  return patterns.some((re) => re.test(withoutCurrency));
};

