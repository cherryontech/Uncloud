import { useCallback, useMemo, useState } from 'react';
import { CaretRight, CaretLeft } from '@phosphor-icons/react';

interface Props {
	previousLabel?: string;
	nextLabel?: string;
	pageCount: number;
	onPageChange: (...args: any) => void;
	pageRangeDisplayed?: number;
	breakLabel?: string;
	pageLinkClassName?: string;
	previousClassName?: string;
	nextClassName?: string;
	disabledClassName?: string;
	breakClassName?: string;
	containerClassName?: string;
	activeClassName?: string;
	gap?: Record<string, string>;
	forcePage?: number;
}

const CustomPagination = ({
	previousLabel = 'Prev',
	nextLabel = 'Next',
	pageCount,
	onPageChange,
	pageRangeDisplayed = 2,
	breakLabel = '...',
	pageLinkClassName,
	previousClassName,
	nextClassName,
	disabledClassName,
	breakClassName,
	containerClassName,
	activeClassName,
	gap = { marginRight: '4px', minWidth: 'fit-content' },
	forcePage,
}: Props) => {
	const [currentPage, setCurrentPage] = useState(forcePage || 0);

	const handlePageClick = useCallback(
		(page: number) => {
			onPageChange({ selected: page });
			setCurrentPage(page);
		},
		[onPageChange]
	);

	const pages = useMemo(() => {
		const pages = [];
		const leftSide = pageRangeDisplayed / 2;
		const rightSide = pageRangeDisplayed - leftSide;

		for (let i = 0; i < pageCount; i++) {
			const label = i + 1;
			let className = pageLinkClassName;
			if (i === currentPage) className += ` ${activeClassName}`;

			if (
				i === 0 ||
				i === pageCount - 1 ||
				(i >= currentPage - leftSide && i <= currentPage + rightSide)
			) {
				pages.push(
					<button
						key={i}
						onClick={() => handlePageClick(i)}
						className={className}
						style={gap}
					>
						{label}
					</button>
				);
			} else if (
				(i < currentPage - leftSide && i === 1) ||
				(i > currentPage + rightSide && i === pageCount - 2)
			) {
				pages.push(
					<span key={i} className={breakClassName} style={gap}>
						{breakLabel}
					</span>
				);
			}
		}

		return pages;
	}, [
		pageRangeDisplayed,
		pageCount,
		pageLinkClassName,
		currentPage,
		activeClassName,
		gap,
		handlePageClick,
		breakClassName,
		breakLabel,
	]);

	return (
		<div className={containerClassName}>
			<button
				onClick={() => handlePageClick(currentPage - 1)}
				className={
					currentPage === 0
						? `${previousClassName} ${disabledClassName}`
						: previousClassName
				}
				disabled={currentPage === 0}
				style={gap}
			>
				<div className='justify-content flex flex-row items-center gap-2'>
					{' '}
					<CaretLeft size={12} />
					{previousLabel}
				</div>
			</button>

			{pages}

			<button
				onClick={() => handlePageClick(currentPage + 1)}
				className={
					currentPage === pageCount - 1
						? `${nextClassName} ${disabledClassName}`
						: nextClassName
				}
				disabled={currentPage === pageCount - 1}
				style={gap}
			>
				<div className='justify-content flex flex-row items-center gap-2'>
					{nextLabel}
					<CaretRight size={12} />
				</div>
			</button>
		</div>
	);
};

export default CustomPagination;
