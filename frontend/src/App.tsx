import { WelcomePage } from './pages/welcome-page/welcome-page.component';
import { LibraryPage } from './pages/library-page/library-page.component';

import { useUser } from './utils/hooks';


const App = () => {

	const { user, onUserAction } = useUser();

    return (
		<div>
			{user ? 
				<LibraryPage onUserSignout={onUserAction} user={user} />
				:
				<WelcomePage onUserSignup={onUserAction} />
			}
		</div>
    );
}

export default App;
