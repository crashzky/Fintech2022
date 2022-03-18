import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router';
import { checkAuntefication } from '../../shared/api/auth';
import { addCashier, getCashiersList, removeCashier } from '../../shared/api/contract';
import { getRoom } from '../../shared/api/rooms';

const CashiersPage = (): JSX.Element => {
	const [cashiersList, setCashiersList] = useState<string[]>([]);

	const params = useParams();

	const authQuery = useQuery('auth', checkAuntefication);
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

	const formik = useFormik({
		initialValues: {
			address: ''
		},
		onSubmit: (values) => {
			addCashier((data as any).data.room.contractAddress, values.address, (authQuery.data as any).data.authentication.address).then(() => {
				formik.setFieldValue('address', '');
				getCashiersList((data as any).data.room.contractAddress as string).then((res) => {
					setCashiersList(res);
				});
			});
		}
	});

	return (
		<>
			{(authQuery.isSuccess && cashiersList.length !== 0) && (
				<ul className='cashiers'>
					{cashiersList.map((i, num) => (
						<li key={num}>
							<p className='cashier__address'>{i}</p>
							<button className='cashier__remove' onClick={() => {
								removeCashier((data as any).data.room.contractAddress, i, (authQuery.data as any).data.authentication.address).then(() => {
									getCashiersList((data as any).data.room.contractAddress as string).then((res) => {
										setCashiersList(res);
									});
								});
							}}>
								remove
							</button>
						</li>
					))}
				</ul>
			)}
			{(authQuery.isSuccess && isSuccess) && (
				<form onSubmit={formik.handleSubmit} className='add-cashier'>
					<input
						type='text' 
						name='address'
						className='add-cashier__address'
						onChange={formik.handleChange}
						value={formik.values.address}
						required />
					<button type='submit' className='add-cashier__submit'>
						submit
					</button>
				</form>
			)}
		<p>
			me:
			{' '}
			{authQuery.data && authQuery.data.data.authentication.address}
		</p>
		</>
	);
};

export default CashiersPage;
