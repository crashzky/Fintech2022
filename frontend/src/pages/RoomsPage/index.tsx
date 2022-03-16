import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { checkAuntefication } from '../../shared/api/auth';
import { useEffect, useState } from 'react';

const RoomsPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(true);

	const { data } = useQuery('auth', checkAuntefication);

	useEffect(() => {
		if(!data?.data.authentication.isLandlord)
			setIsLandlord(false);

	}, [data]);

	if(isLandlord) {
		return (
			<Link to='/rooms/create' className='rooms__create' />
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
