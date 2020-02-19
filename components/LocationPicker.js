import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";

import Colors from "../constants/Colors";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapPreview from "../components/MapPreview";
const LocationPicker = props => {
  const [pickedLocation, setPickedLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const mapPickedLocation = props.navigation.getParam("pickedLocation");
  const { onLocationPicked } = props;
  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status != "granted") {
      Alert.alert(
        "Insufficient permissions",
        "You need to grant location permissions to use this app",
        [{ text: "Okay" }]
      );

      return false;
    }
    return true;
  };
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions({
      timeout: 10000
    });

    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);

      const location = await Location.getCurrentPositionAsync();
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    } catch (error) {
      Alert.alert(
        "Could not fetch location",
        "Please try again later or pick a location from the map",
        [{ text: "Okay" }]
      );
    }

    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  let spinner = null;
  if (isFetching) {
    spinner = <ActivityIndicator size="large" color={Colors.primary} />;
  }
  return (
    <View style={styles.locationPicker}>
      <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPress={pickOnMapHandler}
      >
        {spinner ? spinner : <Text>No location chosen yet!</Text>}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Locate me"
          color={Colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="Pick on map"
          color={Colors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ddd",
    borderWidth: 1
  },
  actions: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#eed",
    justifyContent: "space-around",
    width: "100%"
  }
});

export default LocationPicker;
