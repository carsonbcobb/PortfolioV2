import './App.css';
import { BrowserRouter as Router, Route,  Routes,  useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";

import Portfolio from './sections/Portfolio/Portfolio';
import Contact from './sections/Contact/Contact';
import About from './sections/About/About';
import Home from './sections/Home/Home';

 function App ()
{

	return (
		<div className='App'>
		<Router>
        <Content />
    </Router>
		</div>
	);
}


function Content() {
  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <div
      className={`${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransistionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}
    >
      <Routes location={displayLocation}>
			<Route component={Home} exact path='/' />
					<Route component={About} path='/about' />
					<Route component={Portfolio} path='/portfolio' />
					<Route component={ Contact } path='/contact' />
      </Routes>
    </div>
  );
}

export default App;
