import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { getCuisines } from '../API Data/getAPIData';
import CommonDisplay from '../Components/Page Section/Common Display/CommonDisplay';
import Modal from '../Components/UI/Modal';
import Spinner from '../Components/UI/Spinner';
import styles from './Cuisines.module.css';

class Cuisines extends PureComponent {
    state = {
        cuisines: [],
        colorChange: {},
        showModal: false,
        loading: true,
        noCuisineModal: false
    }
    
    componentDidMount() {
        // avoid using setState in componentDidMount()
        if(this.props.queryProp !== '') {
            this.apiCall();
        }
        if (this.state.cuisines.length === 0){
            this.setState({noCuisineModal: true})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // here we are using state[0]; because from List component we are passing an array in below form:
        // [cityId, this.state.entityId, this.state.entityType]
        // and since we require city_id for searching the cusinies, we use state[0] 
        if (prevProps.location.state[0] !== this.props.location.state[0]) {
            this.apiCall();
        }
    }

    apiCall = () => {
        // here we are using state[0]; because from List component we are passing an array in below form:
        // [cityId, this.state.entityId, this.state.entityType]
        // and since we require city_id for searching the cusinies, we use state[0]
        let cityId = this.props.location.state[0]; 
        getCuisines(cityId)
        .then(data => {
            this.setState({cuisines: data.data.cuisines});
            this.setState({loading: false});
        })
        .catch(e => {
            console.error(`An error was encountered while fetching cuisine data: ${e}`);
        })
    }

    handleClick = (cuisine_id) => {
        if(this.state.colorChange.hasOwnProperty(cuisine_id) && this.state.colorChange[cuisine_id]) {
            document.getElementById(`Items${cuisine_id}`).style.backgroundColor = 'transparent';
            document.getElementById(`Items${cuisine_id}`).style.color = 'black';
            delete this.state.colorChange[cuisine_id];
        }
        else {
            document.getElementById(`Items${cuisine_id}`).style.backgroundColor = '#dc143c';
            document.getElementById(`Items${cuisine_id}`).style.color = 'white';
            this.setState({colorChange: {...this.state.colorChange, [cuisine_id]: true}});
        }
    }

    handleProceed = () => {
        if(Object.keys(this.state.colorChange).length === 0 && this.state.colorChange.constructor === Object)
        {
            this.setState({showModal: true});
        }
        else {
            let ids = Object.keys(this.state.colorChange);

            // From List component we are passing an array in below form:
            // [cityId, this.state.entityId, this.state.entityType]
            // and since we require city_id for searching the cusinies, we use state[0]
            let entityId = this.props.location.state[1];
            let entityType = this.props.location.state[2];
            
            let cuisineIds = ids[0];
            for(let i = 1; i < ids.length; i++) {
                cuisineIds = cuisineIds + ',' + ids[i];
            }
            let queryParams = [];
            // whenever you have to pass anything in the queryParams n URL, always pass it in encoded form.
            // and always separate things with the help of "&"
            // this.history.push accepts 2 params:
            // 1st - an object which contains details to be present in the URL
            // 2nd - a state.
            queryParams.push(
                'cuisineIds='  + encodeURIComponent(cuisineIds) +
                '&entityId=' + encodeURIComponent(entityId) + 
                '&entityType=' + encodeURIComponent(entityType)
            )
            this.props.history.push({
                pathname: '/restaurantList',
                search: `?${queryParams}`
            });
        }
    }

    toggleModal = () => {
        this.setState((state, props) => ({
            showModal: !state.showModal
        }));
        // this.setState({showModal: !this.state.showModal});
    }

    toggleCuisineModal = (state, props) => {
        this.setState((state, props) => ({
            noCuisineModal: !state.noCuisineModal
        }));
        // this.setState({noCuisineModal: !this.state.noCuisineModal});
    }

    render () {
        let city = this.props.match.params.location;
        let str = city.split('');
        let charAtZero = str[0].toUpperCase();
        str.splice(0, 1);
        let newString = [charAtZero, ...str].join('');
        return (
            <React.Fragment>
                {this.props.queryProp !== '' && this.state.cuisines.length !== 0 &&
                    <React.Fragment>
                        <p className = {styles.CuisinesText}>
                            Discover the best cuisines in {newString}
                        </p>
                        <p className = {styles.ProceedText}>
                            Click to proceed 
                            <span onClick = {this.handleProceed}>
                                <i className = {styles.ClickMe}></i>
                            </span>
                        </p>
                    </React.Fragment>
                }
                {this.props.queryProp !== '' && this.state.loading 
                    ? 
                        <Spinner/> 
                    :
                       this.state.cuisines.length === 0
                        ?
                            <React.Fragment>
                                <Modal showModal = {this.state.noCuisineModal} toggleModal = {this.toggleCuisineModal}>
                                    <p>OOPS!! No cusinies found.</p>
                                </Modal>
                                <CommonDisplay data = 'any cuisine' />
                            </React.Fragment>
                        :
                            <div className = {styles.Cuisines}>
                                {this.state.cuisines.map(val => (
                                    <div id = {`Items${val.cuisine.cuisine_id}`} 
                                        className = {styles.Items} 
                                        key = {val.cuisine.cuisine_id} 
                                        onClick = {() => this.handleClick(val.cuisine.cuisine_id)}>
                                        {val.cuisine.cuisine_name}
                                    </div>
                                ))}
                            </div>
                }
                {this.state.showModal
                    &&
                    <Modal showModal = {this.state.showModal} toggleModal = {this.toggleModal}>
                        <p>Select atleast one cuisine!</p>
                    </Modal>
                }
            </React.Fragment>
        )
    }
}

export default withRouter(Cuisines);
