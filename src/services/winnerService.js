import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getMyWinningsApi(token) {
	try {
		const response = await axios.get(`${BASE_URL}/winners/my-winnings`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function uploadProofApi(id, data, token) {
	try {
		const response = await axios.put(
			`${BASE_URL}/winners/upload-proof/${id}`,
			data,
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getAllWinnersApi(token) {
	try {
		const response = await axios.get(`${BASE_URL}/winners`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function verifyWinnerApi(id, data, token) {
	try {
		const response = await axios.put(`${BASE_URL}/winners/verify/${id}`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function markAsPaidApi(id, token) {
	try {
		const response = await axios.put(
			`${BASE_URL}/winners/mark-paid/${id}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}
