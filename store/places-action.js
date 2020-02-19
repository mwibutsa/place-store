export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";
import * as FileSystem from "expo-file-system";
import { insertPlace, fetchPlaces } from "../helpers/db";
import ENV from "../env";
export const addPlace = (title, image, location) => async dispatch => {
  try {
    const fileName = image.split("/").pop();
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`
    );

    if (!response.ok) {
      throw new Error("Something went wrong (Address API)");
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error("Something went wrong!");
    }

    const address = resData.results[0].formatted_address;

    const newPath = FileSystem.documentDirectory + fileName;

    await FileSystem.moveAsync({ from: image, to: newPath });
    const dbResult = await insertPlace(
      title,
      image,
      address,
      location.lat,
      location.lng
    );
    dispatch({
      type: ADD_PLACE,
      placeData: {
        id: dbResult.insertId,
        title,
        image: newPath,
        address,
        coords: {
          ...location
        }
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadPlaces = () => async dispatch => {
  try {
    const dbResult = await fetchPlaces();
    dispatch({ type: SET_PLACES, places: dbResult.rows._array });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
