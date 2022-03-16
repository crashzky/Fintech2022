import { useParams, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { getRoom } from '../../shared/api/rooms';
import { useEffect, useState } from 'react';
import { getRentEndTime, getRentStartTime } from '../../shared/api/contract';
import fromUnixTime from 'date-fns/fromUnixTime';
import { format } from 'date-fns';

const RoomPage = (): JSX.Element => {
	const params = useParams();

	const [rentStartTime, setRentStartTime] = useState<Date>();
	const [rentEndTime, setRentEndTime] = useState<Date>();

	const { mutate, data } = useMutation(getRoom);

	useEffect(() => {
		mutate({
			id: params.id as string,
		});
	}, []);

	useEffect(() => {
		if(data?.data.room.contractAddress) {
			getRentStartTime(data.data.room.contractAddress).then((res) => {
				setRentStartTime(fromUnixTime(res));
			});

			getRentEndTime(data.data.room.contractAddress).then((res) => {
				setRentEndTime(fromUnixTime(res));
			});
		}
	}, [data]);

	function getStatus() {
		const room = data?.data.room;

		if(!room?.contractAddress)
			return 'Unavailable for renting';
		else if(room.contractAddress && !room.publicName)
			return 'Available for renting';
		else if(room.contractAddress && room.publicName && rentEndTime && rentEndTime < new Date(Date.now()))
			return 'Rented';
		else
			return 'Rent ended';
	}
 
	return (
		<>
			<p className='room__name'>
				{data && data.data.room.internalName}
			</p>
			<p className='room__area'>
				{data && data.data.room.area}
				{' sq.m.'}
			</p>
			<p className='room__location'>
				{data && data.data.room.location}
			</p>
			<p className='room__status'>
				{data && getStatus()}
			</p>
			{(data && data.data.room.contractAddress) && (
				<p className='room__contract-address'>
					{data.data.room.contractAddress}
				</p>
			)}
			{(data && (getStatus() === 'Rented' || getStatus() === 'Rent ended')) && (
				<>
					<p className='room__rent-start'>
						{format(rentStartTime as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
					<p className='room__rent-end'>
						{format(rentEndTime as Date, 'iii, d LLL yyyy kk:mm:ss ')}
						{' GMT'}
					</p>
				</>
			)}
			<Link to={`/room/${params.id}/edit`} className='room__edit' />
		</>
	);
};

export default RoomPage;
