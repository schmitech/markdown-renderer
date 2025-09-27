// Main entry point for the markdown-renderer package
import rawStyles from './MarkdownStyles.css?inline';
import './MarkdownStyles.css';

const STYLE_TAG_ID = 'schmitech-markdown-renderer-styles';

const ensureStylesInjected = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_TAG_ID)) return;

  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.textContent = rawStyles;
  document.head.appendChild(styleTag);
};

ensureStylesInjected();
export {
  MarkdownRenderer,
  MarkdownLink,
  preprocessMarkdown,
  containsMathNotation,
  type MarkdownRendererProps
} from './MarkdownComponents';

// Export styles path for consumers who want to import separately
export const stylesPath = './MarkdownStyles.css';
export { ensureStylesInjected };
