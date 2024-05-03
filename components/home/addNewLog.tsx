'use client';
import React, { useState } from 'react';
import NewLogPopup from './newLogPopup';
import Calendar from 'react-calendar';
import {  formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
type Props = {};
type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];
const AddNewLog = (props: Props) => {
	const [showPopup, setshowPopup] = useState(false);
    const [value, onChange] = useState<Value>(new Date());
	const handlePopupToggle = () => {
		setshowPopup(!showPopup);
	};
	return (
		<div>
			<Calendar onChange={onChange} value={value} />
			<button onClick={handlePopupToggle}>Add New Log</button>
			<NewLogPopup
				showPopup={showPopup}
				handlePopupToggle={handlePopupToggle}
				selectedDate={formatValueTypeToYYYYMMDD(value)}
			/>
		</div>
	);
};

export default AddNewLog;
