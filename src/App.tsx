// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainWorkspace from "@/pages/MainWorkspace";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MainWorkspace />
		</QueryClientProvider>
	);
}

export default App;
