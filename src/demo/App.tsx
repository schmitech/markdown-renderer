import React, { useState } from 'react';
import { MarkdownRenderer } from '../MarkdownComponents';
import '../MarkdownStyles.css';
import testCases, { stressTestContent } from './testContent';
import { SampleIntegration } from './SampleIntegration';
import { DebugMath } from './DebugMath';
import './App.css';

function App() {
  const [selectedTest, setSelectedTest] = useState(0);
  const [customContent, setCustomContent] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [disableMath, setDisableMath] = useState(false);
  const [showStressTest, setShowStressTest] = useState(false);
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const currentContent = showStressTest 
    ? stressTestContent 
    : useCustom 
      ? customContent 
      : testCases[selectedTest].content;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Markdown Renderer Test Suite</h1>
        <p>Test the @schmitech/markdown-renderer package with various content types</p>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <h2>Test Cases</h2>
          
          <div className="test-list">
            {testCases.map((test, index) => (
              <button
                key={index}
                className={`test-button ${selectedTest === index && !useCustom && !showStressTest && !showIntegration && !showDebug ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTest(index);
                  setUseCustom(false);
                  setShowStressTest(false);
                  setShowIntegration(false);
                  setShowDebug(false);
                }}
              >
                {test.title}
              </button>
            ))}
            
            <button
              className={`test-button stress ${showStressTest ? 'active' : ''}`}
              onClick={() => {
                setShowStressTest(true);
                setUseCustom(false);
                setShowIntegration(false);
                setShowDebug(false);
              }}
            >
              🔥 Stress Test
            </button>
            
            <button
              className={`test-button custom ${useCustom ? 'active' : ''}`}
              onClick={() => {
                setUseCustom(true);
                setShowStressTest(false);
                setShowIntegration(false);
                setShowDebug(false);
              }}
            >
              ✏️ Custom Input
            </button>
            
            <button
              className={`test-button integration ${showIntegration ? 'active' : ''}`}
              onClick={() => {
                setShowIntegration(true);
                setUseCustom(false);
                setShowStressTest(false);
                setShowDebug(false);
              }}
            >
              💬 Sample Integration
            </button>
            
            <button
              className={`test-button debug ${showDebug ? 'active' : ''}`}
              onClick={() => {
                setShowDebug(true);
                setShowIntegration(false);
                setUseCustom(false);
                setShowStressTest(false);
              }}
            >
              🔍 Debug Math
            </button>
          </div>

          <div className="options">
            <h3>Options</h3>
            <label className="option">
              <input
                type="checkbox"
                checked={disableMath}
                onChange={(e) => setDisableMath(e.target.checked)}
              />
              Disable Math Rendering
            </label>
            <label className="option">
              <input
                type="checkbox"
                checked={showRawOutput}
                onChange={(e) => setShowRawOutput(e.target.checked)}
              />
              Show Raw Output
            </label>
          </div>
        </aside>

        <main className="main-content">
          {showDebug ? (
            <DebugMath />
          ) : showIntegration ? (
            <SampleIntegration />
          ) : useCustom ? (
            <div className="custom-input-container">
              <h2>Custom Markdown Input</h2>
              <textarea
                className="custom-input"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Enter your markdown here...

Try:
- Basic markdown: **bold**, *italic*, [links](https://example.com)
- Math: $x^2 + y^2 = z^2$ or $$\int_0^1 x dx$$
- Chemistry: $\ce{H2O}$ or $\ce{CO2}$
- Currency: $100, $1,234.56
- HTML breaks: Why don't skeletons fight each other?<br>They don't have the guts.
- Code blocks with ```
- Tables with | syntax |"
                rows={10}
              />
            </div>
          ) : (
            <div className="test-info">
              <h2>{showStressTest ? '🔥 Stress Test' : testCases[selectedTest].title}</h2>
              {showStressTest && (
                <p className="warning">⚠️ This test contains a large amount of content to test performance</p>
              )}
            </div>
          )}

          {!showIntegration && !showDebug && (
            <div className="output-section">
              <div className="output-header">
                <h3>Rendered Output</h3>
                {showRawOutput && (
                  <span className="badge">Raw: {currentContent.length} chars</span>
                )}
              </div>
              
              <div className="rendered-output">
                <MarkdownRenderer 
                  content={currentContent} 
                  disableMath={disableMath}
                />
              </div>

              {showRawOutput && (
                <>
                  <h3>Raw Markdown</h3>
                  <pre className="raw-output">
                    <code>{currentContent}</code>
                  </pre>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>
          Testing <code>@schmitech/markdown-renderer</code> v0.1.0 | 
          React {React.version} | 
          <a href="https://github.com/schmitech/markdown-renderer" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
