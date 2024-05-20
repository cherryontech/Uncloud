import { Value } from '../home/calendar';

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
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function formatDateToDayMonthDateYear(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	};
	const optionsForToday: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
	};
	const formattedDate = isToday(date)
		? new Intl.DateTimeFormat('en-US', optionsForToday).format(date)
		: new Intl.DateTimeFormat('en-US', options).format(date);
	if (isToday(date)) {
		return `Today, ${formattedDate}`;
	}
	return formattedDate;
}

// A function that checks if the date is today
export function isToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}

export function formatDateToYear(date: Date): string {
	const year = date.getFullYear();
	return year.toString();
}

export function formatDateToMonth(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
	};
	return new Intl.DateTimeFormat('en-US', options).format(date);
}

// reusableFunctions.tsx
export function formatDateToMonthDayYear(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	};
	return new Intl.DateTimeFormat('en-US', options).format(date);
}
