import Geocode from "react-geocode";

// 네이버 지도가 더 나을거 같은데 설명이 어디있는지 모르겠음. 일단 구글로 씀. 지도는 못만들었고 그냥 latitude, longitude 로 도시 받는거만 함.

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_API_KEY);


// set response language. Defaults to english.
// Geocode.setLanguage("en");
Geocode.setLanguage("ko");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
// Geocode.setRegion("es");
Geocode.setRegion("kr");

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

// 함수 두개 받음. 하나는 옵션. 인데 아직 미완성이라 바꿔도 됨. AddPost 에서만 쓰는 중. Edit 에도 구현해야함.
export const getGeolocation = async(fn,getCity?) => {
  // 현재 위치 latitude, longitude 받음.
  navigator.geolocation.getCurrentPosition(async(position) => {
    // latitude = position.coords.latitude;
    // longitude =  position.coords.longitude;
    const latitude = position.coords.latitude;
    const longitude =  position.coords.longitude;
    console.log(latitude)
    console.log(longitude)
    // 함수에 넣어줌.
    fn({latitude,longitude});
    if(getCity) {
      getCity(await getCityName({latitude,longitude}));
    }
  });
  // return {latitude, longitude};
};

export const getCityName = async({latitude,longitude}) => {
  // 여기가 원래 then 으로 구현돼있었는데 그러니까 결과 받는게 안됨. 그래서 await 바꿔줌.
  try{
    const response = await Geocode.fromLatLng(latitude, longitude)
    let address = response.results[0].formatted_address;
    // 대한민국으로 시작함. 쓸데 없어서 뺌.
    if(address.substring(0,4)==="대한민국") {
      address = address.slice(5);
    }
    console.log(address)
    return address;
  } catch (e) {
    console.log(e);
    return "unknown address";
  }
};

// 여기는 google reverse geolocation 치면 나오는거. 이름을 맘대로 쓸 수 있음.

    // let city, state, smallState, position;
    // for (let i = 0; i < response.results[0].address_components.length; i++) {
    //   for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
    //     switch (response.results[0].address_components[i].types[j]) {
    //       case "administrative_area_level_1":
    //         city = response.results[0].address_components[i].long_name;
    //         break;
    //       case 'sublocality_level_1':
    //         state = response.results[0].address_components[i].long_name;
    //         break;
    //       case "sublocality_level_2":
    //         smallState = response.results[0].address_components[i].long_name;
    //         break;
    //       case "premise":
    //         position = response.results[0].address_components[i].long_name;
    //         break;
            
    //     }
    //   }
    // }
    // console.log(city, state, smallState, position);
    // console.log(address.substring(0,4))
//     if(address.substring(0,4)==="대한민국") {
//       address = address.slice(5)
//     }
//     console.log(address)
//     return address;
//   },
//   (error) => {
//     console.error(error);
//   }
// );
// }

// getLocation(getGeolocation())
// Geocode.fromAddress("Eiffel Tower").then(
//   (response) => {
//     const { lat, lng } = response.results[0].geometry.location;
//     console.log(lat, lng);
//   },
//   (error) => {
//     console.error(error);
//   }
// );