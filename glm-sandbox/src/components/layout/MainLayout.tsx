import { useState } from 'react';
import { ControlPanel } from '../controls/ControlPanel';
import { TwoSpacesVisualization } from '../charts/TwoSpacesVisualization';
import { ChatAssistant } from '../ui/ChatAssistant';
import { Blog } from '../blogs/Blog';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Control Panel */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <ControlPanel />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GLM Learning Sandbox</h1>
              <p className="text-sm text-gray-600">Interactive Generalized Linear Models</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main area: Blog above the visualization, centered with spacing and scroll when needed */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Blog />

            <div className="mt-6">
              <TwoSpacesVisualization />
            </div>
          </div>
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};
