import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
	getMyScoresApi,
	addScoreApi,
	deleteScoreApi,
} from "../services/scoreService";
import { getAllCharitiesApi } from "../services/charityService";
import {
	updateCharitySelectionApi,
	updatePlanApi,
	getMyProfileApi,
} from "../services/userService";
import { getMyWinningsApi } from "../services/winnerService";
import { getPublishedDrawsApi } from "../services/drawService";

export default function Dashboard() {
	const { user, token, logout } = useAuth();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("overview");
	const [profile, setProfile] = useState(null);
	const [scores, setScores] = useState([]);
	const [charities, setCharities] = useState([]);
	const [winnings, setWinnings] = useState([]);
	const [draws, setDraws] = useState([]);
	const [newScore, setNewScore] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		fetchAll();
	}, []);

	const fetchAll = async () => {
		const [profileRes, scoresRes, charitiesRes, winningsRes, drawsRes] =
			await Promise.all([
				getMyProfileApi(token),
				getMyScoresApi(token),
				getAllCharitiesApi(),
				getMyWinningsApi(token),
				getPublishedDrawsApi(),
			]);
		if (profileRes?.success) setProfile(profileRes.data);
		if (scoresRes?.success) setScores(scoresRes.data);
		if (charitiesRes?.success) setCharities(charitiesRes.data);
		if (winningsRes?.success) setWinnings(winningsRes.data);
		if (drawsRes?.success) setDraws(drawsRes.data);
	};

	const handleAddScore = async () => {
		if (!newScore) return;
		setLoading(true);
		const res = await addScoreApi({ score: Number(newScore) }, token);
		if (res?.success) {
			setNewScore("");
			fetchAll();
			setMessage({ type: "success", text: "Score added successfully" });
		} else {
			setMessage({ type: "error", text: res?.message });
		}
		setLoading(false);
		setTimeout(() => setMessage(null), 3000);
	};

	const handleDeleteScore = async (id) => {
		const res = await deleteScoreApi(id, token);
		if (res?.success) fetchAll();
	};

	const handleSelectCharity = async (charityId) => {
		const res = await updateCharitySelectionApi(
			{ charity_id: charityId, charity_pct: 10 },
			token,
		);
		if (res?.success) {
			fetchAll();
			setMessage({ type: "success", text: "Charity updated successfully" });
			setTimeout(() => setMessage(null), 3000);
		}
	};

	const handleSelectPlan = async (plan) => {
		const res = await updatePlanApi({ plan }, token);
		if (res?.success) {
			fetchAll();
			setMessage({ type: "success", text: `Plan updated to ${plan}` });
			setTimeout(() => setMessage(null), 3000);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const tabs = ["overview", "scores", "charity", "draws", "winnings"];

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			{/* Navbar */}
			<nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
				<h1 className='text-xl font-bold text-green-500'>GolfCharity</h1>
				<div className='flex items-center gap-4'>
					<p className='text-gray-400 text-sm hidden md:block'>{user?.email}</p>
					<button
						onClick={handleLogout}
						className='text-sm text-gray-400 hover:text-white transition'>
						Logout
					</button>
				</div>
				<div className='flex items-center gap-4'>
					<Link
						to='/scores'
						className='text-gray-400 hover:text-white text-sm transition'>
						Scores
					</Link>
					<Link
						to='/draws'
						className='text-gray-400 hover:text-white text-sm transition'>
						Draws
					</Link>
					<Link
						to='/winners'
						className='text-gray-400 hover:text-white text-sm transition'>
						Winnings
					</Link>
					<Link
						to='/profile'
						className='text-gray-400 hover:text-white text-sm transition'>
						Profile
					</Link>
					<button
						onClick={handleLogout}
						className='text-sm text-red-400 hover:text-red-300 transition'>
						Logout
					</button>
				</div>
			</nav>

			<div className='max-w-5xl mx-auto px-4 py-8'>
				{/* Message */}
				{message && (
					<div
						className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500 text-green-400" : "bg-red-500/10 border border-red-500 text-red-400"}`}>
						{message.text}
					</div>
				)}

				{/* Tabs */}
				<div className='flex gap-2 flex-wrap mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${activeTab === tab ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
							{tab}
						</button>
					))}
				</div>

				{/* OVERVIEW TAB */}
				{activeTab === "overview" && (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Subscription Status */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h3 className='text-gray-400 text-sm mb-1'>Subscription</h3>
							<p className='text-2xl font-bold capitalize'>
								{profile?.plan || "None"}
							</p>
							<span
								className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${profile?.plan_status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
								{profile?.plan_status || "inactive"}
							</span>
							{profile?.plan_status !== "active" && (
								<div className='mt-4 flex gap-3'>
									<button
										onClick={() => handleSelectPlan("monthly")}
										className='flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition'>
										Monthly
									</button>
									<button
										onClick={() => handleSelectPlan("yearly")}
										className='flex-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-sm py-2 rounded-lg transition'>
										Yearly
									</button>
								</div>
							)}
						</div>

						{/* Scores Summary */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h3 className='text-gray-400 text-sm mb-1'>My Scores</h3>
							<p className='text-2xl font-bold'>{scores.length} / 5</p>
							<p className='text-gray-500 text-sm mt-1'>scores entered</p>
							<button
								onClick={() => setActiveTab("scores")}
								className='mt-4 text-green-500 text-sm hover:underline'>
								Manage scores →
							</button>
						</div>

						{/* Charity */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h3 className='text-gray-400 text-sm mb-1'>My Charity</h3>
							<p className='text-2xl font-bold'>
								{profile?.charity
									? charities.find((c) => c.id === profile.charity)?.name ||
										"Selected"
									: "Not selected"}
							</p>
							<p className='text-gray-500 text-sm mt-1'>
								{profile?.charity_pct || 10}% of subscription donated
							</p>
							<button
								onClick={() => setActiveTab("charity")}
								className='mt-4 text-green-500 text-sm hover:underline'>
								Change charity →
							</button>
						</div>

						{/* Winnings */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h3 className='text-gray-400 text-sm mb-1'>Total Winnings</h3>
							<p className='text-2xl font-bold text-green-500'>
								£
								{winnings
									.reduce((acc, w) => acc + Number(w.prize_amount), 0)
									.toFixed(2)}
							</p>
							<p className='text-gray-500 text-sm mt-1'>
								{winnings.length} draw(s) won
							</p>
							<button
								onClick={() => setActiveTab("winnings")}
								className='mt-4 text-green-500 text-sm hover:underline'>
								View winnings →
							</button>
						</div>
					</div>
				)}

				{/* SCORES TAB */}
				{activeTab === "scores" && (
					<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
						<h2 className='text-xl font-bold mb-6'>My Scores</h2>

						{/* Add score */}
						<div className='flex gap-3 mb-8'>
							<input
								type='number'
								min='1'
								max='45'
								value={newScore}
								onChange={(e) => setNewScore(e.target.value)}
								placeholder='Enter score (1-45)'
								className='flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500'
							/>
							<button
								onClick={handleAddScore}
								disabled={loading}
								className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50'>
								{loading ? "Adding..." : "Add"}
							</button>
						</div>

						{/* Score list */}
						{scores.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No scores yet — add your first score above
							</p>
						) : (
							<div className='space-y-3'>
								{scores.map((s, i) => (
									<div
										key={s.id}
										className='flex items-center justify-between bg-gray-800 px-5 py-4 rounded-xl'>
										<div className='flex items-center gap-4'>
											<span className='text-gray-500 text-sm'>#{i + 1}</span>
											<span className='text-2xl font-bold text-green-500'>
												{s.score}
											</span>
											<span className='text-gray-400 text-sm'>
												{s.played_on}
											</span>
										</div>
										<button
											onClick={() => handleDeleteScore(s.id)}
											className='text-red-400 hover:text-red-300 text-sm transition'>
											Delete
										</button>
									</div>
								))}
							</div>
						)}

						<p className='text-gray-600 text-xs mt-4 text-center'>
							Only your latest 5 scores are kept. Adding a 6th removes the
							oldest.
						</p>
					</div>
				)}

				{/* CHARITY TAB */}
				{activeTab === "charity" && (
					<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
						<h2 className='text-xl font-bold mb-2'>Select a Charity</h2>
						<p className='text-gray-400 text-sm mb-6'>
							At least 10% of your subscription goes to your chosen charity
						</p>

						{charities.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No charities available yet
							</p>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{charities.map((charity) => (
									<div
										key={charity.id}
										className={`rounded-xl p-5 border cursor-pointer transition ${profile?.charity === charity.id ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-gray-800 hover:border-gray-600"}`}
										onClick={() => handleSelectCharity(charity.id)}>
										<h3 className='font-bold text-lg mb-1'>{charity.name}</h3>
										<p className='text-gray-400 text-sm'>
											{charity.description}
										</p>
										{profile?.charity === charity.id && (
											<span className='mt-3 inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full'>
												Currently selected ✓
											</span>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* DRAWS TAB */}
				{activeTab === "draws" && (
					<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
						<h2 className='text-xl font-bold mb-6'>Published Draws</h2>

						{draws.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No draws published yet
							</p>
						) : (
							<div className='space-y-4'>
								{draws.map((draw) => (
									<div key={draw.id} className='bg-gray-800 rounded-xl p-5'>
										<div className='flex items-center justify-between mb-3'>
											<p className='font-bold'>{draw.draw_date}</p>
											<span className='bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full capitalize'>
												{draw.status}
											</span>
										</div>
										<div className='flex gap-2 flex-wrap'>
											{draw.drawn_numbers?.map((num, i) => (
												<span
													key={i}
													className='bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm'>
													{num}
												</span>
											))}
										</div>
										<p className='text-gray-400 text-sm mt-3'>
											Jackpot Pool: £{Number(draw.jackpot_pool).toFixed(2)}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* WINNINGS TAB */}
				{activeTab === "winnings" && (
					<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
						<h2 className='text-xl font-bold mb-6'>My Winnings</h2>

						{winnings.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								No winnings yet — keep playing!
							</p>
						) : (
							<div className='space-y-4'>
								{winnings.map((w) => (
									<div key={w.id} className='bg-gray-800 rounded-xl p-5'>
										<div className='flex items-center justify-between mb-2'>
											<p className='font-bold text-green-500 text-xl'>
												£{Number(w.prize_amount).toFixed(2)}
											</p>
											<span
												className={`text-xs px-3 py-1 rounded-full capitalize ${w.status === "paid" ? "bg-green-500/20 text-green-400" : w.status === "approved" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
												{w.status}
											</span>
										</div>
										<p className='text-gray-400 text-sm'>
											Matched {w.match_type} numbers
										</p>
										{w.status === "pending" && !w.proof_url && (
											<p className='text-yellow-400 text-xs mt-2'>
												⚠ Upload proof to claim your prize
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
