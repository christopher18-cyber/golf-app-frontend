import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getMyProfileApi, updatePlanApi } from "../services/userService.js";
import { getAllCharitiesApi } from "../services/charityService.js";
import { updateCharitySelectionApi } from "../services/userService.js";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {
	const { user, token, logout } = useAuth();
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [charities, setCharities] = useState([]);
	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const [profileRes, charitiesRes] = await Promise.all([
			getMyProfileApi(token),
			getAllCharitiesApi(),
		]);
		if (profileRes?.success) setProfile(profileRes.data);
		if (charitiesRes?.success) setCharities(charitiesRes.data);
	};

	const showMessage = (type, text) => {
		setMessage({ type, text });
		setTimeout(() => setMessage(null), 3000);
	};

	const handleSelectPlan = async (plan) => {
		setLoading(true);
		const res = await updatePlanApi({ plan }, token);
		if (res?.success) {
			fetchData();
			showMessage("success", `Plan updated to ${plan}`);
		} else {
			showMessage("error", res?.message);
		}
		setLoading(false);
	};

	const handleSelectCharity = async (charityId) => {
		const res = await updateCharitySelectionApi(
			{ charity_id: charityId, charity_pct: 10 },
			token,
		);
		if (res?.success) {
			fetchData();
			showMessage("success", "Charity updated");
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			<nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
				<Link to='/' className='text-xl font-bold text-green-500'>
					GolfCharity
				</Link>
				<div className='flex items-center gap-4'>
					<Link
						to='/dashboard'
						className='text-gray-400 hover:text-white text-sm transition'>
						← Dashboard
					</Link>
					<button
						onClick={handleLogout}
						className='text-sm text-red-400 hover:text-red-300 transition'>
						Logout
					</button>
				</div>
			</nav>

			<div className='max-w-2xl mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold mb-8'>My Profile</h1>

				{message && (
					<div
						className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500 text-green-400" : "bg-red-500/10 border border-red-500 text-red-400"}`}>
						{message.text}
					</div>
				)}

				{/* Account Info */}
				<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6'>
					<h2 className='text-lg font-bold mb-4'>Account Info</h2>
					<div className='space-y-3'>
						<div className='flex justify-between items-center'>
							<p className='text-gray-400'>Email</p>
							<p className='font-semibold'>{profile?.email}</p>
						</div>
						<div className='flex justify-between items-center'>
							<p className='text-gray-400'>Role</p>
							<span className='bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full capitalize'>
								{profile?.role}
							</span>
						</div>
						<div className='flex justify-between items-center'>
							<p className='text-gray-400'>Member since</p>
							<p className='font-semibold'>
								{profile?.created_at
									? new Date(profile.created_at).toLocaleDateString()
									: "-"}
							</p>
						</div>
					</div>
				</div>

				{/* Subscription */}
				<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6'>
					<h2 className='text-lg font-bold mb-2'>Subscription</h2>
					<div className='flex justify-between items-center mb-4'>
						<p className='text-gray-400'>Current Plan</p>
						<div className='flex items-center gap-2'>
							<p className='font-semibold capitalize'>
								{profile?.plan || "None"}
							</p>
							<span
								className={`text-xs px-2 py-1 rounded-full capitalize ${profile?.plan_status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
								{profile?.plan_status}
							</span>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<button
							onClick={() => handleSelectPlan("monthly")}
							disabled={loading || profile?.plan === "monthly"}
							className={`py-3 rounded-xl font-semibold text-sm transition ${profile?.plan === "monthly" ? "bg-green-500 text-white" : "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"} disabled:opacity-50`}>
							Monthly
						</button>
						<button
							onClick={() => handleSelectPlan("yearly")}
							disabled={loading || profile?.plan === "yearly"}
							className={`py-3 rounded-xl font-semibold text-sm transition ${profile?.plan === "yearly" ? "bg-green-500 text-white" : "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"} disabled:opacity-50`}>
							Yearly
						</button>
					</div>
				</div>

				{/* Charity */}
				<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
					<h2 className='text-lg font-bold mb-2'>My Charity</h2>
					<p className='text-gray-400 text-sm mb-4'>
						Currently donating {profile?.charity_pct || 10}% of subscription
					</p>
					<div className='space-y-3'>
						{charities.map((charity) => (
							<div
								key={charity.id}
								onClick={() => handleSelectCharity(charity.id)}
								className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition border ${profile?.charity === charity.id ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-gray-800 hover:border-gray-600"}`}>
								<div>
									<p className='font-semibold'>{charity.name}</p>
									<p className='text-gray-400 text-sm'>{charity.description}</p>
								</div>
								{profile?.charity === charity.id && (
									<span className='text-green-400 text-lg'>✓</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
