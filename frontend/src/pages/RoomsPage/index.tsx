import { Link } from 'react-router-dom';

const RoomsPage = (): JSX.Element => {
	if(localStorage.getItem('is_landlord') === 'true') {
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
