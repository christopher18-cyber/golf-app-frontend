import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { getAllCharitiesApi } from "../services/charityService";
import { getAllCharitiesApi } from "../services/charityService.js";

export default function Charities() {
	const [charities, setCharities] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCharities();
	}, []);

	const fetchCharities = async () => {
		const res = await getAllCharitiesApi();
		if (res?.success) setCharities(res.data);
		setLoading(false);
	};

	const filtered = charities.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			{/* Navbar */}
			<nav className='flex items-center justify-between px-6 py-5 max-w-6xl mx-auto'>
				<Link to='/' className='text-2xl font-bold text-green-500'>
					GolfCharity
				</Link>
				<div className='flex gap-4'>
					<Link
						to='/login'
						className='text-gray-400 hover:text-white transition'>
						Login
					</Link>
					<Link
						to='/register'
						className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition'>
						Get Started
					</Link>
				</div>
			</nav>

			<div className='max-w-6xl mx-auto px-6 py-12'>
				{/* Header */}
				<div className='text-center mb-12'>
					<h1 className='text-5xl font-bold mb-4'>Our Charities</h1>
					<p className='text-gray-400 text-lg max-w-2xl mx-auto'>
						Every subscription supports a cause. Browse our listed charities and
						pick the one closest to your heart.
					</p>
				</div>

				{/* Search */}
				<div className='max-w-md mx-auto mb-12'>
					<input
						type='text'
						placeholder='Search charities...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='w-full bg-gray-800 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500'
					/>
				</div>

				{/* Charity Grid */}
				{loading ? (
					<p className='text-center text-gray-500'>Loading charities...</p>
				) : filtered.length === 0 ? (
					<p className='text-center text-gray-500'>No charities found</p>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filtered.map((charity) => (
							<div
								key={charity.id}
								className='bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition'>
								{charity.image_url && (
									<img
										src={charity.image_url}
										alt={charity.name}
										className='w-full h-40 object-cover rounded-xl mb-4'
									/>
								)}
								{charity.is_featured && (
									<span className='bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-3 inline-block'>
										⭐ Featured
									</span>
								)}
								<h3 className='text-xl font-bold mb-2'>{charity.name}</h3>
								<p className='text-gray-400 text-sm'>{charity.description}</p>
							</div>
						))}
					</div>
				)}

				{/* CTA */}
				<div className='text-center mt-16'>
					<p className='text-gray-400 mb-4'>Ready to support a cause?</p>
					<Link
						to='/register'
						className='bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition'>
						Subscribe & Give Back
					</Link>
				</div>
			</div>
		</div>
	);
}
