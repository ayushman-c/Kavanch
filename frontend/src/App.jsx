import { Suspense } from 'react';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRouter from './router/AppRouter';
import Loading from './components/common/Loading';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SocketProvider>
          <Suspense fallback={<Loading message="Starting application..." />}>
            <AppRouter />
          </Suspense>
        </SocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
