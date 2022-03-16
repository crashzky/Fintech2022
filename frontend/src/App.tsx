import MainPage from './pages/MainPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
	BrowserRouter as Router,
	Routes,
	Route,
  } from 'react-router-dom';
import RoomsPage from './pages/RoomsPage';
import CreateRoom from './pages/RoomsPage/create';

const App = (): JSX.Element => {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route path='/rooms/create' element={<CreateRoom />} />
					<Route path='/rooms' element={<RoomsPage />} />
					<Route path='/' element={<MainPage />} />
				</Routes>
			</Router>
		</QueryClientProvider>
	);
};

export default App;
