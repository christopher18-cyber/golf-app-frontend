import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import {
	getAllCharitiesApi,
	addCharityApi,
	deleteCharityApi,
} from "../services/charityService.js";
import {
	getAllDrawsApi,
	createDrawApi,
	runDrawApi,
	publishDrawApi,
} from "../services/drawService.js";
import {
	getAllWinnersApi,
	verifyWinnerApi,
	markAsPaidApi,
} from "../services/winnerService.js";
export default function AdminDashboard() {
	const { user, token, logout } = useAuth();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("overview");
	const [charities, setCharities] = useState([]);
	const [draws, setDraws] = useState([]);
	const [winners, setWinners] = useState([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	// Charity form
	const [charityForm, setCharityForm] = useState({
		name: "",
		description: "",
		image_url: "",
		is_featured: false,
	});

	useEffect(() => {
		fetchAll();
	}, []);

	const fetchAll = async () => {
		const [charitiesRes, drawsRes, winnersRes] = await Promise.all([
			getAllCharitiesApi(),
			getAllDrawsApi(token),
			getAllWinnersApi(token),
		]);
		if (charitiesRes?.success) setCharities(charitiesRes.data);
		if (drawsRes?.success) setDraws(drawsRes.data);
		if (winnersRes?.success) setWinners(winnersRes.data);
	};

	const showMessage = (type, text) => {
		setMessage({ type, text });
		setTimeout(() => setMessage(null), 3000);
	};

	const handleAddCharity = async () => {
		if (!charityForm.name) return;
		setLoading(true);
		const res = await addCharityApi(charityForm, token);
		if (res?.success) {
			setCharityForm({
				name: "",
				description: "",
				image_url: "",
				is_featured: false,
			});
			fetchAll();
			showMessage("success", "Charity added successfully");
		} else {
			showMessage("error", res?.message);
		}
		setLoading(false);
	};

	const handleDeleteCharity = async (id) => {
		const res = await deleteCharityApi(id, token);
		if (res?.success) {
			fetchAll();
			showMessage("success", "Charity deleted");
		}
	};

	const handleCreateDraw = async () => {
		setLoading(true);
		const res = await createDrawApi(token);
		if (res?.success) {
			fetchAll();
			showMessage("success", "Draw created successfully");
		} else {
			showMessage("error", res?.message);
		}
		setLoading(false);
	};

	const handleRunDraw = async (id) => {
		setLoading(true);
		const res = await runDrawApi(id, token);
		if (res?.success) {
			fetchAll();
			showMessage("success", "Draw simulated successfully");
		} else {
			showMessage("error", res?.message);
		}
		setLoading(false);
	};

	const handlePublishDraw = async (id) => {
		setLoading(true);
		const res = await publishDrawApi(id, token);
		if (res?.success) {
			fetchAll();
			showMessage("success", "Draw published successfully");
		} else {
			showMessage("error", res?.message);
		}
		setLoading(false);
	};

	const handleVerifyWinner = async (id, status) => {
		const res = await verifyWinnerApi(id, { status }, token);
		if (res?.success) {
			fetchAll();
			showMessage("success", `Winner ${status}`);
		}
	};

	const handleMarkAsPaid = async (id) => {
		const res = await markAsPaidApi(id, token);
		if (res?.success) {
			fetchAll();
			showMessage("success", "Winner marked as paid");
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const tabs = ["overview", "charities", "draws", "winners"];

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			{/* Navbar */}
			<nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<h1 className='text-xl font-bold text-green-500'>GolfCharity</h1>
					<span className='bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full'>
						Admin
					</span>
				</div>
				<div className='flex items-center gap-4'>
					<p className='text-gray-400 text-sm hidden md:block'>{user?.email}</p>
					<button
						onClick={handleLogout}
						className='text-sm text-gray-400 hover:text-white transition'>
						Logout
					</button>
				</div>
			</nav>

			<div className='max-w-6xl mx-auto px-4 py-8'>
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
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<p className='text-gray-400 text-sm mb-1'>Total Charities</p>
							<p className='text-4xl font-bold text-green-500'>
								{charities.length}
							</p>
						</div>
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<p className='text-gray-400 text-sm mb-1'>Total Draws</p>
							<p className='text-4xl font-bold text-green-500'>
								{draws.length}
							</p>
						</div>
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<p className='text-gray-400 text-sm mb-1'>Total Winners</p>
							<p className='text-4xl font-bold text-green-500'>
								{winners.length}
							</p>
						</div>
					</div>
				)}

				{/* CHARITIES TAB */}
				{activeTab === "charities" && (
					<div className='space-y-6'>
						{/* Add Charity Form */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h2 className='text-xl font-bold mb-6'>Add New Charity</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<input
									type='text'
									placeholder='Charity name'
									value={charityForm.name}
									onChange={(e) =>
										setCharityForm({ ...charityForm, name: e.target.value })
									}
									className='bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500'
								/>
								<input
									type='text'
									placeholder='Image URL'
									value={charityForm.image_url}
									onChange={(e) =>
										setCharityForm({
											...charityForm,
											image_url: e.target.value,
										})
									}
									className='bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500'
								/>
								<textarea
									placeholder='Description'
									value={charityForm.description}
									onChange={(e) =>
										setCharityForm({
											...charityForm,
											description: e.target.value,
										})
									}
									className='bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 md:col-span-2'
									rows={3}
								/>
								<div className='flex items-center gap-3 md:col-span-2'>
									<input
										type='checkbox'
										id='featured'
										checked={charityForm.is_featured}
										onChange={(e) =>
											setCharityForm({
												...charityForm,
												is_featured: e.target.checked,
											})
										}
										className='w-4 h-4 accent-green-500'
									/>
									<label htmlFor='featured' className='text-gray-400 text-sm'>
										Feature this charity on homepage
									</label>
								</div>
							</div>
							<button
								onClick={handleAddCharity}
								disabled={loading}
								className='mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50'>
								{loading ? "Adding..." : "Add Charity"}
							</button>
						</div>

						{/* Charities List */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h2 className='text-xl font-bold mb-6'>All Charities</h2>
							{charities.length === 0 ? (
								<p className='text-gray-500 text-center py-8'>
									No charities yet
								</p>
							) : (
								<div className='space-y-3'>
									{charities.map((charity) => (
										<div
											key={charity.id}
											className='flex items-center justify-between bg-gray-800 px-5 py-4 rounded-xl'>
											<div>
												<p className='font-bold'>{charity.name}</p>
												<p className='text-gray-400 text-sm'>
													{charity.description}
												</p>
												{charity.is_featured && (
													<span className='text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full'>
														Featured
													</span>
												)}
											</div>
											<button
												onClick={() => handleDeleteCharity(charity.id)}
												className='text-red-400 hover:text-red-300 text-sm transition'>
												Delete
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* DRAWS TAB */}
				{activeTab === "draws" && (
					<div className='space-y-6'>
						{/* Create Draw */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h2 className='text-xl font-bold mb-2'>Create New Draw</h2>
							<p className='text-gray-400 text-sm mb-4'>
								This will generate 5 random numbers and calculate the prize pool
								from active subscribers automatically.
							</p>
							<button
								onClick={handleCreateDraw}
								disabled={loading}
								className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50'>
								{loading ? "Creating..." : "Create Draw"}
							</button>
						</div>

						{/* Draws List */}
						<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
							<h2 className='text-xl font-bold mb-6'>All Draws</h2>
							{draws.length === 0 ? (
								<p className='text-gray-500 text-center py-8'>No draws yet</p>
							) : (
								<div className='space-y-4'>
									{draws.map((draw) => (
										<div key={draw.id} className='bg-gray-800 rounded-xl p-5'>
											<div className='flex items-center justify-between mb-3'>
												<div>
													<p className='font-bold'>{draw.draw_date}</p>
													<p className='text-gray-400 text-sm'>
														Jackpot: £{Number(draw.jackpot_pool).toFixed(2)}
													</p>
												</div>
												<span
													className={`text-xs px-3 py-1 rounded-full capitalize ${draw.status === "published" ? "bg-green-500/20 text-green-400" : draw.status === "simulated" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
													{draw.status}
												</span>
											</div>

											{/* Drawn numbers */}
											<div className='flex gap-2 flex-wrap mb-4'>
												{draw.drawn_numbers?.map((num, i) => (
													<span
														key={i}
														className='bg-green-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm'>
														{num}
													</span>
												))}
											</div>

											{/* Action buttons */}
											<div className='flex gap-3'>
												{draw.status === "pending" && (
													<button
														onClick={() => handleRunDraw(draw.id)}
														disabled={loading}
														className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50'>
														Run Draw
													</button>
												)}
												{draw.status === "simulated" && (
													<button
														onClick={() => handlePublishDraw(draw.id)}
														disabled={loading}
														className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50'>
														Publish
													</button>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* WINNERS TAB */}
				{activeTab === "winners" && (
					<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
						<h2 className='text-xl font-bold mb-6'>All Winners</h2>
						{winners.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>No winners yet</p>
						) : (
							<div className='space-y-4'>
								{winners.map((w) => (
									<div key={w.id} className='bg-gray-800 rounded-xl p-5'>
										<div className='flex items-center justify-between mb-2'>
											<div>
												<p className='font-bold text-green-500'>
													£{Number(w.prize_amount).toFixed(2)}
												</p>
												<p className='text-gray-400 text-sm'>
													Matched {w.match_type} numbers
												</p>
												<p className='text-gray-500 text-xs mt-1'>
													User: {w.user_id}
												</p>
												{w.proof_url && (
													<a
														href={w.proof_url}
														target='_blank'
														rel='noreferrer'
														className='text-blue-400 text-xs hover:underline'>
														View proof →
													</a>
												)}
											</div>
											<span
												className={`text-xs px-3 py-1 rounded-full capitalize ${w.status === "paid" ? "bg-green-500/20 text-green-400" : w.status === "approved" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
												{w.status}
											</span>
										</div>

										{/* Action buttons */}
										<div className='flex gap-3 mt-3'>
											{w.status === "pending" && w.proof_url && (
												<>
													<button
														onClick={() => handleVerifyWinner(w.id, "approved")}
														className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'>
														Approve
													</button>
													<button
														onClick={() => handleVerifyWinner(w.id, "rejected")}
														className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'>
														Reject
													</button>
												</>
											)}
											{w.status === "approved" && (
												<button
													onClick={() => handleMarkAsPaid(w.id)}
													className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'>
													Mark as Paid
												</button>
											)}
											{w.status === "pending" && !w.proof_url && (
												<p className='text-yellow-400 text-xs'>
													⚠ Waiting for winner to upload proof
												</p>
											)}
										</div>
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
