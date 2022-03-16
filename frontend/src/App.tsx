import MainPage from './pages';
import { QueryClient, QueryClientProvider } from 'react-query'

const App = (): JSX.Element => {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<MainPage />
		</QueryClientProvider>
	);
};

export default App;
