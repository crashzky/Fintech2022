import { useQuery } from 'react-query';
import { checkAuntefication } from '../../shared/api/auth';
import { useEffect, useState } from 'react';

const RoomsPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(false);

	const { data } = useQuery('auth', checkAuntefication);

	useEffect(() => {
		if(data?.data.authentication.isLandlord) 
			setIsLandlord(true);
	}, [data]);

	if(true) {
		return (
			<a href='/rooms/create' className='rooms__create'></a>
		);
	}
	else {
		return (
			<>
			</>
		);
	}
};

export default RoomsPage;
