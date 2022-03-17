import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { getRoom } from '../../shared/api/rooms';
import { useEffect, useState } from 'react';
import { getRentalRate, getRentEndTime, getRentStartTime, getTenant } from '../../shared/api/contract';
import fromUnixTime from 'date-fns/fromUnixTime';
import { format, intervalToDuration, Duration } from 'date-fns';
import { checkAuntefication } from '../../shared/api/auth';

const RoomPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(false);
	const params = useParams();

	const [isEditMode, setIsEditMode] = useState(false);

	const [rentStartTime, setRentStartTime] = useState<Date>();
	const [rentEndTime, setRentEndTime] = useState<Date>();
	const [tenant, setTenant] = useState<string>();
	const [rentalRate, setRentalRate] = useState<number>();
	const [interval, setInterval] = useState<Duration>();

	const authQuery = useQuery('auth', checkAuntefication);
	const { mutate, data } = useMutation(getRoom);

	useEffect(() => {
		mutate({
			id: params.id as string,
		});
	}, []);

	useEffect(() => {
		if(authQuery.data?.data.authentication.isLandlord) 
			setIsLandlord(true);
	}, [authQuery.data]);

	useEffect(() => {
		if(data && data?.data && data?.data.room.contractAddress) {
			getRentStartTime(data.data.room.contractAddress).then((res) => {
				setRentStartTime(fromUnixTime(res));
			});

			getRentEndTime(data.data.room.contractAddress).then((res) => {
				setRentEndTime(fromUnixTime(res));
			});
		}
		if(data && data?.data && data.data.room.contractAddress && (getStatus() === 'Rented' || getStatus() === 'Rent ended')) {
			getRentalRate(data.data.room.contractAddress).then((res) => {
				setRentalRate(res);
			});

			getTenant(data.data.room.contractAddress).then((res) => {
				setTenant(res);
			});
		}
	}, [data]);

	useEffect(() => {
		if(rentEndTime && rentEndTime)
			setInterval(intervalToDuration({ start: rentStartTime as Date, end: rentEndTime as Date }));
	}, [rentStartTime, rentEndTime]);

	function getStatus() {
		const room = data?.data ? data?.data.room : null;

		if(room) {
			if(!room.contractAddress)
				return 'Unavailable for renting';
			else if(!rentalRate)
				return 'Available for renting';
			else if(rentEndTime && rentEndTime > new Date(Date.now()))
				return 'Rented';
			else
				return 'Rent ended';
		}
	}

	function getName() {
		if(getStatus() === 'Rented' || getStatus() === 'Rent ended')
			return data?.data.room.publicName;
		else
			return data?.data.room.internalName;
	}
 
	return (
		<>
			<p>
				publicName:
				{' '}
				{(data && data.data) && data.data.room.publicName}
			</p>
			<p>
				rentEnd:
				{' '}
				{rentEndTime}
			</p>
			<p>
				rentStart:
				{' '}
				{rentStartTime}
			</p>
			<p>
				tenant:
				{' '}
				{tenant}
			</p>
			<p>
				rentalRate:
				{' '}
				{rentalRate}
			</p>
			{!isEditMode ? (
				<p className='room__name'>
					{(data && data?.data) && getName()}
				</p>
			) : (
				<form className='public-name-edit'>
					<input
						 />
				</form>
			)}
			<p className='room__area'>
				{(data && data?.data) && data.data.room.area}
				{' sq.m.'}
			</p>
			<p className='room__location'>
				{(data && data?.data) && data.data.room.location}
			</p>
			<p className='room__status'>
				{(data && data?.data) && getStatus()}
			</p>
			{(data && data?.data && data.data.room.contractAddress) && (
				<p className='room__contract-address'>
					{data.data.room.contractAddress}
				</p>
			)}
			{(data && data?.data && (getStatus() === 'Rented' || getStatus() === 'Rent ended')) && (
				<>
					<p className='room__internal-name '>
						{data.data.room.internalName}
					</p>
					<p className='room__tenant'>
						{tenant}
					</p>
					<p className='room__rent-start'>
						{format(rentStartTime as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
					<p className='room__rent-end'>
						{format(rentEndTime as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
					<p className='room__billing-period'>
						{(interval && interval.years) && (interval.years + ' years')}
						{(interval && interval.years && interval.months) && ' '}
						{(interval && interval.months) && (interval.months + ' months')}
						{(interval && interval.months && interval.days) && ' '}
						{(interval && interval.days) && (interval.days + ' days')}
						{(interval && interval.days && interval.hours) && ' '}
						{(interval && interval.hours) && (interval.hours + ' hours')}
						{(interval && interval.hours && interval.minutes) && ' '}
						{(interval && interval.minutes) && (interval.minutes + ' minutes')}
						{(interval && interval.minutes && interval.seconds) && ' '}
						{(interval && interval.seconds) && (interval.seconds + ' seconds')}
					</p>
					<p className='room__rental-rate'>
						{rentalRate}
						{' wei'}
					</p>
				</>
			)}
			{isLandlord && (
				<a href={`/room/${params.id}/edit`} className='room__edit'>
					Click me
				</a>
			)}
			{(authQuery.data && authQuery.data.data && authQuery.data.data.authentication.address === tenant) && (
				<button className='room__edit-public-name' onClick={() => setIsEditMode(true)}>
					click me 2
				</button>
			)}
		</>
	);
};

export default RoomPage;
