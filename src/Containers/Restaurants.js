import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { getRestaurants } from '../API Data/getAPIData';
import CommonDisplay from '../Components/Page Section/Common Display/CommonDisplay';
import Modal from '../Components/UI/Modal';
import Spinner from '../Components/UI/Spinner';
import styles from './Restaurants.module.css';

class Restaurants extends PureComponent {
    state = {
        searchParamObj: {},
        numberOfResults: null,
        resultsFound: null,
        restaurantData: {},
        endCount: 10,
        currentPage: 1,
        showModal: false,
        locationModal: false,
        loading: true,
        dropDownDefaultValue: 'select'
    }

    componentDidMount() {
        let decodedParams = decodeURIComponent(this.props.location.search);
        let queryParams  = new URLSearchParams(decodedParams);
        let obj = {};
        for (let [key, value] of queryParams.entries()) {
            obj[key] = value;
        }
        this.setState({searchParamObj: {...this.state.searchParamObj, ...obj}});
        if(this.props.queryProp !== '') {
            this.apiCall(obj);
            let top = document.getElementById('topButton');
            window.onscroll = () => {
                if(document.body.scrollTop > 60 || document.documentElement.scrollTop > 150) {
                    top.style.display = 'block';
                }
                else {
                    top.style.display = 'none';
                }
            }
        }
        else {
            this.setState({locationModal: true});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.dropDownDefaultValue !== this.state.dropDownDefaultValue) {
            this.setState({dropDownDefaultValue: 'select'});
        }
    }

    apiCall = (obj) => {
        getRestaurants(obj['entityId'], obj['entityType'], obj['cuisineIds'], 0, this.state.endCount)
        .then(data => {
            if(data.data.results_found >= 100) {
                this.setState({resultsFound: 100})
                this.setState({numberOfResults: 10});
            }
            else if(data.data.results_found === 0) {
                this.setState({numberOfResults: 0});
                this.setState({showModal: true});
            }
            else {
                this.setState({resultsFound: data.data.results_found})
                this.setState({numberOfResults: Math.ceil(data.data.results_found / 10)});
            }
            this.setState({restaurantData: {...this.state.restaurantData, [this.state.currentPage]: data.data.restaurants}});
            this.setState({loading: false});
        })
        .catch(e => {
            console.error(`An error was encountered while fetching the restaurants: ${e}`);
        });
    }

    handlePageClick = (val) => {
        this.setState({loading: true});
        let totalRestaurantsCount = 10;
        if(!this.state.restaurantData.hasOwnProperty(val) && this.state.currentPage !== val) {
            this.setState({currentPage: val});
            this.setState({endCount: this.state.endCount + 10});
            getRestaurants(this.state.searchParamObj['entityId'], this.state.searchParamObj['entityType'], 
                            this.state.searchParamObj['cuisineIds'], this.state.endCount, 
                            totalRestaurantsCount)
            .then(data => {
                this.setState({restaurantData: {...this.state.restaurantData, [this.state.currentPage]: data.data.restaurants}});
                this.setState({loading: false});
                if(data.data.restaurants.length === 0) {
                    this.setState({showModal: true});
                }
            })
            .catch(e => {
                console.error(`An error was encountered while fetching the restaurants of page number: ${val}: ${e}`);
            });
        }
        else if(this.state.currentPage === val) {
            this.setState({loading: false})
            this.setState({showModal: true})
        }
        else {
            this.setState({loading: false})
            this.setState({currentPage: val});
        }
    }

    handleDropDown = (event) => {
        let copyRestaurantData = JSON.parse(JSON.stringify(this.state.restaurantData));
        if(event.target.value === 'cost') {
            // sort cost in ascending order
            copyRestaurantData[this.state.currentPage].sort((a, b) => {
                let cost1 = a.restaurant.average_cost_for_two;
                let cost2 = b.restaurant.average_cost_for_two;
                if(cost1 < cost2) {
                    return -1;
                }
                if(cost1 > cost2) {
                    return 1;
                }
                return 0
            })
        }
        else if(event.target.value === 'rating') {
            //sort rating in descending order
            copyRestaurantData[this.state.currentPage].sort((a, b) => {
                let rating1 = a.restaurant.user_rating.aggregate_rating;
                let rating2 = b.restaurant.user_rating.aggregate_rating;
                if(rating1 < rating2) {
                    return 1;
                }
                if(rating1 > rating2) {
                    return -1;
                }
                return 0
            })
        }
        this.setState({restaurantData: copyRestaurantData})
        this.setState({dropDownDefaultValue: event.target.value});
    }

    toggleModal = () => {
        this.setState((state, props) => ({
            showModal: !state.showModal
        }));
        // this.setState({showModal: !this.state.showModal});
    }

    toggleLocationModal = () => {
        this.setState((state, props) => ({
            locationModal: !state.locationModal
        }))
        // this.setState({locationModal: !this.state.locationModal});
    }

    handleTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    render () {
        let iterationTimes = [], dropDown = null, pageTitle = null, spinner = null, commonDisplay = null; 

        for(let i = 1; i <= this.state.numberOfResults; i++) {
            iterationTimes.push(i);
        }

        let noRestaurantsModalText  = (
            <Modal showModal = {this.state.showModal} toggleModal = {this.toggleModal}>
                <p>OOPS!! No restaurant found for the cusinie.</p>
            </Modal>
        );
        let samePageModalText = (
            <Modal showModal = {this.state.showModal} toggleModal = {this.toggleModal}>
                <p>You are on same page.</p>
            </Modal>
        );
        let locationModalText = (
            <Modal showModal = {this.state.locationModal} toggleModal = {this.toggleLocationModal}>
                <p>OOPS!! No result.</p>
            </Modal>
        );

        if(!this.state.loading && this.state.numberOfResults !== 0) {
            dropDown = (
                <div className = {styles.DropdownDiv}>
                    Sort By
                    <select style = {{cursor: 'pointer'}}value = {this.state.dropDownDefaultValue} onChange = {this.handleDropDown}>
                        <option value = 'select'>Select</option>
                        <option value = 'cost'>Cost (Low to High)</option>
                        <option value = 'rating'>Rating (High to Low)</option>
                    </select>
                </div>
            )
        }
        if(this.props.queryProp !== '' && !this.state.loading && this.state.restaurantData[this.state.currentPage].length !== 0) {
            pageTitle = (
                <p className = {styles.Heading}>
                    Displaying Page {this.state.currentPage} results out of
                    top {this.state.resultsFound} {this.state.resultsFound === 1 ? 'result' : 'results'}
                </p>
            )
        }
        if(this.props.queryProp !== '' && this.state.loading) {
            spinner = <Spinner/>;
        }
        if(this.props.queryProp === '' && this.state.resultsFound === null) {
            commonDisplay = <CommonDisplay data = 'any restaurant' />;
        }

        return (
            <React.Fragment>
                {commonDisplay}
                {spinner}
                {pageTitle}
                {dropDown}
                {this.props.queryProp !== '' && 
                    <React.Fragment>
                        <div id = 'Restaurants' className = {styles.Restaurants}>
                            {
                                Object.keys(this.state.restaurantData).length !== 0 &&
                                this.state.restaurantData.hasOwnProperty(this.state.currentPage) &&
                                this.state.restaurantData[this.state.currentPage]
                                .map(val => (
                                        <div key = {val.restaurant.R.res_id} 
                                            className = {styles.RestaurantDetails}>
                                            <a href = {val.restaurant.events_url} 
                                            target = '_blank' 
                                            rel = 'noreferrer'
                                            style = {{fontSize: '1.5rem', cursor: 'pointer'}}>
                                                    <strong><u>{val.restaurant.name}</u></strong>
                                            </a>
                                            <p>
                                                <strong>Address:&nbsp;</strong>
                                                {val.restaurant.location.address}
                                            </p>
                                            <i className = 'fa fa-clock-o'></i>
                                            <span>&nbsp;
                                                {val.restaurant.timings === '' 
                                                    ? 
                                                        `We couldn't get the timings of restaurant.` 
                                                    :
                                                        val.restaurant.timings
                                                }
                                            </span>
                                            <p>
                                                <strong>Avg Cost for 2 people:&nbsp;</strong>
                                                {val.restaurant.average_cost_for_two === 0 
                                                    ?
                                                        `We couldn't get the data.`
                                                    :
                                                        `${val.restaurant.currency}${val.restaurant.average_cost_for_two}`
                                                }
                                            </p>
                                            <p>
                                                <strong>Rating:&nbsp;</strong>
                                                {val.restaurant.user_rating.aggregate_rating === 0 
                                                    ?
                                                        `No rating available as of now.`
                                                    :
                                                        <span>
                                                            {val.restaurant.user_rating.aggregate_rating} &#9733;
                                                        </span>
                                                }
                                            </p>
                                            <p><strong>Online Delivery:&nbsp;</strong>
                                                {val.restaurant.has_online_delivery === 1 
                                                    ? 
                                                        `Available`
                                                    : 
                                                        `Unavailable`
                                                }
                                            </p>
                                            <i className = 'fa fa-phone'></i><span>&nbsp;{val.restaurant.phone_numbers}</span>
                                        </div>
                                    ))
                            }
                        </div>
                        <div className = {styles.PaginationDiv}>
                            {iterationTimes.map((val, index) => (
                                <button 
                                    className = {styles.PageNumbers} 
                                    key = {index}
                                    onClick = {() => this.handlePageClick(val)}>
                                {val}
                                </button>
                            ))}
                        </div>
                    </React.Fragment>
                }
                {this.props.queryProp !== '' && 
                    this.state.numberOfResults !== 0 && 
                        !this.state.locationModal &&
                    <button 
                        id = 'topButton' 
                        className = {styles.TopButton} 
                        onClick = {this.handleTop}>
                        Top
                    </button>
                }
                {this.state.showModal 
                    ? 
                        <>
                            {
                            this.state.numberOfResults === 0 
                        ? 
                            noRestaurantsModalText
                        : 
                            (this.state.restaurantData[this.state.currentPage].length === 0
                            ?
                                {noRestaurantsModalText}
                            :
                                samePageModalText
                            )
                        }
                        <CommonDisplay data = 'any restaurant' />
                        </>
                    :
                        this.state.numberOfResults === 0 && <CommonDisplay data = 'any restaurant' />
                }
                {this.state.locationModal && locationModalText}
            </React.Fragment>
        )
    }
}

export default withRouter(Restaurants);
