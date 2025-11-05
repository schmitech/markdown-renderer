export const testCases = [
  {
    title: 'Basic Markdown',
    content: `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold text** and *italic text* and ***bold italic text***.

Here's a [link to Google](https://google.com) and some \`inline code\`.

- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested ordered item
3. Ordered list item 3

> This is a blockquote.
> It can span multiple lines.

---

Horizontal rule above.`
  },
  {
    title: 'Code Blocks',
    content: `## Code Examples

Here's some inline code: \`const x = 42;\`

\`\`\`javascript
// JavaScript code block
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

\`\`\`python
# Python code block
def hello_world():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()
\`\`\`

\`\`\`typescript
// TypeScript with type annotations
interface User {
  id: number;
  name: string;
  email?: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};
\`\`\``
  },
  {
    title: 'Tables (GFM)',
    content: `## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1-1 | Cell 1-2 | Cell 1-3 |
| Cell 2-1 | Cell 2-2 | Cell 2-3 |
| Cell 3-1 | Cell 3-2 | Cell 3-3 |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:------------|:--------------:|--------------:|
| Left        | Center         | Right         |
| Lorem       | Ipsum          | Dolor         |
| Sit         | Amet           | Consectetur   |`
  },
  {
    title: 'Math Notation',
    content: `## Mathematical Expressions

### Inline Math
The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ which solves $ax^2 + bx + c = 0$.

Einstein's famous equation: $E = mc^2$

### Display Math
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### Complex Equations
$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &= \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} &= 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &= \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} &= 0
\\end{aligned}
$$

### Greek Letters and Symbols
$\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\theta, \\lambda, \\mu, \\pi, \\sigma, \\omega$

$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$

$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$`
  },
  {
    title: 'Chemistry Notation',
    content: `## Chemistry Examples

### Chemical Formulas
Water molecule: $\\ce{H2O}$

Sulfuric acid: $\\ce{H2SO4}$

Complex ion: $\\ce{[Cu(NH3)4]^{2+}}$

### Chemical Equations
Combustion of methane:
$$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$$

Equilibrium reaction:
$$\\ce{N2 + 3H2 <=> 2NH3}$$

Redox reaction:
$$\\ce{Zn + Cu^{2+} -> Zn^{2+} + Cu}$$

### Organic Chemistry
Benzene ring: $\\ce{C6H6}$

Ethanol: $\\ce{CH3CH2OH}$

Glucose: $\\ce{C6H12O6}$`
  },
  {
    title: 'Currency Handling',
    content: `## Currency vs Math

### Currency Examples
The price is $5.99 for a single item.

Budget range: $1,000 - $5,000

Total cost: $12,345.67

Negative balance: -$500.00

In parentheses: ($1,234.56)

With suffixes: $1.2k, $3.5M, $2.8B

### Math with Dollar Signs
The variable $x$ represents the unknown value.

Given $f(x) = x^2 + 3x - 4$, find $f(2)$.

The set $S = \\{1, 2, 3, 4, 5\\}$ contains five elements.

### Mixed Content
If an item costs $10 and you buy $n$ items, the total cost is $10n$ dollars.

The formula $P = 2\\pi r$ gives the perimeter, which costs $5 per meter to fence.`
  },
  {
    title: 'Edge Cases',
    content: `## Edge Cases and Special Characters

### Escaping
This is a literal asterisk: \\*

This is a literal dollar sign: \\$

Escaped backticks: \\\`code\\\`

### Special Characters
Arrows: → ← ↑ ↓ ⇒ ⇐ ⇔

Math symbols: ≤ ≥ ≠ ≈ ∞ ∈ ∉ ⊂ ⊃ ∪ ∩

Other: © ® ™ € £ ¥ ° ± × ÷

### Empty Math Blocks
Inline empty: $$

Display empty:
$$
$$

### Nested Formatting
**Bold with *italic* inside**

*Italic with **bold** inside*

> Blockquote with **bold** and *italic* and \`code\`

### Long URLs
Check out this really long URL: https://www.example.com/very/long/path/that/goes/on/and/on/and/on/with/many/parameters?param1=value1&param2=value2&param3=value3&param4=value4`
  },
  {
    title: 'Graphs and Diagrams',
    content: `## Graph Rendering

### Mermaid Flowchart
\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

### Mermaid Sequence Diagram
\`\`\`mermaid
sequenceDiagram
    participant User
    participant App
    participant API
    User->>App: Request data
    App->>API: Fetch data
    API-->>App: Return data
    App-->>User: Display results
\`\`\`

### PlantUML Sequence Diagram
\`\`\`plantuml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml
\`\`\`

### PlantUML Class Diagram
\`\`\`puml
@startuml
class User {
  +String name
  +String email
  +login()
  +logout()
}
class Admin {
  +String permissions
  +deleteUser()
}
User <|-- Admin
@enduml
\`\`\`

### SVG Graphics
\`\`\`svg
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#3b82f6" opacity="0.6" />
  <rect x="60" y="60" width="80" height="80" fill="#ef4444" opacity="0.6" />
  <polygon points="100,40 140,140 60,140" fill="#10b981" opacity="0.6" />
</svg>
\`\`\`

### Mixed Content: Graphs with Math and Currency
The algorithm costs $500 to run and has complexity $O(n \\log n)$:

\`\`\`mermaid
graph LR
    A[Input: x] --> B[Process: f of x]
    B --> C{Cost check}
    C -->|Yes| D[Output]
    C -->|No| E[Optimize]
    E --> B
\`\`\`

The diagram above shows the processing flow where input $x$ goes through function $f(x) = x^2$.

The chemical reaction rate constant $k$ follows:
$$k = A \\cdot e^{-E_a/RT}$$

Budget breakdown with pricing in markdown:
- Development: $22,500 (45%)
- Testing: $12,500 (25%)
- Documentation: $7,500 (15%)
- Deployment: $7,500 (15%)

\`\`\`mermaid
pie title Project Budget Distribution
    "Development" : 45
    "Testing" : 25
    "Documentation" : 15
    "Deployment" : 15
\`\`\``
  },
  {
    title: 'Real-world Example',
    content: `# Project Documentation

## Overview
This project implements a **machine learning model** for predicting housing prices using the formula:

$$\\text{Price} = \\beta_0 + \\beta_1 \\cdot \\text{Area} + \\beta_2 \\cdot \\text{Bedrooms} + \\epsilon$$

## Installation

\`\`\`bash
npm install @schmitech/markdown-renderer
# or
yarn add @schmitech/markdown-renderer
\`\`\`

## API Reference

### \`preprocessMarkdown(content: string): string\`

Preprocesses markdown content to handle currency and math notation correctly.

**Parameters:**
- \`content\` - The raw markdown string

**Returns:** Processed markdown string

### Example Usage

\`\`\`typescript
import { MarkdownRenderer } from '@schmitech/markdown-renderer';

function App() {
  const content = "The cost is $100 and the formula is $x^2$";
  return <MarkdownRenderer content={content} />;
}
\`\`\`

## Performance Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Render Time | 15ms | < 20ms |
| Bundle Size | 45KB | < 50KB |
| Memory Usage | 2.3MB | < 5MB |

## Chemical Reactions in the Process

The oxidation process follows: $\\ce{2H2O2 -> 2H2O + O2}$

## Pricing

- Basic Plan: $9.99/month
- Pro Plan: $29.99/month
- Enterprise: $99.99/month

> **Note:** All prices are in USD. Mathematical models show ROI of $r = 1.5x$ where $x$ is your investment.`
  }
];

export const stressTestContent = `# Stress Test Content

${'## Heading\nLorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50)}

### Massive Table
| ${'Column | '.repeat(10)}
| ${'--- | '.repeat(10)}
${Array(50).fill(null).map((_, i) => `| ${'Cell ' + i + ' | '.repeat(10)}`).join('\n')}

### Many Math Expressions
${Array(20).fill(null).map((_, i) => `$x_${i} = \\frac{${i}}{${i + 1}}$`).join(', ')}

### Code Block Spam
${Array(10).fill(null).map((_, i) => `
\`\`\`javascript
function test${i}() {
  console.log("Test ${i}");
}
\`\`\`
`).join('\n')}
`;

export default testCases;