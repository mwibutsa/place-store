import React from "react";
import PlacesNavigator from "./navigation/PlacesNavigator";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import placesReducer from "./store/places-reducer";
import ReduxThunk from "redux-thunk";
import { init } from "./helpers/db";
const rootReducer = combineReducers({
  places: placesReducer
});

init()
  .then(() => console.log("Initialized database"))
  .catch(err => console.log("Db initialization failed!", err));
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <PlacesNavigator />
    </Provider>
  );
}
