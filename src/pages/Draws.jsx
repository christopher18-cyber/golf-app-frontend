import { useState, useEffect } from "react";
import { getPublishedDrawsApi } from "../services/drawService";
import { Link } from "react-router-dom";

export default function Draws() {
	const [draws, setDraws] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDraws();
	}, []);

	const fetchDraws = async () => {
		const res = await getPublishedDrawsApi();
		if (res?.success) setDraws(res.data);
		setLoading(false);
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

			<div className='max-w-3xl mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold mb-2'>Monthly Draws</h1>
				<p className='text-gray-400 mb-8'>All published draw results</p>

				{loading ? (
					<p className='text-gray-500 text-center py-12'>Loading draws...</p>
				) : draws.length === 0 ? (
					<p className='text-gray-500 text-center py-12'>
						No draws published yet
					</p>
				) : (
					<div className='space-y-6'>
						{draws.map((draw) => (
							<div
								key={draw.id}
								className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
								<div className='flex items-center justify-between mb-4'>
									<div>
										<p className='text-xl font-bold'>{draw.draw_date}</p>
										<p className='text-gray-400 text-sm'>
											Jackpot Pool: £{Number(draw.jackpot_pool).toFixed(2)}
										</p>
									</div>
									<span className='bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full capitalize'>
										{draw.status}
									</span>
								</div>

								<p className='text-gray-400 text-sm mb-3'>Drawn Numbers:</p>
								<div className='flex gap-3 flex-wrap'>
									{draw.drawn_numbers?.map((num, i) => (
										<span
											key={i}
											className='bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg'>
											{num}
										</span>
									))}
								</div>

								<div className='mt-4 grid grid-cols-3 gap-3'>
									<div className='bg-gray-800 rounded-xl p-3 text-center'>
										<p className='text-green-500 font-bold text-lg'>40%</p>
										<p className='text-gray-400 text-xs'>5 Match</p>
									</div>
									<div className='bg-gray-800 rounded-xl p-3 text-center'>
										<p className='text-green-500 font-bold text-lg'>35%</p>
										<p className='text-gray-400 text-xs'>4 Match</p>
									</div>
									<div className='bg-gray-800 rounded-xl p-3 text-center'>
										<p className='text-green-500 font-bold text-lg'>25%</p>
										<p className='text-gray-400 text-xs'>3 Match</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
