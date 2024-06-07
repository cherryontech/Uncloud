import React, { useState } from 'react';
import { DateRangePicker, DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar } from '@phosphor-icons/react';
import '/app/styles/dateRangePicker.css';
import Image from 'next/image';

export type DateRangeState = {
	startDate: Date;
	endDate: Date;
	key: string;
};

interface CustomDateRangePickerProps {
	state: DateRangeState[];
	setState: React.Dispatch<React.SetStateAction<DateRangeState[]>>;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
	state,
	setState,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<div className='relative flex items-end justify-end '>
			<button
				className='flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-600 shadow-sm '
				onClick={() => setOpen(!open)}
			>
				<Image src='/CalendarBlank.svg' alt='Calendar' width={20} height={20} />
				<span>
					{state[0].startDate.toDateString()} -{' '}
					{state[0].endDate.toDateString()}
				</span>
				<Image src='/CaretDown.svg' alt='Calendar' width={20} height={20} />
			</button>
			{open && (
				<div className='absolute right-0 top-10 z-10 flex flex-col items-end rounded-md border border-gray-300 bg-white shadow-md'>
					<DateRangePicker
						ranges={state}
						onChange={(item) => setState([item.selection as DateRangeState])}
						// rangeColors={['#DEE9F5']}
					/>
					<div
						className='bg-grayBackground text-grayTextColor mb-2 mr-4 w-auto rounded-lg px-4 py-2 !font-[12px] hover:bg-[#DEE9F5] hover:text-blueColor'
						onClick={() => setOpen(false)}
					>
						Select
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomDateRangePicker;
