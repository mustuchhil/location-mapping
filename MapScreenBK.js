
import {Text,View,StyleSheet,Button, Alert} from 'react-native'
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { useEffect, useState, useRef } from 'react';
import * as Location from "expo-location"
import { TextInput } from 'react-native-gesture-handler';
import MapDetails from './MapDetails';
import { fireDB } from './firebase';

const MapScreen = ({ navigation, route }) => {
    
    const {uid, data} = route.params;

    // console.log(data);

    const [name, setName] = useState(data?.name || '');
    const [region, setRegion] = useState({
        latitude: data?.coords.latitude || 37.43,
        longitude: data?.coords.longitude || -122.43,
        latitudeDelta: 1,
        longitudeDelta: 1,
    });

    const onSave = async () => {
        
        if (name === '') return;

        const coords = { latitude: region.latitude, longitude: region.longitude };
        console.log("New Corrds", coords);
        console.log("1")
        
        if (data?.id) {
            console.log("IF")
            fireDB.collection('mapDetails').get()
            .then((queryShot) => {
                const newData = [];
                queryShot.forEach(el => {
                    if (el.data().id === data.id) {
                        console.log(el.ref.set({
                            ...el.data(),
                            name,
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
                name,
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
            <TextInput
                style={styles.inputStyle}
                placeholder='Enter entry Name'
                autoCapitalize='none'
                returnKeyType='next'
                value={name}
                onChangeText={setName}
            />

            <MapView style={styles.map} initialRegion={region} region={region} >
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
            </MapView>
            <View style={{ margin: 10, width: "80%" }}>
                <Button title="SAVE" onPress={onSave} />
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
    map:{
        margin:10,        
        height: '80%',
        width:350,
    },
});

export default MapScreen