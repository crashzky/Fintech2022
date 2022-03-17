import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { getRoom } from '../../shared/api/rooms';
import { useNavigate } from 'react-router-dom';

const EditPage = (): JSX.Element => {
	const navigate = useNavigate();

	const roomInfoMutation = useMutation(getRoom);

	const formik = useFormik({
		initialValues: {
			name: roomInfoMutation.data && roomInfoMutation.data.data.room.internalName,
			area: roomInfoMutation.data && roomInfoMutation.data.data.room.area,
			location: roomInfoMutation.data && roomInfoMutation.data.data.room.location,
		},
		onSubmit: (values) => {
			
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
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

export default EditPage;
