import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button
} from "react-native";

import * as placesActions from "../store/places-action";
import { useDispatch } from "react-redux";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/Colors";
import LocationPicker from "../components/LocationPicker";

const NewPlaceScreen = props => {
  const [title, setTitle] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const titleChangeHandler = text => {
    setTitle(text);
  };

  const dispatch = useDispatch();

  const savePlaceHandler = () => {
    if (!selectedLocation) {
      return;
    }

    dispatch(placesActions.addPlace(title, selectedImage, selectedLocation));
    props.navigation.goBack();
  };

  const imageTakenHandler = imagePath => {
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = useCallback(location => {
    setSelectedLocation(location);
  }, []);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          value={title}
          onChangeText={titleChangeHandler}
        />
        <ImagePicker onImageTaken={imageTakenHandler} />

        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <Button
          title="Save Place"
          color={Colors.primary}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
    backgroundColor: "#eee"
  }
});

NewPlaceScreen.navigationOptions = {
  headerTitle: "Add Place"
};

export default NewPlaceScreen;
