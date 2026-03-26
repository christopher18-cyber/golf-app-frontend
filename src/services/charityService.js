import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllCharitiesApi() {
	try {
		const response = await axios.get(`${BASE_URL}/charities/get-all-charities`);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function getSingleCharityApi(id) {
	try {
		const response = await axios.get(
			`${BASE_URL}/charities/get-single-charities/${id}`,
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function addCharityApi(data, token) {
	try {
		const response = await axios.post(
			`${BASE_URL}/charities/add-charity`,
			data,
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function updateCharityApi(id, data, token) {
	try {
		const response = await axios.put(
			`${BASE_URL}/charities/update-charity/${id}`,
			data,
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}

export async function deleteCharityApi(id, token) {
	try {
		const response = await axios.delete(
			`${BASE_URL}/charities/delete-charity/${id}`,
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response?.data;
	} catch (err) {
		return err.response?.data;
	}
}
