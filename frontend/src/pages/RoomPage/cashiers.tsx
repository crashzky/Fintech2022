import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router';
import { addCashier, getCashiersList, removeCashier } from '../../shared/api/contract';
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

	const formik = useFormik({
		initialValues: {
			address: ''
		},
		onSubmit: (values) => {
			addCashier((data as any).data.room.contractAddress, values.address).then(() => {
				formik.resetForm();
				getCashiersList((data as any).data.room.contractAddress as string).then((res) => {
					setCashiersList(res);
				});
			});
		}
	});

	return (
		<>
			{cashiersList.length !== 0 && (
				<ul className='cashiers'>
					{cashiersList.map((i, num) => (
						<li key={num}>
							<p className='cashier__address'>{i}</p>
							<button className='cashier__remove' onClick={() => {
								removeCashier((data as any).data.room.contractAddress, i).then(() => {
									formik.resetForm();
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
			{isSuccess && (
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
		</>
	);
};

export default CashiersPage;
