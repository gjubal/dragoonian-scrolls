"use server";

import { google } from "googleapis";

import { FormValues } from "./page";

export async function updateSheet(formData: FormValues) {
	try {
		const auth = new google.auth.GoogleAuth({
			credentials: {
				type: process.env.TYPE,
				project_id: process.env.PROJECT_ID,
				private_key_id: process.env.PRIVATE_KEY_ID,
				private_key: (process.env.PRIVATE_KEY as string).replace(/\\n/g, "\n"),
				client_email: process.env.CLIENT_EMAIL,
				client_id: process.env.CLIENT_ID,
				universe_domain: process.env.UNIVERSE_DOMAIN,
			},
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});

		const sheetsClient = google.sheets({ version: "v4", auth });

		const spreadsheetId = process.env.SPREADSHEET_ID;
		const sheetName = "Sheet1";

		const values = [
			[
				formData.name,
				formData.dayEvaluation,
				formData.materialsProduced,
				formData.observations,
			],
		];

		const gaxiosResponse = await sheetsClient.spreadsheets.values.append({
			spreadsheetId,
			range: `${sheetName}!A2:E2`,
			valueInputOption: "USER_ENTERED",
			includeValuesInResponse: true,
			requestBody: {
				values,
			},
		});

		if (gaxiosResponse.status !== 200) {
			return {
				status: "error",
				message: "Error updating sheet",
				statusCode: gaxiosResponse.status,
				data: gaxiosResponse.data,
			} as const;
		}

		return {
			status: "success",
			message: "Successfully updated sheet",
			statusCode: gaxiosResponse.status,
			data: gaxiosResponse.data,
		} as const;
	} catch (error) {
		throw new Error(`Error in updateSheet method: ${error}`);
	}
}
