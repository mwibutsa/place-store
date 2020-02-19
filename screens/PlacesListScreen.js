import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform, FlatList } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import PlaceItem from "../components/PlaceItem";
import * as placesActions from "../store/places-action";

const PlacesListScreen = props => {
  const places = useSelector(state => state.places.places);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(placesActions.loadPlaces());
  }, [dispatch]);

  return (
    <FlatList
      data={places}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={({ item }) => (
        <PlaceItem
          onSelect={() => {
            props.navigation.navigate("PlaceDetail", {
              placeTitle: item.title,
              placeId: item.id
            });
          }}
          image={item.imageUri}
          title={item.title}
          address={item.address}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({});

PlacesListScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Places",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Add Place"
            iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
            onPress={() => {
              navData.navigation.navigate("NewPlace");
            }}
          />
        </HeaderButtons>
      );
    }
  };
};

export default PlacesListScreen;
