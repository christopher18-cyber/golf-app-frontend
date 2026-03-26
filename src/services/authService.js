import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export async function registerUserApi(data) {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            data
        )
        return response?.data
    } catch (err) {
        return err.response?.data
    }
}

export async function loginUserApi(data) {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            data
        )
        return response?.data
    } catch (err) {
        return err.response?.data
    }
}