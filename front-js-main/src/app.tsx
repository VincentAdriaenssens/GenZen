import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Navigator from './Navigator';

const root = createRoot(document.querySelector('.appContainer')!);

root.render(
	<BrowserRouter>
		<Navigator />
	</BrowserRouter>
);
