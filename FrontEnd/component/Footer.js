import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Dashboard')}>
      <FontAwesome name="house" size={35} color="#800000" style={styles.footerText}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('History')}>
      <FontAwesome name="newspaper" size={35} color="#800000" style={styles.footerText}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Settings')}>
      <FontAwesome name="gear" size={35} color="#800000" style={styles.footerText}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
    paddingVertical: 10,
    position: 'absolute', 
    top: '100%',
    width: '100%'
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#800000',
    fontSize: 25,
  },
});

export default Footer;
