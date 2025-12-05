import React, { useState } from 'react';
import { MarkdownRenderer } from '../MarkdownComponents';
import '../MarkdownStyles.css';
import testCases, { stressTestContent, streamingChartStages, multiChartStreamingContent } from './testContent';
import { SampleIntegration } from './SampleIntegration';
import { DebugMath } from './DebugMath';
import './App.css';

type ThemeMode = 'system' | 'light' | 'dark';

const inlineTableTestIndex = testCases.findIndex(
  (test) => test.title === 'LLM Inline Table Response'
);

function App() {
  const [selectedTest, setSelectedTest] = useState(0);
  const [customContent, setCustomContent] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [disableMath, setDisableMath] = useState(false);
  const [showStressTest, setShowStressTest] = useState(false);
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showStreamingTest, setShowStreamingTest] = useState(false);
  const [streamingStage, setStreamingStage] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showMultiChart, setShowMultiChart] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const selectedTestCase = testCases[selectedTest];

  // Determine the effective theme class for the markdown content
  const getThemeClass = (): string => {
    if (themeMode === 'light') return 'light';
    if (themeMode === 'dark') return 'dark';
    return ''; // system preference - no class, CSS handles it
  };

  const currentContent = showStreamingTest
    ? streamingChartStages.stages[streamingStage]
    : showMultiChart
      ? multiChartStreamingContent
      : showStressTest
        ? stressTestContent
        : useCustom
          ? customContent
          : testCases[selectedTest].content;

  // Start streaming simulation
  const startStreamingSimulation = () => {
    setStreamingStage(0);
    setIsStreaming(true);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage >= streamingChartStages.stages.length) {
        clearInterval(interval);
        setIsStreaming(false);
      } else {
        setStreamingStage(stage);
      }
    }, 300); // Simulate ~300ms between chunks
  };

  // Reset to final complete state
  const showCompleteChart = () => {
    setStreamingStage(streamingChartStages.stages.length - 1);
    setIsStreaming(false);
  };

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
                className={`test-button ${selectedTest === index && !useCustom && !showStressTest && !showIntegration && !showDebug && !showStreamingTest && !showMultiChart ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTest(index);
                  setUseCustom(false);
                  setShowStressTest(false);
                  setShowIntegration(false);
                  setShowDebug(false);
                  setShowStreamingTest(false);
                  setShowMultiChart(false);
                }}
              >
                {test.title}
              </button>
            ))}
            
            {inlineTableTestIndex >= 0 && (
              <button
                className={`test-button inline-table ${selectedTest === inlineTableTestIndex && !useCustom && !showStressTest && !showIntegration && !showDebug && !showStreamingTest && !showMultiChart ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTest(inlineTableTestIndex);
                  setUseCustom(false);
                  setShowStressTest(false);
                  setShowIntegration(false);
                  setShowDebug(false);
                  setShowStreamingTest(false);
                  setShowMultiChart(false);
                }}
              >
                🧪 LLM Inline Table
              </button>
            )}
            
            <button
              className={`test-button stress ${showStressTest ? 'active' : ''}`}
              onClick={() => {
                setShowStressTest(true);
                setUseCustom(false);
                setShowIntegration(false);
                setShowDebug(false);
                setShowStreamingTest(false);
                setShowMultiChart(false);
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
                setShowStreamingTest(false);
                setShowMultiChart(false);
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
                setShowStreamingTest(false);
                setShowMultiChart(false);
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
                setShowStreamingTest(false);
                setShowMultiChart(false);
              }}
            >
              🔍 Debug Math
            </button>

            <button
              className={`test-button streaming ${showStreamingTest ? 'active' : ''}`}
              onClick={() => {
                setShowStreamingTest(true);
                setShowDebug(false);
                setShowIntegration(false);
                setUseCustom(false);
                setShowStressTest(false);
                setShowMultiChart(false);
                setStreamingStage(0);
              }}
            >
              📊 Chart Streaming
            </button>

            <button
              className={`test-button multichart ${showMultiChart ? 'active' : ''}`}
              onClick={() => {
                setShowMultiChart(true);
                setShowStreamingTest(false);
                setShowDebug(false);
                setShowIntegration(false);
                setUseCustom(false);
                setShowStressTest(false);
              }}
            >
              📈 Multi-Chart Test
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

            <h3>Theme</h3>
            <div className="theme-selector">
              <label className="theme-option">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={themeMode === 'system'}
                  onChange={() => setThemeMode('system')}
                />
                System
              </label>
              <label className="theme-option">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={themeMode === 'light'}
                  onChange={() => setThemeMode('light')}
                />
                Light
              </label>
              <label className="theme-option">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={themeMode === 'dark'}
                  onChange={() => setThemeMode('dark')}
                />
                Dark
              </label>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {showDebug ? (
            <DebugMath />
          ) : showIntegration ? (
            <SampleIntegration />
          ) : showStreamingTest ? (
            <div className="streaming-test-container">
              <h2>📊 Chart Streaming Simulation</h2>
              <p>This test simulates how charts handle streaming data from an LLM response.</p>

              <div className="streaming-controls" style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={startStreamingSimulation}
                  disabled={isStreaming}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isStreaming ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isStreaming ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isStreaming ? 'Streaming...' : 'Start Streaming Simulation'}
                </button>

                <button
                  onClick={showCompleteChart}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Show Complete Chart
                </button>

                <button
                  onClick={() => setStreamingStage(0)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="streaming-status" style={{
                padding: '10px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                <strong>Stage:</strong> {streamingStage + 1} / {streamingChartStages.stages.length}
                {isStreaming && <span style={{ marginLeft: '10px', color: '#3b82f6' }}>● Streaming</span>}
              </div>
            </div>
          ) : showMultiChart ? (
            <div className="test-info">
              <h2>📈 Multiple Charts - Streaming Stress Test</h2>
              <p>Tests rendering multiple charts simultaneously, common in LLM comprehensive analysis.</p>
            </div>
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
              {!showStressTest && selectedTestCase?.title === 'LLM Inline Table Response' && (
                <p className="note">
                  This reproduces an LLM response where a table immediately follows punctuation,
                  ensuring our preprocessing still renders the table correctly even when this package
                  is embedded in another application.
                </p>
              )}
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
              
              <div className={`rendered-output ${themeMode === 'dark' ? 'dark-mode' : themeMode === 'light' ? 'light-mode' : ''}`}>
                <MarkdownRenderer
                  content={currentContent}
                  disableMath={disableMath}
                  className={getThemeClass()}
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
