import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DateRangePicker, DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar, CaretLeft, CaretRight } from '@phosphor-icons/react';
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

	useEffect(() => {
		const nextButton = document.querySelector('.rdrNextButton i');
		const prevButton = document.querySelector('.rdrPprevButton i');

		if (nextButton) {
			nextButton.innerHTML = ReactDOMServer.renderToString(
				<CaretRight color={'#2D81E0'} />
			);
		}

		if (prevButton) {
			prevButton.innerHTML = ReactDOMServer.renderToString(
				<CaretLeft color={'#2D81E0'} />
			);
		}

		const dayLabels = document.querySelectorAll('.rdrWeekDay');
		const newDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

		dayLabels.forEach((label, index) => {
			label.textContent = newDayLabels[index];
		});
	}, [open]);

	return (
		<div className='relative flex items-end justify-end '>
			<div className='relative w-fit'>
				<button
					className='flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-600 shadow-sm '
					onClick={() => setOpen(!open)}
				>
					<div className='w-[1.25rem]'>
						<Image
							src='/CalendarBlank.svg'
							alt='Calendar'
							width={20}
							height={20}
						/>
					</div>
					<span>
						{state[0].startDate.toDateString()} -{' '}
						{state[0].endDate.toDateString()}
					</span>
					<div className='w-[1.25rem]'>
						<Image src='/CaretDown.svg' alt='Calendar' width={20} height={20} />
					</div>
				</button>
				{open && (
					<div className='absolute right-0 top-12 z-10 flex w-full flex-col items-end rounded-xl border  border-gray-300 bg-white p-6 shadow-md'>
						<div className='mb-2 w-full text-[0.75rem] font-semibold text-[#D9D9D9]'>
							Show reports for
						</div>

						<DateRangePicker
							ranges={state}
							onChange={(item) => setState([item.selection as DateRangeState])}
							weekStartsOn={1}
							fixedHeight={true}
							showMonthAndYearPickers={false}
						/>
						<div
							className='w-[6.625rem] rounded-lg bg-[#D9D9D9] px-4 py-2 text-center text-sm !font-semibold text-[#706F6F] hover:bg-[#DEE9F5] hover:text-blueColor'
							onClick={() => setOpen(false)}
						>
							Select
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CustomDateRangePicker;
