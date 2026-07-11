import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Loading from '../components/common/Loading';

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Alerts = lazy(() => import('../pages/Alerts/Alerts'));
const Emergencies = lazy(() => import('../pages/Emergencies/Emergencies'));
const Analytics = lazy(() => import('../pages/Analytics/Analytics'));
const HelmetDetails = lazy(() => import('../pages/HelmetDetails/HelmetDetails'));

function LazyFallback() {
  return (
    <div style={{ padding: 48 }}>
      <Loading message="Loading page..." />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/emergencies" element={<Emergencies />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/helmet/:helmetId" element={<HelmetDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
