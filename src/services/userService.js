import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getMyProfileApi(token) {
	try {
		const response = await axios.get(`${BASE_URL}/users/profile`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function updateCharitySelectionApi(data, token) {
	try {
		const response = await axios.put(`${BASE_URL}/users/charity`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function updatePlanApi(data, token) {
	try {
		const response = await axios.put(`${BASE_URL}/users/plan`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}
