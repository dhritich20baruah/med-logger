import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const Gallery = ({userId}) => {
    let user_Id = userId
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [photos, setPhotos] = useState([]);
    
    useEffect(() => {
      (async () => {      
        const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
      })();
  
      loadPhotos();
    }, []);
  
    const loadPhotos = async () => {
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: MediaLibrary.SortBy.creationTime,
      });
      setPhotos(assets.assets);
    };
  
  
    if (hasMediaLibraryPermission === false) {
      return <View><Text>No access to media library</Text></View>;
    }
  
    return (
        <View style={styles.container}>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.uri }}
              style={styles.photo}
            />
          )}
          numColumns={3}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
      aspectRatio: 1,
    },
    photo: {
      width: 100,
      height: 100,
      margin: 1,
    },
  });
  
  export default Gallery;
  