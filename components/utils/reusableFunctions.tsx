import { Value } from '../home/addNewLog';

export function formatValueTypeToYYYYMMDD(value: Value): string {
	if (value === null) {
		return ''; // Return an empty string if the value is null
	}

	if (Array.isArray(value)) {
		// If the value is an array, handle each piece separately
		const [startDate, endDate] = value;
		const formattedStartDate = startDate ? formatDateToYYYYMMDD(startDate) : '';
		const formattedEndDate = endDate ? formatDateToYYYYMMDD(endDate) : '';
		return `${formattedStartDate} - ${formattedEndDate}`;
	} else {
		// If the value is a single date, format it as a single date
		return formatDateToYYYYMMDD(value);
	}
}
export function formatDateToYYYYMMDD(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
