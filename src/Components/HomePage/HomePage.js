import React, { useState } from 'react';
import Footer from '../Page Section/Footer/Footer';
import Header from '../Page Section/Header/Header';
import Search from '../Search';
import PageBody from '../Page Section/PageBody/PageBody';
import List from '../../Containers/List';
import { Route, Switch, withRouter } from 'react-router-dom';
import Cuisines from '../../Containers/Cuisines';
import styles from './HomePage.module.css';
import Restaurants from '../../Containers/Restaurants';
import Page404 from '../PageNotFound'
import ErrorBoundary from '../../Containers/ErrorBoundary/ErrorBoundary';

function HomePage(props) {
  let [query, changeQuery] = useState('');
  
  const handleView = (getStringFromSearchComp) => {
    changeQuery(getStringFromSearchComp);
    props.history.push(`/${getStringFromSearchComp}/search`);
  }

  return (
    <React.Fragment>
      <ErrorBoundary>
        <Header />
        <Search handleView = {handleView} />
        <div className = {styles.mainContent}>
          <Switch>
            <Route path = '/' exact component = {PageBody} />
            <Route path = '/restaurantList' exact component = {() => <Restaurants queryProp = {query}/>} />
            <Route path = '/:location/cusinies' component = {() => <Cuisines queryProp = {query} />} />
            <Route path = '/:location/search' exact render = {() => <List queryProp = {query} />} />
            <Route component = {Page404} />
          </Switch>
        </div>
        <Footer />
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default withRouter(HomePage);
