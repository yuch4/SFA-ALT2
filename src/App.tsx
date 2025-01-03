import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/auth-provider';
import { MainLayout } from './layouts/main-layout';
import { DashboardView } from './features/dashboard/dashboard-view';
import { LoginView } from './features/auth/login-view';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardView />} />
          {/* 他のルートはここに追加 */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
