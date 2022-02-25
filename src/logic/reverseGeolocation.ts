import * as Location from 'expo-location';

export const asyncGetPermissionAndPosition = async (setErrorMsgFn:any,setLocationFn:any) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    setErrorMsgFn('Permission to access location was denied');
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  setLocationFn(location);
}

// export const getCurrentPosition = () => Location.getCurrentPositionAsync();
export const asyncReverseGeocode = async(location:{latitude: number, longitude: number},setLocationFn:any) => {
  const cityName = await Location.reverseGeocodeAsync(location);
  console.log(cityName);
  if(cityName.length === 1 && cityName[0].region){
    const city = cityName[0].region + " " + cityName[0].name
    setLocationFn(city);
  } else {
    setLocationFn("")
  }
}