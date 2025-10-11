import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <MainLayout />
      </div>
    </ErrorBoundary>
  );
}

export default App;
