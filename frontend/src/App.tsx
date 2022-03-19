import MainPage from './pages/MainPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
	BrowserRouter as Router,
	Routes,
	Route,
  } from 'react-router-dom';
import RoomsPage from './pages/RoomsPage';
import CreateRoom from './pages/RoomsPage/create';
import RoomPage from './pages/RoomPage/[id]';
import EditPage from './pages/RoomPage/edit';
import CashiersPage from './pages/RoomPage/cashiers';

const App = (): JSX.Element => {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>CashiersPage
					<Route path='/rooms/create' element={<CreateRoom />} />
					<Route path='/rooms' element={<RoomsPage />} />
					<Route path='/room/:id/cashiers' element={<CashiersPage />} />
					<Route path='/room/:id/edit' element={<EditPage />} />
					<Route path='/room/:id' element={<RoomPage />} />
					<Route path='/' element={<MainPage />} />
				</Routes>
			</Router>
		</QueryClientProvider>
	);
};

export default App;
