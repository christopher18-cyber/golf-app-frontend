import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
	const { user } = useAuth();

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			{/* Navbar */}
			<nav className='flex items-center justify-between px-6 py-5 max-w-6xl mx-auto'>
				<h1 className='text-2xl font-bold text-green-500'>GolfCharity</h1>
				<div className='flex gap-4'>
					{user ? (
						<Link
							to={user.role === "admin" ? "/admin" : "/dashboard"}
							className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition'>
							Dashboard
						</Link>
					) : (
						<>
							<Link
								to='/login'
								className='text-gray-400 hover:text-white px-5 py-2 rounded-lg transition'>
								Login
							</Link>
							<Link
								to='/register'
								className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition'>
								Get Started
							</Link>
							<Link
								to='/charities'
								className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition'>
								Charities
							</Link>
						</>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className='max-w-6xl mx-auto px-6 py-24 text-center'>
				<p className='text-green-500 font-semibold uppercase tracking-widest text-sm mb-4'>
					Golf. Win. Give Back.
				</p>
				<h1 className='text-5xl md:text-7xl font-bold leading-tight mb-6'>
					Play Golf.
					<br />
					<span className='text-green-500'>Change Lives.</span>
				</h1>
				<p className='text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10'>
					Subscribe, enter your golf scores, win monthly prizes, and donate to a
					charity you care about — all in one place.
				</p>
				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Link
						to='/register'
						className='bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition'>
						Start Playing Today
					</Link>

					<a
						href='#how-it-works'
						className='border border-gray-700 hover:border-green-500 text-gray-300 hover:text-white font-bold px-8 py-4 rounded-xl text-lg transition'>
						How It Works
					</a>
				</div>
			</section>

			{/* Stats Section */}
			<section className='bg-gray-900 py-16'>
				<div className='max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
					{[
						{ value: "£10K+", label: "Prize Pool" },
						{ value: "500+", label: "Active Players" },
						{ value: "£50K+", label: "Donated to Charity" },
						{ value: "20+", label: "Charities Supported" },
					].map((stat, i) => (
						<div key={i}>
							<p className='text-4xl font-bold text-green-500'>{stat.value}</p>
							<p className='text-gray-400 mt-1'>{stat.label}</p>
						</div>
					))}
				</div>
			</section>

			{/* How It Works */}
			<section id='how-it-works' className='max-w-6xl mx-auto px-6 py-24'>
				<h2 className='text-4xl font-bold text-center mb-4'>How It Works</h2>
				<p className='text-gray-400 text-center mb-16'>
					Four simple steps to start winning and giving
				</p>

				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{[
						{
							step: "01",
							title: "Subscribe",
							desc: "Choose a monthly or yearly plan to get access to the platform.",
						},
						{
							step: "02",
							title: "Enter Scores",
							desc: "Submit your last 5 golf scores in Stableford format anytime.",
						},
						{
							step: "03",
							title: "Win Prizes",
							desc: "Match 3, 4, or 5 numbers in our monthly draw to win cash prizes.",
						},
						{
							step: "04",
							title: "Give Back",
							desc: "A portion of your subscription goes to a charity of your choice.",
						},
					].map((item, i) => (
						<div
							key={i}
							className='bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition'>
							<p className='text-green-500 text-4xl font-bold mb-4'>
								{item.step}
							</p>
							<h3 className='text-xl font-bold mb-2'>{item.title}</h3>
							<p className='text-gray-400 text-sm'>{item.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* Prize Pool Section */}
			<section className='bg-gray-900 py-24'>
				<div className='max-w-6xl mx-auto px-6'>
					<h2 className='text-4xl font-bold text-center mb-4'>
						Monthly Prize Pool
					</h2>
					<p className='text-gray-400 text-center mb-16'>
						The more players, the bigger the prizes
					</p>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{[
							{
								match: "5 Numbers",
								share: "40%",
								label: "Jackpot",
								rollover: true,
							},
							{
								match: "4 Numbers",
								share: "35%",
								label: "Second Prize",
								rollover: false,
							},
							{
								match: "3 Numbers",
								share: "25%",
								label: "Third Prize",
								rollover: false,
							},
						].map((tier, i) => (
							<div
								key={i}
								className={`rounded-2xl p-8 text-center border ${i === 0 ? "bg-green-500/10 border-green-500" : "bg-gray-800 border-gray-700"}`}>
								<p className='text-5xl font-bold text-green-500 mb-2'>
									{tier.share}
								</p>
								<p className='text-xl font-bold mb-1'>{tier.label}</p>
								<p className='text-gray-400 text-sm mb-3'>Match {tier.match}</p>
								{tier.rollover && (
									<span className='bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full'>
										Jackpot rolls over if unclaimed
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Charity Section */}
			<section className='max-w-6xl mx-auto px-6 py-24 text-center'>
				<h2 className='text-4xl font-bold mb-4'>Play With Purpose</h2>
				<p className='text-gray-400 text-lg max-w-2xl mx-auto mb-10'>
					At least 10% of every subscription goes directly to a charity of your
					choice. You can increase your contribution anytime.
				</p>
				<Link
					to='/register'
					className='bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition'>
					Join & Start Giving
				</Link>
			</section>

			{/* Footer */}
			<footer className='border-t border-gray-800 py-8'>
				<div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4'>
					<p className='text-green-500 font-bold text-xl'>GolfCharity</p>
					<p className='text-gray-500 text-sm'>
						© 2026 GolfCharity. All rights reserved.
					</p>
					<div className='flex gap-6 text-gray-400 text-sm'>
						<Link to='/login' className='hover:text-white transition'>
							Login
						</Link>
						<Link to='/register' className='hover:text-white transition'>
							Register
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
