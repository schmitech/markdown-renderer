# @schmitech/markdown-renderer

A shared React markdown renderer component with built-in support for math notation (via KaTeX) and chemistry formulas.

## Features

- Full markdown support via `react-markdown`
- Math notation rendering with KaTeX
- Chemistry formula support (mhchem)
- Currency handling (distinguishes between $5 and $x$ math notation)
- GitHub Flavored Markdown (GFM) support
- Customizable styling

## Installation

```bash
npm install @schmitech/markdown-renderer
```

## Usage

### Basic Usage

```tsx
import { MarkdownRenderer } from '@schmitech/markdown-renderer';
import '@schmitech/markdown-renderer/styles';

function MyComponent() {
  const content = `
# Hello World

This is a **markdown** example with math: $x^2 + y^2 = z^2$

And chemistry: $\\ce{H2O}$
  `;

  return <MarkdownRenderer content={content} />;
}
```

### With Custom Styling

```tsx
import { MarkdownRenderer } from '@schmitech/markdown-renderer';
import '@schmitech/markdown-renderer/styles';

function MyComponent() {
  return (
    <MarkdownRenderer 
      content="# Hello" 
      className="my-custom-class"
    />
  );
}
```

### Disable Math Rendering

```tsx
<MarkdownRenderer 
  content="Some content" 
  disableMath={true}
/>
```

## API

### MarkdownRenderer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | string | required | The markdown content to render |
| className | string | '' | Additional CSS classes to apply |
| disableMath | boolean | false | Disable math notation rendering |

### Exported Utilities

- `preprocessMarkdown(content: string): string` - Preprocesses markdown content for proper math/currency handling
- `containsMathNotation(text: string): boolean` - Checks if text contains math notation
- `MarkdownLink` - Custom link component that opens in new tabs

## Styling

Import the default styles:

```tsx
import '@schmitech/markdown-renderer/styles';
```

Or import the CSS file directly:

```css
@import '@schmitech/markdown-renderer/dist/MarkdownStyles.css';
```

## License

Apache 2.0