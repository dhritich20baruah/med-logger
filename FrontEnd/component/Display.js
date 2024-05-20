import { View, Image, Text, StyleSheet } from "react-native";

export default function Display({route}){
    const {uri} = route.params;

    return(
        <View style={styles.container}>
          <Image source={{ uri }} style={styles.image}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      marginBottom: 10,
    },
    image: {
      width: 350,
      height: 350,
      margin: 1,
    },
  });