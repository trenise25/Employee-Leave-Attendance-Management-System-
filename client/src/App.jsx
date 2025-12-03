import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import LeaveRequest from './pages/LeaveRequest';
import LeaveApproval from './pages/LeaveApproval';
import MyLeaves from './pages/MyLeaves';
import Attendance from './pages/Attendance';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <Login />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees"
                element={
                    <ProtectedRoute adminOnly>
                        <Employees />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/leave-request"
                element={
                    <ProtectedRoute>
                        <LeaveRequest />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/leave-approval"
                element={
                    <ProtectedRoute adminOnly>
                        <LeaveApproval />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-leaves"
                element={
                    <ProtectedRoute>
                        <MyLeaves />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/attendance"
                element={
                    <ProtectedRoute>
                        <Attendance />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Navbar />
                    <AppRoutes />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
