import {Text,View,StyleSheet,Button, Alert} from 'react-native'
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { useEffect, useState, useRef } from 'react';
import * as Location from "expo-location"
import { TextInput } from 'react-native-gesture-handler';
import MapDetails from './MapDetails';
import { fireDB } from './firebase';

const MapScreen = ({ navigation, route }) => {
    
    const {uid, data} = route.params;

    //const [name, setName] = useState(data?.name || '');

    const [lat, setLatitude] = useState(data ? data?.coords.latitude+'' : '')
    const [lng, setLongitude] = useState(data ? data?.coords.longitude+'' : '')


    const [region, setRegion] = useState({
        latitude: data?.coords.latitude || 37.43,
        longitude: data?.coords.longitude || -122.43,
        latitudeDelta: 1,
        longitudeDelta: 1,
    });


    const onSave = async () => {
        
        const coords = { latitude: parseFloat(lat), longitude: parseFloat(lng) };

        console.log(typeof(lat))
        let response = await Location.reverseGeocodeAsync(coords);

        console.log("after reverse geocode value here ==", {
            response
          });

        let cityName = response[0].city || response[0].region || 'unnamed';
        
        if (data?.id) {
            console.log("IF")
            fireDB.collection('mapDetails').get()
            .then((queryShot) => {
                const newData = [];
                queryShot.forEach(el => {
                    if (el.data().id === data.id) {
                        console.log(el.ref.set({
                            ...el.data(),
                            name: cityName,
                            coords: { ...coords},
                            updated: (new Date()).toISOString(),
                        }));
                    }
                });
            });
        } else{
            console.log("Else")
            fireDB.collection('mapDetails').add({
                id: Math.floor(Math.random() * 10000),
                uid,
                name: cityName,
                coords,
                created: (new Date()).toISOString(),
            });
        }

        navigation.navigate("Home", { uid });
    }

    useEffect(() => {
        getLocation();
        // console.log(region);
    }, [uid]);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
    
        if (status !== "granted") {
          Alert.alert(
            "Permission not granted",
            "Allow the app to use location service",
            [{ text: "ok"}],
            { cancelable: false }
          )
        }
    
        let { coords } = await Location.getCurrentPositionAsync(); // is to get current position coords. - lat long position details

        if (coords) {
            const { latitude, longitude } = coords;
            setRegion({
                latitude, longitude, ...region
            });
        }
      }


    return(
        <View style={styles.sectionContainer}>
            { data?.name && <Text style={styles.text}>{data.name}</Text> }

            <TextInput
                style={styles.inputStyle}
                placeholder='Enter Lat'
                autoCapitalize='none'
                returnKeyType='next'
                value={lat}
                keyboardType='numeric'
                onChangeText={setLatitude}
            />

            <TextInput
                style={styles.inputStyle}
                placeholder='Enter Long'
                autoCapitalize='none'
                returnKeyType='next'
                keyboardType='numeric'
                value={lng}
                onChangeText={setLongitude}
            />
            {/* <MapView style={styles.map} initialRegion={region} region={region} >
                <Marker 
                    draggable
                    coordinate={{latitude: region.latitude, longitude: region.longitude}}
                    pinColor="black"
                    onDragEnd={({nativeEvent}) => {
                        
                        console.log({
                            ...region,
                            ...nativeEvent.coordinate,
                        });

                        setRegion({
                            ...region,
                            ...nativeEvent.coordinate,
                        }); 
                    }}
                >
                <Callout>
                    <Text>{'Hey this is toronto'}</Text>
                </Callout>
                </Marker>
                <Circle center={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                }} radius={1000}>
                </Circle>
            </MapView> */}
            <View style={{ margin: 10, width: "80%" }}>
                <Button title="ADD LOCATION" onPress={onSave} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer:{
        alignItems: "center",
        justifyContent: 'center',
    },
    inputStyle: {
        height: 50,
        margin: 8,
        borderColor: 'orange',
        width: "90%",
        borderWidth: 1,
        padding: 5,
    },
    text:{
        marginTop:20,
        fontSize:20,
        fontWeight:"bold",
    },
    map:{
        margin:10,        
        height: '80%',
        width:350,
    },
});

export default MapScreen