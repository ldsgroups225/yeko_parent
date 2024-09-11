/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import Routes, { ProfileStackParams } from "@utils/Routes";

function Post() {
  const route = useRoute<RouteProp<ProfileStackParams, Routes.Post>>();
  const id = route?.params?.id;

  return (
    <View style={styles.root}>
      <Text>Post - {id}</Text>
      <ScrollView
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
        <Text>Post Content</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Post;
