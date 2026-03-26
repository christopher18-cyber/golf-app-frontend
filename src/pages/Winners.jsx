import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyWinningsApi, uploadProofApi } from "../services/winnerService";
import { Link } from "react-router-dom";

export default function Winners() {
	const { token } = useAuth();
	const [winnings, setWinnings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [proofUrl, setProofUrl] = useState("");
	const [selectedWinner, setSelectedWinner] = useState(null);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		fetchWinnings();
	}, []);

	const fetchWinnings = async () => {
		const res = await getMyWinningsApi(token);
		if (res?.success) setWinnings(res.data);
		setLoading(false);
	};

	const showMessage = (type, text) => {
		setMessage({ type, text });
		setTimeout(() => setMessage(null), 3000);
	};

	const handleUploadProof = async (id) => {
		if (!proofUrl) return;
		const res = await uploadProofApi(id, { proof_url: proofUrl }, token);
		if (res?.success) {
			setProofUrl("");
			setSelectedWinner(null);
			fetchWinnings();
			showMessage("success", "Proof uploaded successfully");
		} else {
			showMessage("error", res?.message);
		}
	};

	const totalWon = winnings.reduce((acc, w) => acc + Number(w.prize_amount), 0);

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

			<div className='max-w-3xl mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold mb-2'>My Winnings</h1>
				<p className='text-gray-400 mb-8'>
					Track your prizes and upload proof to claim
				</p>

				{message && (
					<div
						className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 border border-green-500 text-green-400" : "bg-red-500/10 border border-red-500 text-red-400"}`}>
						{message.text}
					</div>
				)}

				{/* Total */}
				<div className='bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6'>
					<p className='text-gray-400 text-sm mb-1'>Total Winnings</p>
					<p className='text-4xl font-bold text-green-500'>
						£{totalWon.toFixed(2)}
					</p>
					<p className='text-gray-500 text-sm mt-1'>
						{winnings.length} prize(s) won
					</p>
				</div>

				{/* Winnings list */}
				{loading ? (
					<p className='text-gray-500 text-center py-12'>Loading...</p>
				) : winnings.length === 0 ? (
					<div className='bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center'>
						<p className='text-gray-500 text-lg mb-2'>No winnings yet</p>
						<p className='text-gray-600 text-sm'>
							Keep entering scores to participate in draws
						</p>
					</div>
				) : (
					<div className='space-y-4'>
						{winnings.map((w) => (
							<div
								key={w.id}
								className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
								<div className='flex items-center justify-between mb-3'>
									<div>
										<p className='text-2xl font-bold text-green-500'>
											£{Number(w.prize_amount).toFixed(2)}
										</p>
										<p className='text-gray-400 text-sm'>
											Matched {w.match_type} numbers
										</p>
									</div>
									<span
										className={`text-xs px-3 py-1 rounded-full capitalize font-semibold ${
											w.status === "paid"
												? "bg-green-500/20 text-green-400"
												: w.status === "approved"
													? "bg-blue-500/20 text-blue-400"
													: w.status === "rejected"
														? "bg-red-500/20 text-red-400"
														: "bg-yellow-500/20 text-yellow-400"
										}`}>
										{w.status}
									</span>
								</div>

								{/* Status messages */}
								{w.status === "pending" && !w.proof_url && (
									<div className='mt-3'>
										<p className='text-yellow-400 text-sm mb-3'>
											⚠ Upload proof of your score to claim this prize
										</p>
										{selectedWinner === w.id ? (
											<div className='flex gap-3'>
												<input
													type='text'
													placeholder='Paste screenshot URL here'
													value={proofUrl}
													onChange={(e) => setProofUrl(e.target.value)}
													className='flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm'
												/>
												<button
													onClick={() => handleUploadProof(w.id)}
													className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'>
													Submit
												</button>
												<button
													onClick={() => setSelectedWinner(null)}
													className='text-gray-400 hover:text-white text-sm transition'>
													Cancel
												</button>
											</div>
										) : (
											<button
												onClick={() => setSelectedWinner(w.id)}
												className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition'>
												Upload Proof
											</button>
										)}
									</div>
								)}

								{w.status === "pending" && w.proof_url && (
									<p className='text-blue-400 text-sm mt-3'>
										✓ Proof submitted — waiting for admin review
									</p>
								)}

								{w.status === "approved" && (
									<p className='text-green-400 text-sm mt-3'>
										✓ Approved — payment is being processed
									</p>
								)}

								{w.status === "paid" && (
									<p className='text-green-400 text-sm mt-3'>
										✓ Payment completed
									</p>
								)}

								{w.status === "rejected" && (
									<p className='text-red-400 text-sm mt-3'>
										✗ Proof was rejected — contact support
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
