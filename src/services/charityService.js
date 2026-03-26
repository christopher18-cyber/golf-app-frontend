import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllCharitiesApi() {
	try {
		const response = await axios.get(`${BASE_URL}/charities`);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getSingleCharityApi(id) {
	try {
		const response = await axios.get(`${BASE_URL}/charities/${id}`);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function addCharityApi(data, token) {
	try {
		const response = await axios.post(`${BASE_URL}/charities`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function updateCharityApi(id, data, token) {
	try {
		const response = await axios.put(`${BASE_URL}/charities/${id}`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function deleteCharityApi(id, token) {
	try {
		const response = await axios.delete(`${BASE_URL}/charities/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}
