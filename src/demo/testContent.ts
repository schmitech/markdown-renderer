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
    title: 'HTML Line Breaks',
    content: `## Testing HTML Break Tags

Standard joke with inline HTML:
Why don't skeletons fight each other?<br>They don't have the guts.

Multiple sequential breaks in a paragraph:
First line<br/>Second line<br />Third line

Numbered instructions using breaks instead of markdown:
1)<br>Gather supplies
2)<br>Build the prototype
3)<br>Celebrate the win

Mixed content with bold text and breaks:
**Reminder:** Ship the feature by EOD.<br><br>Escalate if blocked.`
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
    title: 'Inline Code (Single Backticks)',
    content: `## Inline Code Test

This test case verifies that text surrounded by single backticks (\`word\`) renders as inline code and NOT as full code blocks.

### Basic Inline Code

Here's a simple example: \`const x = 42;\` should appear inline.

### Multiple Inline Code Snippets

You can have multiple inline code snippets like \`variable\`, \`function()\`, and \`class\` in the same paragraph.

### Inline Code in Lists

- Item with \`code\` in it
- Another item with \`inline\` code
- List item containing \`multiple\` \`code\` \`snippets\`

### Inline Code in Different Contexts

**Bold text with \`code\` inside** and *italic text with \`code\` too*.

### Edge Cases

- Single character: \`x\`
- Multiple words: \`this is code\`
- With punctuation: \`code!\`, \`code?\`, \`code.\`
- Empty backticks should not break: \`\` (empty)
- Code at start: \`start\` of sentence
- Code at end: end of sentence \`end\`

### Mixed with Block Code

Here's inline code: \`inline\` and here's a block:

\`\`\`javascript
// This should be a block
const block = true;
\`\`\`

And more inline: \`more inline\` code.

### Real-world Example

When using \`OP_HUSKY\`, \`PROJECT_X\`, \`CYBER_OPS\`, \`COUNTER_FRAUD\`, and \`INTEL_ANALYSIS\` compartments, ensure proper access controls.

Compartment Access Failures: 53 denials involved users lacking proper need-to-know for compartments including \`OP_HUSKY\`, \`PROJECT_X\`, \`CYBER_OPS\`, \`COUNTER_FRAUD\`, and \`INTEL_ANALYSIS\`.

Classification Escalation Attempts: 42 denials where users attempted to access documents classified \`SECRET\` or \`TOP_SECRET\`.`
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
    title: 'Wide Tables (Horizontal Scrolling)',
    content: `## Wide Tables for Horizontal Scrolling Test

This test case demonstrates horizontal scrolling with tables that have many columns.

### Wide Data Table (10 Columns)
| ID | Name | Email | Phone | Address | City | State | ZIP | Country | Status |
|----|------|-------|-------|---------|------|-------|-----|---------|--------|
| 1 | John Doe | john.doe@example.com | (555) 123-4567 | 123 Main St | New York | NY | 10001 | USA | Active |
| 2 | Jane Smith | jane.smith@example.com | (555) 234-5678 | 456 Oak Ave | Los Angeles | CA | 90001 | USA | Active |
| 3 | Bob Johnson | bob.johnson@example.com | (555) 345-6789 | 789 Pine Rd | Chicago | IL | 60601 | USA | Inactive |
| 4 | Alice Williams | alice.williams@example.com | (555) 456-7890 | 321 Elm St | Houston | TX | 77001 | USA | Active |
| 5 | Charlie Brown | charlie.brown@example.com | (555) 567-8901 | 654 Maple Dr | Phoenix | AZ | 85001 | USA | Pending |

### Very Wide Financial Table (15 Columns)
| Date | Transaction ID | Description | Category | Amount | Currency | Payment Method | Merchant | Account | Balance | Tax | Fee | Net Amount | Status | Notes | Reference |
|------|----------------|-------------|----------|--------|----------|----------------|----------|---------|---------|-----|-----|------------|--------|-------|-----------|
| 2024-01-15 | TXN-001 | Grocery Store Purchase | Food | $125.50 | USD | Credit Card | Whole Foods | Checking | $2,450.00 | $10.04 | $0.00 | $135.54 | Completed | Weekly groceries | REF-001 |
| 2024-01-16 | TXN-002 | Gas Station | Transportation | $45.00 | USD | Debit Card | Shell | Checking | $2,405.00 | $3.60 | $0.00 | $48.60 | Completed | Fuel | REF-002 |
| 2024-01-17 | TXN-003 | Restaurant | Food | $78.90 | USD | Credit Card | Olive Garden | Checking | $2,326.10 | $6.31 | $0.00 | $85.21 | Completed | Dinner | REF-003 |
| 2024-01-18 | TXN-004 | Online Subscription | Entertainment | $14.99 | USD | Credit Card | Netflix | Checking | $2,311.11 | $1.20 | $0.00 | $16.19 | Completed | Monthly subscription | REF-004 |
| 2024-01-19 | TXN-005 | Utility Bill | Utilities | $156.78 | USD | Bank Transfer | Electric Company | Checking | $2,154.33 | $0.00 | $2.50 | $159.28 | Completed | January bill | REF-005 |

### Ultra-Wide Analytics Table (20 Columns)
| Timestamp | User ID | Session ID | Page | Action | Device | Browser | OS | Country | City | Referrer | Campaign | Source | Medium | Duration | Bounce | Conversion | Revenue | Product | Category |
|-----------|---------|------------|------|--------|--------|---------|----|---------|------|----------|----------|--------|--------|----------|--------|------------|---------|---------|----------|
| 2024-01-15 10:30:22 | U-12345 | SESS-001 | /home | pageview | Desktop | Chrome | Windows | USA | New York | google.com | spring-sale | google | cpc | 245 | No | Yes | $99.99 | Widget A | Electronics |
| 2024-01-15 10:35:18 | U-12346 | SESS-002 | /products | click | Mobile | Safari | iOS | USA | Los Angeles | facebook.com | summer-promo | facebook | social | 180 | No | No | $0.00 | - | - |
| 2024-01-15 10:42:55 | U-12347 | SESS-003 | /checkout | purchase | Desktop | Firefox | Windows | Canada | Toronto | direct | - | direct | none | 320 | No | Yes | $149.99 | Widget B | Electronics |
| 2024-01-15 10:51:12 | U-12348 | SESS-004 | /about | pageview | Tablet | Safari | iPadOS | UK | London | bing.com | brand-campaign | bing | cpc | 95 | Yes | No | $0.00 | - | - |
| 2024-01-15 11:05:33 | U-12349 | SESS-005 | /cart | add_to_cart | Desktop | Edge | Windows | Germany | Berlin | twitter.com | influencer | twitter | social | 210 | No | No | $0.00 | Widget C | Accessories |

### Comparison Table with Many Metrics (12 Columns)
| Product | Price | Rating | Reviews | Sales (Q1) | Sales (Q2) | Sales (Q3) | Sales (Q4) | Total Revenue | Profit Margin | Market Share | Growth % |
|---------|-------|--------|---------|------------|------------|------------|------------|---------------|---------------|--------------|----------|
| Product A | $99.99 | 4.5 | 1,234 | $125,000 | $145,000 | $165,000 | $180,000 | $615,000 | 35% | 12.5% | +15% |
| Product B | $149.99 | 4.7 | 2,456 | $180,000 | $210,000 | $240,000 | $270,000 | $900,000 | 42% | 18.3% | +22% |
| Product C | $79.99 | 4.2 | 856 | $95,000 | $110,000 | $125,000 | $140,000 | $470,000 | 28% | 9.6% | +12% |
| Product D | $199.99 | 4.9 | 3,789 | $250,000 | $290,000 | $330,000 | $380,000 | $1,250,000 | 48% | 25.4% | +28% |
| Product E | $59.99 | 4.0 | 567 | $75,000 | $85,000 | $95,000 | $105,000 | $360,000 | 25% | 7.3% | +8% |

### Project Management Table (14 Columns)
| Task ID | Task Name | Assignee | Priority | Status | Start Date | Due Date | Estimated Hours | Actual Hours | Progress | Dependencies | Tags | Notes | Project | Milestone |
|---------|-----------|----------|---------|--------|------------|----------|-----------------|--------------|----------|--------------|------|-------|---------|-----------|
| TASK-001 | Design Homepage | Alice | High | In Progress | 2024-01-01 | 2024-01-15 | 40 | 32 | 80% | - | design, frontend | Initial mockups complete | Website Redesign | M1 |
| TASK-002 | Implement API | Bob | High | Completed | 2024-01-05 | 2024-01-20 | 60 | 58 | 100% | TASK-001 | backend, api | All endpoints tested | Website Redesign | M1 |
| TASK-003 | Write Tests | Charlie | Medium | In Progress | 2024-01-10 | 2024-01-25 | 30 | 18 | 60% | TASK-002 | testing, qa | Unit tests done | Website Redesign | M2 |
| TASK-004 | Deploy to Staging | David | Medium | Pending | 2024-01-20 | 2024-01-30 | 8 | 0 | 0% | TASK-003 | devops, deployment | Waiting for approval | Website Redesign | M2 |
| TASK-005 | User Documentation | Eve | Low | Not Started | 2024-01-25 | 2024-02-05 | 20 | 0 | 0% | TASK-004 | documentation | - | Website Redesign | M3 |

### Summary
These wide tables should demonstrate:
- ✅ Horizontal scrolling when tables exceed container width
- ✅ Proper column alignment and spacing
- ✅ Readable content even with many columns
- ✅ Responsive behavior on different screen sizes`
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

