import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export async function createDrawApi(token) {
	try {
		const response = await axios.post(
			`${BASE_URL}/draws/create-draw`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function runDrawApi(id, token) {
	try {
		const response = await axios.post(
			`${BASE_URL}/draws/run/${id}`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function publishDrawApi(id, token) {
	try {
		const response = await axios.post(
			`${BASE_URL}/draws/publish/${id}`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getAllDrawsApi(token) {
	try {
		const response = await axios.get(`${BASE_URL}/draws/get-all-draws`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getPublishedDrawsApi() {
	try {
		const response = await axios.get(`${BASE_URL}/draws/get-published`);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getSingleDrawApi(id) {
	try {
		const response = await axios.get(`${BASE_URL}/draws/get-single-draw/${id}`);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}
