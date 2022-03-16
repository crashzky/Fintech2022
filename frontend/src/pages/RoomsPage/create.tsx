import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { createRoom } from '../../shared/api/rooms';
import { useNavigate } from 'react-router-dom';

const CreateRoom = (): JSX.Element => {
	const navigate = useNavigate();

	const { mutate, isSuccess, data } = useMutation(createRoom);

	useEffect(() => {
		if(isSuccess) 
			navigate('/room/' + data.data.createRoom.id);
	}, [isSuccess]);

	const formik = useFormik({
		initialValues: {
			name: null,
			area: null,
			location: null,
		},
		onSubmit: (values) => {
			mutate({
				internalName: values.name as any,
				area: values.area as any,
				location: values.location as any,
			});
		},
	});
	
	return (
		<form onSubmit={formik.handleSubmit} className='room-form'>
			<input
				type='text'
				name='name'
				className='room-form__internal-name'
				value={formik.values.name as any}
				onChange={formik.handleChange}
				required />
			<input
				type='number'
				name='area'
				className='room-form__area'
				value={formik.values.area as any}
				onChange={formik.handleChange}
				required />
			<input
				type='text'
				name='location'
				className='room-form__location'
				value={formik.values.location as any}
				onChange={formik.handleChange}
				required />
			<button type='submit' className='room-form__submit'>

			</button>
		</form>
	);
};

export default CreateRoom;