### SVG Graphics - Analytics Dashboard Icon
\`\`\`svg
<svg width="240" height="180" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="240" height="180" fill="#f8fafc" rx="8"/>

  <!-- Bar Chart -->
  <rect x="30" y="120" width="30" height="40" fill="#3b82f6" rx="4"/>
  <rect x="70" y="90" width="30" height="70" fill="#8b5cf6" rx="4"/>
  <rect x="110" y="70" width="30" height="90" fill="#ec4899" rx="4"/>
  <rect x="150" y="100" width="30" height="60" fill="#f59e0b" rx="4"/>
  <rect x="190" y="110" width="30" height="50" fill="#10b981" rx="4"/>

  <!-- Trend Line -->
  <polyline points="45,130 85,105 125,85 165,115 205,120"
            fill="none" stroke="#ef4444" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Data Points -->
  <circle cx="45" cy="130" r="5" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <circle cx="85" cy="105" r="5" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <circle cx="125" cy="85" r="5" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <circle cx="165" cy="115" r="5" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <circle cx="205" cy="120" r="5" fill="#ef4444" stroke="#fff" stroke-width="2"/>

  <!-- Title -->
  <text x="120" y="25" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="16" font-weight="bold" fill="#1e293b">Revenue Growth</text>

  <!-- Legend -->
  <circle cx="30" cy="45" r="4" fill="#ef4444"/>
  <text x="40" y="49" font-family="Arial, sans-serif" font-size="12" fill="#64748b">Trend</text>
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
    title: 'Charts and Data Visualization',
    content: `## Interactive Charts

