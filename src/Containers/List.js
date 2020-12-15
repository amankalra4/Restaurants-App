import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { getCity, getEntity } from '../API Data/getAPIData';
import CommonDisplay from '../Components/Page Section/Common Display/CommonDisplay';
import Modal from '../Components/UI/Modal';
import Spinner from '../Components/UI/Spinner';
import styles from './List.module.css';

class List extends PureComponent {
    state = {
        storeCityDetails: [],
        showModal: false,
        cityId: [],
        id: null,
        entityId: null,
        entityType: null,
        loading: true
    }

    componentDidMount() {
        // avoid using setState in componentDidMount()
        this.apiCall();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.queryProp !== this.props.queryProp) {
            this.apiCall();
        }
    }

    apiCall = () => {
        const api1 = getCity(this.props.queryProp);
        const api2 = getEntity(this.props.queryProp);
        Promise.all([api1, api2])
        .then(data => {
            this.commonSetState(data);
        })
        .catch(e => {
            console.error(`An error was encountered while fetching data from one of the APIs: ${e}`);
        })
    }

    commonSetState = (data) => {
        this.setState({storeCityDetails: []});
        if(data[0].data.location_suggestions.length === 0 || data[1].data.location_suggestions.length === 0) {
            this.setState({showModal: true});
        }
        else {
            this.setState({storeCityDetails: [...this.state.storeCityDetails, data[0].data.location_suggestions]});
            let ids = data[0].data.location_suggestions.map(val => val.id);
            this.setState({cityId: ids});
            this.setState({
                entityId: data[1].data.location_suggestions[0].entity_id, 
                entityType: data[1].data.location_suggestions[0].entity_type
            })
        }
        this.setState({loading: false});
    }

    toggleModal = () => {
        this.setState((state, props) => ({
            showModal: !state.showModal
        }))
        // this.setState({showModal: !this.state.showModal});
    }

    handleClick = (cityId) => {
        const queryParams = [];
        queryParams.push(
            'entityId=' + encodeURIComponent(this.state.entityId) +
            '&entityType=' + encodeURIComponent(this.state.entityType)
        )
        // whenever you have to pass anything in the queryParams n URL, always pass it in encoded form.
        // and always separate things with the help of "&"
        // this.history.push accepts 2 params:
        // 1st - an object which contains details to be present in the URL
        // 2nd - a state.
        this.props.history.push({
            pathname: `/${this.props.queryProp}/cusinies`,
            search: `?${queryParams}`
        }, [cityId, this.state.entityId, this.state.entityType]);
    }

    render () {
        return (
            <div className = {styles.apiContent}>
                {this.state.loading 
                    ? 
                        <Spinner/> 
                    :
                        this.state.storeCityDetails.length !== 0 
                            && this.state.storeCityDetails[0].length !== 0
                        ? 
                            <React.Fragment>
                                <p className = {styles.ListText}>Found below related cities from your search: </p>
                                { this.state.storeCityDetails[0].length !== 1
                                    ?
                                        <div style = {{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '0.5em', cursor: 'pointer'}}>
                                        {this.state.storeCityDetails[0].map((value, index) => (
                                            <div onClick = {() => this.handleClick(this.state.cityId[index])} className = {styles.city} key = {index}>
                                                <p><strong><i>City Name: </i></strong>{value.name}</p>
                                                <p><strong><i>Country Name: </i></strong>{value.country_name}</p>
                                            </div>
                                        ))}
                                        </div>
                                    :
                                        <div className = {styles.SingleCity} onClick = {() => this.handleClick(this.state.cityId[0])}>
                                            <p><strong><i>City Name: </i></strong>{this.state.storeCityDetails[0][0].name}</p>
                                            <p><strong><i>Country Name: </i></strong>{this.state.storeCityDetails[0][0].country_name}</p>
                                        </div>
                                }
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <Modal showModal = {this.state.showModal} toggleModal = {this.toggleModal}>
                                    <p>OOPS!! No result.</p>
                                </Modal>
                                <CommonDisplay data = 'any location'/>
                            </React.Fragment>
                }
            </div>
        )
    }
}

export default withRouter(List);
