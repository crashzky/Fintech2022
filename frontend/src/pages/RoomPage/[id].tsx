import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { getRoom, removeRoom, setRoomContractAddress, setRoomPublicName } from '../../shared/api/rooms';
import { useEffect, useState } from 'react';
import { deployContract, getRentalRate, getRentEndTime, getRentStartTime, getTenant } from '../../shared/api/contract';
import fromUnixTime from 'date-fns/fromUnixTime';
import { format, intervalToDuration, Duration } from 'date-fns';
import { checkAuntefication } from '../../shared/api/auth';
import { useFormik } from 'formik';

const RoomPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(false);
	const params = useParams();
	const navigate = useNavigate();

	const [isEditMode, setIsEditMode] = useState(false);

	const [rentStartTime, setRentStartTime] = useState<Date>();
	const [rentEndTime, setRentEndTime] = useState<Date>();
	const [tenant, setTenant] = useState<string>();
	const [rentalRate, setRentalRate] = useState<number>();
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
				setRentStartTime(fromUnixTime(res));
			});

			getRentEndTime(data.data.room.contractAddress).then((res) => {
				setRentEndTime(fromUnixTime(res));
			});
			
			getRentalRate(data.data.room.contractAddress).then((res) => {
				setRentalRate(res);
			});

			getTenant(data.data.room.contractAddress).then((res) => {
				setTenant(res);
			});
		}
		if(data && data?.data && data.data.room.contractAddress && (getStatus() === 'Rented' || getStatus() === 'Rent ended')) {
			//foo bar
		}
	}, [data]);

	useEffect(() => {
		if(rentEndTime && rentEndTime)
			setInterval(intervalToDuration({ start: rentStartTime as Date, end: rentEndTime as Date }));
	}, [rentStartTime, rentEndTime]);

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
			else if(!rentalRate && !room.publicName)
				return 'Available for renting';
			else if(rentEndTime && rentEndTime > new Date(Date.now()))
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
						{rentStartTime && format(rentStartTime as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
					<p className='room__rent-end'>
						{rentEndTime && format(rentEndTime as Date, 'iii, d LLL yyyy kk:mm:ss ')}
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
			<p>
				tenant:
				{' '}
				{tenant}
			</p>
			<p>
				rentStartTime:
				{' '}
				{rentStartTime}
			</p>
			<p>
				rentEndTime:
				{' '}
				{rentEndTime}
			</p>
		</>
	);
};

export default RoomPage;
