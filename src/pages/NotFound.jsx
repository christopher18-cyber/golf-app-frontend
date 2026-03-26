import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className='min-h-screen bg-gray-950 text-white flex items-center justify-center'>
			<div className='text-center'>
				<p className='text-green-500 text-8xl font-bold mb-4'>404</p>
				<h1 className='text-3xl font-bold mb-4'>Page Not Found</h1>
				<p className='text-gray-400 mb-8'>
					The page you're looking for doesn't exist.
				</p>
				<Link
					to='/'
					className='bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition'>
					Back to Home
				</Link>
			</div>
		</div>
	);
}
