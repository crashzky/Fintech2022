import { useQuery } from 'react-query';
import { checkAuntefication } from '../../shared/api/auth';
import { useEffect, useState } from 'react';
import { getRooms } from '../../shared/api/rooms';
import { IRoom } from '../../shared/types/rooms';
import { getRentalRate, getRentEndTime } from '../../shared/api/contract';
import fromUnixTime from 'date-fns/fromUnixTime';

const RoomsPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(false);

	const [rentalRate, setRentalRate] = useState<any>();
	const [rentEndTime, setRentEndTime] = useState<any>();

	const authQuery = useQuery('auth', checkAuntefication);
	const roomsQuery = useQuery('rooms', getRooms);

	useEffect(() => {
		if(authQuery.data?.data.authentication.isLandlord) 
			setIsLandlord(true);
	}, [authQuery.data]);

	function getStatus(room: IRoom) {
		if(!room?.contractAddress)
			return 'Unavailable for renting';
		else if(!rentalRate[room.id] || (+rentalRate[room.id]) === 0)
			return 'Available for renting';
		else if(rentEndTime[room.id] && fromUnixTime(rentEndTime[room.id]) > new Date(Date.now()))
			return 'Rented';
		else
			return 'Rent ended';
	}

	return (
		<>
			{(roomsQuery.data && roomsQuery.data.data)
				&& roomsQuery.data.data.rooms.map((i, num) => {
					if(i.contractAddress) {
						getRentEndTime(i.contractAddress).then((res) => {
							setRentEndTime((prev: any) => {
								let _prev = prev;
								_prev[i.id] = res;

								return _prev;
							});
						});
						getRentalRate(i.contractAddress).then((res) => {
							setRentalRate((prev: any) => {
								let _prev = prev;
								_prev[i.id] = res;

								return _prev;
							});
						});
					}
					else {
						setRentEndTime((prev: any) => {
							let _prev = prev;
							_prev[i.id] = null;

							return _prev;
						});

						setRentalRate((prev: any) => {
							let _prev = prev;
							_prev[i.id] = null;

							return _prev;
						});
					}

					return (
						<div key={num} className='room-card' id={'room-' + i.id}>
							<p className='room-card__name'>
								{i.publicName ? i.publicName : i.internalName}
							</p>
							<p className='room-card__status'>
								{getStatus(i)}
							</p>
							<a className='room-card__details' href={'/room/' + i.id}>
								click me
							</a>
						</div>
					);
				})}
			{isLandlord && (
				<a href='/rooms/create' className='rooms__create'>
					click me
				</a>
			)}
		</>
	);
};

export default RoomsPage;
