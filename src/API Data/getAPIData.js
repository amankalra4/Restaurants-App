import Axios from "axios";
import { CITY_CODE_URL, CUISINES_LIST_URL, ENTITY_URL, RESTURANTS_LIST_URL } from "../URLs/URL";

let API_KEY = process.env.REACT_APP_ZOMATO_API_KEY;
let apiHeader = {
    headers: {
        'Accept': `application/json`,
        'user-key': API_KEY
    }
};

export let getCity = (query) => {
    return Axios.get(CITY_CODE_URL.replace('%s', query), apiHeader);
}

export let getEntity = (query) => {
    return Axios.get(ENTITY_URL.replace('%s', query), apiHeader);
}

export let getCuisines = (cityId) => {
    return Axios.get(CUISINES_LIST_URL.replace('%s', cityId), apiHeader);
}

export let getResturants = (entityId, entityType, cuisineIds, start, end) => {
    let cuisines = encodeURIComponent(cuisineIds);
    return Axios.get(
        RESTURANTS_LIST_URL.replace('%s1', entityId).replace('%s2', entityType).replace('%s3', cuisines)
        .replace('%c1', start).replace('%c2', end)
    , apiHeader);
}
