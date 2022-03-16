import { Link } from 'react-router-dom';

const RoomsPage = (): JSX.Element => {
	return (
		<Link to='/rooms/create' className='rooms__create' />
	);
};

export default RoomsPage;
