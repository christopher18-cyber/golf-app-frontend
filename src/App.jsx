import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Regsiter.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import NotFound from "./pages/NotFound.jsx";
import Charities from "./pages/Charities.jsx";
import Scores from "./pages/Scores.jsx";
import Draws from "./pages/Draws.jsx";
import Winners from "./pages/Winners.jsx";
import UserProfile from "./pages/UserProfile.jsx";

// Protected route — must be logged in
function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-950 flex items-center justify-center'>
				<p className='text-white'>Loading...</p>
			</div>
		);
	}

	if (!user) return <Navigate to='/login' />;

	return children;
}

// Admin route — must be logged in AND be admin
function AdminRoute({ children }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-950 flex items-center justify-center'>
				<p className='text-white'>Loading...</p>
			</div>
		);
	}

	if (!user) return <Navigate to='/login' />;
	if (user.role !== "admin") return <Navigate to='/dashboard' />;

	return children;
}

function AppRoutes() {
	return (
		<Routes>
			{/* Public routes */}
			<Route path='/' element={<Home />} />
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
			' // Add inside AppRoutes
			<Route path='/charities' element={<Charities />} />
			<Route path='*' element={<NotFound />} />
			{/* Protected user route */}
			<Route
				path='/dashboard'
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			{/* Protected admin route */}
			<Route
				path='/admin'
				element={
					<AdminRoute>
						<AdminDashboard />
					</AdminRoute>
				}
			/>
			<Route
				path='/scores'
				element={
					<ProtectedRoute>
						<Scores />
					</ProtectedRoute>
				}
			/>
			<Route path='/draws' element={<Draws />} />
			<Route
				path='/winners'
				element={
					<ProtectedRoute>
						<Winners />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/profile'
				element={
					<ProtectedRoute>
						<UserProfile />
					</ProtectedRoute>
				}
			/>
			{/* Catch all — redirect to home */}
			<Route path='*' element={<Navigate to='/' />} />
		</Routes>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</AuthProvider>
	);
}
