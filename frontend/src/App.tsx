import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './components/pages/Home';
import Detail from './components/pages/Detail';
import Setting from './components/pages/Setting';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Home} exact></Route>
        <Route path='/detail' component={Detail}></Route>
        <Route path='/setting' component={Setting}></Route>
      </Switch>
    </Router>
  )
};

export default App;
