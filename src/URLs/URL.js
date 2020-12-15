// below URL returns all the cities matched with the string entered by user.
export const CITY_CODE_URL = `https://developers.zomato.com/api/v2.1/cities?q=%s`;

// below URL returns the enity id, entity type based on the cityId returned by above URL.
export const ENTITY_URL = `https://developers.zomato.com/api/v2.1/locations?query=%s`;

// below URL returns the list of cuisines available in your city.
export const CUISINES_LIST_URL = `https://developers.zomato.com/api/v2.1/cuisines?city_id=%s`;

// below URL searches restaurants based on - cuisinesId, establishmentsIds
export const RESTAURANTS_LIST_URL = 
`https://developers.zomato.com/api/v2.1/search?entity_id=%s1&entity_type=%s2&start=%c1&count=%c2&cuisines=%s3`;
    