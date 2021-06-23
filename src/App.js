import './App.css';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Portfolio from './sections/Portfolio/Portfolio';
import Contact from './sections/Contact/Contact';
import About from './sections/About/About';
import Home from './sections/Home/Home';

function App() {
	return (
		<div className='App'>
			<Router>
				<Route component={Home} exact path='/' />
				<Route component={About} path='/about' />
				<Route component={Portfolio} path='/portfolio' />
				<Route component={Contact} path='/contact' />
			</Router>
		</div>
	);
}

export default App;
