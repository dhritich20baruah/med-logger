import {AsyncStorage} from '@react-native-async-storage/async-storage'
export const handleSubmit = async (name, age, height, weight) => {
    try {
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('age', age);
        await AsyncStorage.setItem('height', height);
        await AsyncStorage.setItem('weight', weight);

        alert('Data Saved')
    } catch (error) {
        console.error('Error saving data:', error);
    }
}