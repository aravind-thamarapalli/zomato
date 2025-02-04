import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RestaurantPage from './pages/RestaurantPage';
import LocationSearch from './components/LocationSearch';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/restaurant/:id" component={RestaurantPage} />
        <Route path="/location-search" component={LocationSearch} />
      </Switch>
    </Router>
  );
};

export default App;
