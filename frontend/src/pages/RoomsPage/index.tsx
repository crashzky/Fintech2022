import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { checkAuntefication } from '../../shared/api/auth';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const RoomsPage = (): JSX.Element => {
	const [isLandlord, setIsLandlord] = useState(false);

	const { data } = useQuery('auth', checkAuntefication);

	const web3 = new Web3((window as any).ethereum);

	useEffect(() => {
		web3.eth.requestAccounts().then((res: any) => {
			if(res[0]=== data?.data.authentication.address) 
				setIsLandlord(true);
		});
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