### Simple Bar Chart
\`\`\`chart
type: bar
title: Q1 Sales Performance
data: [45000, 52000, 48000]
labels: [January, February, March]
colors: [#3b82f6, #8b5cf6, #ec4899]
\`\`\`

### Table-based Line Chart
\`\`\`chart
type: line
title: Revenue Growth Over Time
| Month | Revenue | Expenses |
|-------|---------|----------|
| Jan   | 100000  | 80000    |
| Feb   | 150000  | 90000    |
| Mar   | 200000  | 110000   |
| Apr   | 180000  | 105000   |
| May   | 220000  | 115000   |
| Jun   | 250000  | 120000   |
\`\`\`

### Pie Chart - Market Share
\`\`\`chart
type: pie
title: Market Share by Product
data: [35, 25, 20, 15, 5]
labels: [Product A, Product B, Product C, Product D, Others]
\`\`\`

### Area Chart - User Growth
\`\`\`chart
type: area
title: Monthly Active Users
| Month | Users  | Premium |
|-------|--------|---------|
| Jan   | 10000  | 1000    |
| Feb   | 15000  | 1500    |
| Mar   | 22000  | 2200    |
| Apr   | 28000  | 3000    |
| May   | 35000  | 4000    |
| Jun   | 42000  | 5200    |
\`\`\`

### Multi-Series Bar Chart
\`\`\`chart
type: bar
title: Department Performance Comparison
| Department | Q1    | Q2    | Q3    | Q4    |
|------------|-------|-------|-------|-------|
| Sales      | 45000 | 52000 | 48000 | 60000 |
| Marketing  | 35000 | 38000 | 42000 | 45000 |
| Support    | 25000 | 28000 | 30000 | 32000 |
\`\`\`

### Stacked Bar with Targets
\`\`\`chart
type: bar
title: Quarterly Subscription Revenue
description: Comparing new business vs expansion ARR with a quarterly goal.
stacked: true
showLegend: true
formatter: {"format":"currency","currency":"USD","minimumFractionDigits":0}
referenceLines: [{"y":80000,"label":"Quarterly Goal","color":"#d946ef","strokeDasharray":"6 3"}]
| Quarter | New ARR | Expansion ARR |
|---------|---------|----------------|
| Q1      | 32000   | 18000          |
| Q2      | 36000   | 21000          |
| Q3      | 38000   | 22000          |
| Q4      | 42000   | 26000          |
\`\`\`

### Dual Axis Line Chart
\`\`\`chart
type: line
title: Office Climate & Humidity
showLegend: true
xAxisLabel: Month
yAxisLabel: Temperature (°F)
yAxisRightLabel: Humidity (%)
series: [
  {"key":"Temperature","name":"Temperature","color":"#f97316","yAxisId":"left","strokeWidth":3},
  {"key":"Humidity","name":"Humidity","color":"#0ea5e9","yAxisId":"right","strokeWidth":2}
]
| Month | Temperature | Humidity |
|-------|-------------|----------|
| Jan   | 68          | 40       |
| Feb   | 70          | 38       |
| Mar   | 72          | 42       |
| Apr   | 74          | 48       |
| May   | 76          | 50       |
| Jun   | 78          | 55       |
\`\`\`

### Composed Pipeline Chart
\`\`\`chart
type: composed
title: Quarterly Pipeline Health
description: Combining bars, lines, and scatter to show pipeline progression.
showLegend: true
xAxisLabel: Stage
series: [
  {"key":"Leads","type":"bar","name":"Leads","color":"#3b82f6"},
  {"key":"Opportunities","type":"bar","name":"Opportunities","color":"#10b981"},
  {"key":"Conversion","type":"line","name":"Conversion %","color":"#f59e0b","yAxisId":"right","strokeWidth":3},
  {"key":"Avg Deal","type":"scatter","name":"Avg Deal","color":"#a855f7","yAxisId":"right"}
]
yAxisLabel: Volume
yAxisRightLabel: %
| Stage        | Leads | Opportunities | Conversion | Avg Deal |
|--------------|-------|---------------|------------|----------|
| Awareness    | 1200  | 300           | 0.25       | 15000    |
| Consideration| 800   | 240           | 0.30       | 21000    |
| Proposal     | 400   | 140           | 0.35       | 26000    |
| Negotiation  | 220   | 90            | 0.41       | 31000    |
| Closed Won   | 120   | 70            | 0.58       | 38000    |
\`\`\`

### Scatter Plot with Trend Line
\`\`\`chart
type: scatter
title: NPS vs Expansion Spend
description: Customer loyalty plotted against new upsell dollars.
showGrid: true
xKey: NPS
xAxisLabel: Net Promoter Score
yAxisLabel: Expansion Revenue ($)
referenceLines: [{"x":50,"label":"Neutral NPS","color":"#9ca3af"}]
| NPS | Expansion |
|-----|-----------|
| 20  | 12000     |
| 35  | 18000     |
| 45  | 26000     |
| 55  | 34000     |
| 60  | 42000     |
| 75  | 52000     |
| 80  | 61000     |
\`\`\`

### Compact KPI Sparkline
\`\`\`chart
type: area
title: Daily Active Devices
description: Compact formatting keeps the axis readable even with large counts.
formatter: {"format":"compact","minimumFractionDigits":1,"maximumFractionDigits":1}
| Day | Active Devices |
|-----|----------------|
| Mon | 154000         |
| Tue | 162000         |
| Wed | 158000         |
| Thu | 171000         |
| Fri | 185000         |
| Sat | 192000         |
| Sun | 178000         |
\`\`\`

### Real-world Example with Context
Our Q2 revenue reached $250,000, representing a 14% increase from Q1. Here's the breakdown:

\`\`\`chart
type: bar
title: Q2 Revenue by Channel
data: [85000, 95000, 70000]
labels: [Direct Sales, Online, Partners]
colors: [#10b981, #3b82f6, #f59e0b]
\`\`\`

The online channel showed the strongest growth at $95,000, driven by our new e-commerce platform launch in Q1.`
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
  },
  {
    title: 'Vertical Scrolling Test',
    content: `# Vertical Scrolling Test

This test case demonstrates **vertical scrolling** with very long content. All content should scroll vertically instead of being truncated.

---

## Very Long Paragraph

${'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. '.repeat(30)}

---

## Long Code Block

\`\`\`javascript
// This is a very long code block to test vertical scrolling
${Array(80).fill(null).map((_, i) => `function exampleFunction${i}() {
  const variable${i} = "This is line ${i} of a very long code block";
  console.log("Processing item ${i}");
  const data${i} = {
    id: ${i},
    name: "Item ${i}",
    description: "This is a detailed description for item ${i} that contains a lot of text to make the code block longer",
    metadata: {
      created: new Date(),
      updated: new Date(),
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
      properties: {
        color: "blue",
        size: "large",
        weight: ${i * 10},
        category: "test"
      }
    },
    process: function() {
      return this.id * 2;
    }
  };
  return data${i};
}`).join('\n\n')}
\`\`\`

---

## Long Table (Many Rows)

| ID | Name | Description | Status | Created | Updated | Version | Tags | Notes |
|----|------|-------------|--------|---------|---------|---------|------|-------|
${Array(100).fill(null).map((_, i) => `| ${i + 1} | Item ${i + 1} | This is a detailed description for item ${i + 1} that contains multiple sentences and lots of information about its properties and characteristics. | ${i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive'} | 2024-01-${String((i % 28) + 1).padStart(2, '0')} | 2024-01-${String((i % 28) + 1).padStart(2, '0')} | 1.${i} | tag1, tag2, tag3 | This item has additional notes that provide more context and information. |`).join('\n')}

---

## Long Math Content

${Array(25).fill(null).map((_, i) => `### Equation ${i + 1}

The formula for calculation ${i + 1} is:

$$x_${i} = \\sum_{j=0}^{${i}} \\frac{${i} \\cdot j}{j+1} + \\int_0^{${i}} e^{-t^2} dt$$

This can be simplified to:

$$x_${i} = \\frac{${i}(${i}+1)}{2} \\cdot \\frac{\\sqrt{\\pi}}{2} \\text{erf}(${i})$$

Where $\\text{erf}(x)$ is the error function defined as:

$$\\text{erf}(x) = \\frac{2}{\\sqrt{\\pi}} \\int_0^x e^{-t^2} dt$$

The relationship between these functions can be expressed as:

$$\\lim_{n \\to \\infty} \\sum_{i=0}^{n} x_i = \\frac{\\pi}{2}$$

`).join('\n')}

---

## Long List Content

${Array(150).fill(null).map((_, i) => `- Item ${i + 1}: This is a detailed list item that contains a lot of information. It describes various aspects of the item including its properties, characteristics, and relationships to other items in the system. The content is intentionally long to test vertical scrolling capabilities. Each item should be fully visible and the list should scroll smoothly.`).join('\n')}

---

## Mixed Long Content

### Section 1: Narrative Text

${'Once upon a time, in a land far, far away, there lived a developer who was building a markdown renderer. This developer wanted to ensure that long content would scroll properly instead of being truncated. They tested various scenarios including long paragraphs, code blocks, tables, and mathematical expressions. The goal was to create a seamless user experience where content of any length could be viewed comfortably. '.repeat(40)}

### Section 2: TypeScript Code Examples

\`\`\`typescript
${Array(60).fill(null).map((_, i) => `// Example ${i + 1}
interface Example${i} {
  id: number;
  name: string;
  description: string;
  metadata: {
    created: Date;
    updated: Date;
    version: string;
    tags: string[];
    properties: {
      color: string;
      size: string;
      weight: number;
      category: string;
    };
  };
}

const example${i}: Example${i} = {
  id: ${i},
  name: "Example ${i}",
  description: "This is example ${i} with detailed description that explains its purpose and usage",
  metadata: {
    created: new Date(),
    updated: new Date(),
    version: "1.0.${i}",
    tags: ["tag1", "tag2", "tag3"],
    properties: {
      color: "blue",
      size: "large",
      weight: ${i * 10},
      category: "test"
    }
  }
};

function processExample${i}(example: Example${i}): string {
  return \`Processing \${example.name} with ID \${example.id}\`;
}`).join('\n\n')}
\`\`\`

### Section 3: Data Table

| ID | Name | Description | Status | Created | Updated | Version | Tags |
|----|------|-------------|--------|---------|---------|---------|------|
${Array(75).fill(null).map((_, i) => `| ${i} | Item ${i} | This is a detailed description for item ${i} that contains multiple sentences and lots of information about its properties and characteristics. The description is intentionally long to test how tables handle vertical scrolling. | ${i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive'} | 2024-01-${String((i % 28) + 1).padStart(2, '0')} | 2024-01-${String((i % 28) + 1).padStart(2, '0')} | 1.${i} | tag1, tag2, tag3 |`).join('\n')}

---

## Summary

This test case should demonstrate:
- ✅ Long paragraphs scroll vertically
- ✅ Long code blocks scroll vertically
- ✅ Long tables scroll vertically
- ✅ Long lists scroll vertically
- ✅ Long math content scrolls vertically
- ✅ Mixed long content scrolls properly
- ✅ The page remains usable even with very long content
- ✅ No content is truncated or cut off`
  }
];

export const stressTestContent = `# Stress Test Content

${Array(50).fill(null).map((_, i) => `## Heading ${i + 1}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

`).join('\n')}

### Massive Table

| ${'Column | '.repeat(10)}
| ${'--- | '.repeat(10)}
${Array(50).fill(null).map((_, i) => `| ${'Cell ' + i + ' | '.repeat(10)}`).join('\n')}

### Many Math Expressions

${Array(20).fill(null).map((_, i) => `The formula $x_${i} = \\frac{${i}}{${i + 1}}$ represents the relationship between variables.`).join(' ')}

### Code Block Spam

${Array(10).fill(null).map((_, i) => `\`\`\`javascript
function test${i}() {
  console.log("Test ${i}");
  return ${i} * 2;
}
\`\`\`

`).join('\n')}
`;

export default testCases;
