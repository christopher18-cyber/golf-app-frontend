import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUserApi } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const response = await loginUserApi(formData);

		if (response?.success) {
			login(response.user, response.token);
			if (response.user.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/dashboard");
			}
		} else {
			setError(response?.message || "Something went wrong");
		}

		setLoading(false);
	};

	return (
		<div className='min-h-screen bg-gray-950 flex items-center justify-center px-4'>
			<div className='w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl'>
				<h1 className='text-3xl font-bold text-white mb-2'>Welcome Back</h1>
				<p className='text-gray-400 mb-8'>Login to your account</p>

				{error && (
					<div className='bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6'>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-5'>
					<div>
						<label className='text-gray-400 text-sm mb-1 block'>Email</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							placeholder='you@example.com'
							className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500'
							required
						/>
					</div>

					<div>
						<label className='text-gray-400 text-sm mb-1 block'>Password</label>
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							placeholder='Your password'
							className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500'
							required
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50'>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className='text-gray-400 text-sm text-center mt-6'>
					Don't have an account?{" "}
					<Link to='/register' className='text-green-500 hover:underline'>
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
