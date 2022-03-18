import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { getRoom, updateRoom } from '../../shared/api/rooms';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage = (): JSX.Element => {
	const navigate = useNavigate();
	const params = useParams();

	const roomInfoMutation = useMutation(getRoom);
	const updateMutation = useMutation(updateRoom);

	useEffect(() => {
		roomInfoMutation.mutate({
			id: params.id as string,
		});
	}, []);

	useEffect(() => {
		if(roomInfoMutation.isSuccess && roomInfoMutation.data.data) {
			formik.setFieldValue('name', roomInfoMutation.data.data.room.internalName);
			formik.setFieldValue('area', roomInfoMutation.data.data.room.area);
			formik.setFieldValue('location', roomInfoMutation.data.data.room.location);
		}
	}, [roomInfoMutation.isSuccess]);

	useEffect(() => {
		if(updateMutation.isSuccess)
			navigate('/room/' + params.id);
	}, [updateMutation.isSuccess]);

	const formik = useFormik({
		initialValues: {
			name: '',
			area: 0,
			location: '',
		},
		onSubmit: (values) => {
			updateMutation.mutate({
				id: params.id as string,
				internalName: values.name as string,
				area: values.area as number,
				location: values.location as string
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

export default EditPage;
