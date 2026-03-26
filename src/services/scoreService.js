import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function addScoreApi(data, token) {
	try {
		const response = await axios.post(`${BASE_URL}/scores`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getMyScoresApi(token) {
	try {
		const response = await axios.get(`${BASE_URL}/scores`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function deleteScoreApi(id, token) {
	try {
		const response = await axios.delete(`${BASE_URL}/scores/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}
