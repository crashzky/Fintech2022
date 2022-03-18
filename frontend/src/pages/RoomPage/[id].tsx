import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { getRoom, removeRoom, setRoomContractAddress, setRoomPublicName } from '../../shared/api/rooms';
import { useEffect, useState } from 'react';
import { deployContract, getBillingPeriodDuration, getRentalRate, getRentEndTime, getRentStartTime, getTenant } from '../../shared/api/contract';
import { format, intervalToDuration, Duration, fromUnixTime } from 'date-fns';
import { checkAuntefication } from '../../shared/api/auth';
import { useFormik } from 'formik';

const RoomPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(false);
	const params = useParams();
	const navigate = useNavigate();

	const [isEditMode, setIsEditMode] = useState(false);

	const [rentStartTimeNum, setRentStartTimeNum] = useState<number>();
	const [rentEndTimeNum, setRentEndTimeNum] = useState<number>();
	const [tenant, setTenant] = useState<string>();
	const [rentalRate, setRentalRate] = useState<number>();
	const [billingPeriodDuration, setBillingPeriodDuration] = useState<number>();
	const [interval, setInterval] = useState<Duration>();
	const [tmpName, setTmpName] = useState('');
	const [tmpStatus, setTmpStatus] = useState('');
	const [tmpAddress, setTmpAddress] = useState('');

	const authQuery = useQuery('auth', checkAuntefication);
	const { mutate, data } = useMutation(getRoom);
	const updatePublicNameMutattion = useMutation(setRoomPublicName);
	const updateRoomContractAddressMutattion = useMutation(setRoomContractAddress);
	const removeRoomMutattion = useMutation(removeRoom);

	useEffect(() => {
		mutate({
			id: params.id as string,
		});
	}, [updateRoomContractAddressMutattion.isSuccess]);

	useEffect(() => {
		if(authQuery.data?.data.authentication.isLandlord) 
			setIsLandlord(true);
	}, [authQuery.data]);

	useEffect(() => {
		if(data && data?.data && data?.data.room.contractAddress) {
			getRentStartTime(data.data.room.contractAddress).then((res) => {
				setRentStartTimeNum(res);
			});

			getRentEndTime(data.data.room.contractAddress).then((res) => {
				setRentEndTimeNum(res);
			});
			
			getRentalRate(data.data.room.contractAddress).then((res) => {
				setRentalRate(res);
			});

			getTenant(data.data.room.contractAddress).then((res) => {
				setTenant(res);
			});

			getBillingPeriodDuration(data.data.room.contractAddress).then((res) => {
				setBillingPeriodDuration(res);
			});
		}
		if(data && data?.data && data.data.room.contractAddress && (getStatus() === 'Rented' || getStatus() === 'Rent ended')) {
			//foo bar
		}
	}, [data]);

	useEffect(() => {
		if(billingPeriodDuration)
			setInterval(intervalToDuration({ start: fromUnixTime(0) as Date, end: fromUnixTime(billingPeriodDuration) as Date }));
	}, [billingPeriodDuration]);

	useEffect(() => {
		if(removeRoomMutattion.isSuccess)
			navigate('/rooms');
	}, [removeRoomMutattion.isSuccess]);

	useEffect(() => {
		if(isEditMode && data && data?.data && data?.data.room.publicName)
			formik.setFieldValue('name', data?.data.room.publicName);
	}, [isEditMode]);

	function getStatus() {
		const room = data?.data ? data?.data.room : null;

		if(room) {
			if(tmpStatus)
				return tmpStatus;
			else if(!room.contractAddress)
				return 'Unavailable for renting';
			else if(!rentalRate || (+rentalRate) === 0)
				return 'Available for renting';
			else if(rentEndTimeNum && fromUnixTime(rentEndTimeNum) > new Date(Date.now()))
				return 'Rented';
			else
				return 'Rent ended';
		}
	}

	function getName() {
		if(!tmpName.length && updatePublicNameMutattion.isSuccess)
			return data?.data.room.internalName;
		if(data?.data.room.publicName)
			return data?.data.room.publicName;
		else
			return data?.data.room.internalName;
	}

	const formik = useFormik({
		initialValues: {
			name: data && data?.data && data?.data.room.publicName ? data?.data.room.publicName : '',
		},
		onSubmit: (values) => {
			setTmpName(values.name);
			setIsEditMode(false);
			
			updatePublicNameMutattion.mutate({
				id: params.id as string,
				publicName: values.name.length ? values.name : null,
			});
		},
	});

	function getPostfix(count: number, word: string) {
		if(count === 1)
			return count + ' ' + word;
		else
			return count + ' ' + word + 's';
	}
 
	return (
		<>
			{!isEditMode ? (
				<p className='room__name'>
					{tmpName ?
						tmpName :
						((data && data?.data) && getName())}
				</p>
			) : (
				<form onSubmit={formik.handleSubmit} className='public-name-edit'>
					<input
						name='name'
						value={formik.values.name}
						onChange={formik.handleChange}
						className='public-name-edit__name' />
					<button type='submit' className='public-name-edit__submit'>
						submit
					</button>
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
			{((data && data?.data && data.data.room.contractAddress) || tmpAddress) && (
				<p className='room__contract-address'>
					{tmpAddress ? tmpAddress : (data as any).data.room.contractAddress}
				</p>
			)}
			{(isEditMode || (data?.data.room.publicName && !updatePublicNameMutattion.isSuccess) || (tmpName && tmpName.length)) && (
				<p className='room__internal-name'>
					{data && data.data.room.internalName}
				</p>
			)}
			
			{(data && data?.data && (getStatus() === 'Rented' || getStatus() === 'Rent ended')) && (
				<>
					<p className='room__tenant'>
						{tenant}
					</p>
					<p className='room__rent-start'>
						{rentStartTimeNum && format(fromUnixTime(rentStartTimeNum) as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
					<p className='room__rent-end'>
						{rentEndTimeNum && format(fromUnixTime(rentEndTimeNum) as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
					{interval && (
						<p className='room__billing-period'>
							{(interval && interval.years) ? getPostfix(interval.years, 'year') : ''}
							{(interval && interval.years && interval.months) ? ' ' : ''}
							{(interval && interval.months) ? getPostfix(interval.months, 'month') : ''}
							{(interval && interval.months && interval.days) ? ' ' : ''}
							{(interval && interval.days) ? getPostfix(interval.days, 'day') : ''}
							{(interval && interval.days && interval.hours) ? ' ' : ''}
							{(interval && interval.hours) ? getPostfix(interval.hours, 'hour') : ''}
							{(interval && interval.hours && interval.minutes) ? ' ' : ''}
							{(interval && interval.minutes) ? getPostfix(interval.minutes, 'minute') : ''}
							{(interval && interval.minutes && interval.seconds) ? ' ' : ''}
							{(interval && interval.seconds) ? getPostfix(interval.seconds, 'second') : ''}
						</p>
					)}
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
			{(authQuery.data && authQuery.data.data.authentication.address === tenant) && (
				<button className='room__edit-public-name' onClick={() => setIsEditMode(true)}>
					click me 2
				</button>
			)}
			{(data && authQuery.data) && (
				<button
					className='room__allow-renting'
					onClick={() => {
						setTmpStatus('Available for renting');

						deployContract(data?.data.room.id, authQuery.data?.data.authentication.address)
							.then((res) => {
								setTmpAddress(res);
								updateRoomContractAddressMutattion.mutate({
									id: params.id as string,
									contractAddress: res,
								});
							})
					}}
				>
					deploy
				</button>
			)}
			{(authQuery.data && authQuery.data.data.authentication.isLandlord && data && !data.data.room.contractAddress) && (
				<button
					className='room__remove'
					onClick={() => {
						removeRoomMutattion.mutate({
							id: params.id as string,
						});
					}}
				>
					remove
				</button>
			)}
			<p>
				address:
				{' '}
				{tmpAddress}
			</p>
		</>
	);
};

export default RoomPage;
