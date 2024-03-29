import { URL } from "../config";
// import * as CryptoJS from "crypto-js";

export async function logInApi(data) {
	// const encryptedPassword = CryptoJS.AES.encrypt(
	// 	JSON.stringify(data.password),
	// 	import.meta.env.VITE_ENCRYPTION_KEY
	// ).toString();
	// data.password = encryptedPassword;
	// const encryptPayload = CryptoJS.AES.encrypt(
	// 	JSON.stringify({ data: [data] }),
	// 	import.meta.env.VITE_ENCRYPTION_KEY
	// ).toString();
	try {
		const response = await fetch(URL + "users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ data: [data] }),
		});
		const responseJson = await response.json();
		if (response.ok) {
			return responseJson;
		} else {
			throw new Error(responseJson.message);
		}
	} catch (error) {
		throw new Error(error.message);
	}
}
