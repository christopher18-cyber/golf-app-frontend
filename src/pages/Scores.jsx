import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
	getMyScoresApi,
	addScoreApi,
	deleteScoreApi,
} from "../services/scoreService";
import { Link } from "react-router-dom";

export default function Scores() {
	const { token } = useAuth();
	const [scores, setScores] = useState([]);
	const [newScore, setNewScore] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		fetchScores();
	}, []);

	const fetchScores = async () => {
		const res = await getMyScoresApi(token);
		if (res?.success) setScores(res.data);
	};

	const handleAdd = async () => {
		if (!newScore) return;
		setLoading(true);
		const res = await addScoreApi({ score: Number(newScore) }, token);
		if (res?.success) {
			setNewScore("");
			fetchScores();
			showMessage("success", "Score added!");
		} else {
			showMessage("error", res?.message);
		}
		setLoading(false);
	};

	const handleDelete = async (id) => {
		const res = await deleteScoreApi(id, token);
		if (res?.success) fetchScores();
	};

	const showMessage = (type, text) => {
		setMessage({ type, text });
		setTimeout(() => setMessage(null), 3000);
	};

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			<nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
				<Link to='/' className='text-xl font-bold text-green-500'>
					GolfCharity
				</Link>
				<Link
					to='/dashboard'
					className='text-gray-400 hover:text-white text-sm transition'>
					← Back to Dashboard
				</Link>
			</nav>

			<div className='max-w-2xl mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold mb-2'>My Scores</h1>
				<p className='text-gray-400 mb-8'>
					You can have a maximum of 5 scores at a time
				</p>

				{message && (
					<div
						className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500 text-green-400" : "bg-red-500/10 border border-red-500 text-red-400"}`}>
						{message.text}
					</div>
				)}

				{/* Add score */}
				<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6'>
					<h2 className='text-lg font-bold mb-4'>Add New Score</h2>
					<div className='flex gap-3'>
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
							onClick={handleAdd}
							disabled={loading}
							className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50'>
							{loading ? "Adding..." : "Add"}
						</button>
					</div>
				</div>

				{/* Score list */}
				<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
					<h2 className='text-lg font-bold mb-4'>
						My Scores ({scores.length}/5)
					</h2>
					{scores.length === 0 ? (
						<p className='text-gray-500 text-center py-8'>No scores yet</p>
					) : (
						<div className='space-y-3'>
							{scores.map((s, i) => (
								<div
									key={s.id}
									className='flex items-center justify-between bg-gray-800 px-5 py-4 rounded-xl'>
									<div className='flex items-center gap-4'>
										<span className='text-gray-500 text-sm'>#{i + 1}</span>
										<span className='text-3xl font-bold text-green-500'>
											{s.score}
										</span>
										<span className='text-gray-400 text-sm'>{s.played_on}</span>
									</div>
									<button
										onClick={() => handleDelete(s.id)}
										className='text-red-400 hover:text-red-300 text-sm transition'>
										Delete
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
