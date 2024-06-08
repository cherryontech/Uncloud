import React, { useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DateRangePicker, DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {
	Calendar,
	CaretLeft,
	CaretRight,
	CaretUp,
	CaretDown,
} from '@phosphor-icons/react';
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
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);

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

		// Replace the style of the day labels
		const dayLabels = document.querySelectorAll('.rdrWeekDay');
		const newDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

		dayLabels.forEach((label, index) => {
			label.textContent = newDayLabels[index];
		});

		const handleClickOutside = (event: { target: any }) => {
			if (
				dropdownRef.current &&
				buttonRef.current &&
				!(dropdownRef.current as unknown as HTMLElement).contains(
					event.target
				) &&
				!(buttonRef.current as unknown as HTMLElement).contains(event.target)
			) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		// Clean up event listener on unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	return (
		<div className='relative flex items-end justify-end'>
			<div className='relative w-fit'>
				<button
					ref={buttonRef}
					className='flex min-w-[21rem] items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-[#706F6F] shadow-sm'
					onClick={() => setOpen(!open)}
				>
					<div className='flex flex-row items-center justify-start gap-2'>
						<div className='w-[1.25rem]'>
							<Image
								src='/CalendarBlank.svg'
								alt='Calendar'
								width={20}
								height={20}
							/>
						</div>
						<span className='text-sm'>
							{state[0].startDate.toLocaleDateString(undefined, {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}{' '}
							-{' '}
							{state[0].endDate.toLocaleDateString(undefined, {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</span>
					</div>
					<div className='w-[1.25rem]'>
						{open ? <CaretUp /> : <CaretDown />}
					</div>
				</button>
				{open && (
					<div
						ref={dropdownRef}
						className='absolute right-0 top-12 z-10 flex w-full flex-col items-end rounded-xl border border-gray-300 bg-white p-6 shadow-md'
					>
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
