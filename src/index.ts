// Main entry point for the markdown-renderer package
export {
  MarkdownRenderer,
  MarkdownLink,
  preprocessMarkdown,
  containsMathNotation,
  type MarkdownRendererProps
} from './MarkdownComponents';

// Export styles path for consumers who want to import separately
export const stylesPath = './MarkdownStyles.css';