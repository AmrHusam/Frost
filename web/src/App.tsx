import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './shared/store/useAuthStore';

// Layouts (Mock imports for now)
const AgentLayout = React.lazy(() => import('./apps/agent/AgentLayout'));
const AdminLayout = React.lazy(() => import('./apps/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./apps/admin/components/AdminDashboard'));
const LoginPage = React.lazy(() => import('./apps/shared/LoginPage'));

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated() || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default function App() {
    return (
        <BrowserRouter>
            <React.Suspense fallback={<div className="flex-center h-screen">Loading...</div>}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Agent Routes */}
                    <Route
                        path="/agent/*"
                        element={
                            <ProtectedRoute allowedRoles={['AGENT']}>
                                <AgentLayout />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="campaigns" element={<div>Campaigns View (Placeholder)</div>} />
                        <Route path="users" element={<div>Users View (Placeholder)</div>} />
                        <Route path="compliance" element={<div>Compliance View (Placeholder)</div>} />
                        <Route path="stats" element={<div>Stats View (Placeholder)</div>} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </React.Suspense>
        </BrowserRouter>
    );
}
