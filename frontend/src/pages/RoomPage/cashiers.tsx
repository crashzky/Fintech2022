import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router';
import { getCashiersList } from '../../shared/api/contract';
import { getRoom } from '../../shared/api/rooms';

const CashiersPage = (): JSX.Element => {
	const [cashiersList, setCashiersList] = useState<string[]>([]);

	const params = useParams();

	const { data, mutate, isSuccess } = useMutation(getRoom);

	useEffect(() => {
		mutate({
			id: params.id as string,
		});
	}, []);
	
	useEffect(() => {
		if(isSuccess) {
			getCashiersList(data.data.room.contractAddress as string).then((res) => {
				setCashiersList(res);
			});
		}
	}, [isSuccess]);

	return (
		<>
			{cashiersList.length && (
				<ul className='cashiers'>
					{cashiersList.map((i, num) => (
						<li className='cashier__address' key={num}>{i}</li>
					))}
				</ul>
			)}
		</>
	);
};

export default CashiersPage;
