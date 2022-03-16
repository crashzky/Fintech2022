import { useParams, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { getRoom } from '../../shared/api/rooms';
import { useEffect, useState } from 'react';
//import { getRentEndTime, getRentStartTime } from '../../shared/api/contract';

const RoomPage = (): JSX.Element => {
	const params = useParams();

	const [rentStartTime, setRentStartTime] = useState(0);
	const [rentEndTime, setRentEndTime] = useState(0);

	const { mutate, data } = useMutation(getRoom);

	useEffect(() => {
		mutate({
			id: params.id as string,
		});
	}, []);

	/*useEffect(() => {
		if(data?.data.room.contractAddress) {
			getRentStartTime(data.data.room.contractAddress).then((res) => {
				setRentStartTime(res);
			});

			getRentEndTime(data.data.room.contractAddress).then((res) => {
				setRentEndTime(res);
			});
		}
	}, [data]);*/

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
				
			</p>
			<Link to={`/room/${params.id}/edit`} className='room__edit' />
		</>
	);
};

export default RoomPage;
