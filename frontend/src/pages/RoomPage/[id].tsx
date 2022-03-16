import { useParams, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { getRoom } from '../../shared/api/rooms';

const RoomPage = (): JSX.Element => {
	const params = useParams();

	const { mutate, data } = useMutation(getRoom);

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
