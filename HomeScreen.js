import { useState, useEffect } from 'react';
import {Text,View,Button,StyleSheet} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { fireDB } from './firebase';

const HomeScreen = ({ navigation, route }) => {
    
    const userId = route.params?.uid;
    console.log(userId);

    const [data, setData] = useState([]);

    const onCreateLocationClicked = () => {
        navigation.navigate("Map", { uid: userId });
    }

    const editData = el => {
        navigation.navigate("Map", { uid: userId, data: el });
    }

    useEffect(() => {
        fireDB.collection('mapDetails').get()
            .then((queryShot) => {
                const newData = [];
                queryShot.forEach(el => {
                    if (el.data().uid === userId) {
                        newData.push(el.data());
                    }
                });
                setData(newData);
            });
    }, [userId])

    const deleteData = (uid) => {
        fireDB.collection('mapDetails').get()
            .then((queryShot) => {
                const newData = [];
                queryShot.forEach(el => {
                    if (el.data().uid === uid) {
                        el.ref.delete();
                    } else if(el.data() === userId){
                        newData.push(el.data());
                    }
                });
                setData(newData);
            });
    }

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.name}> {item.name} </Text>
            <Text> LAT: {item.coords.latitude}, LONG: {item.coords.longitude} </Text>
            <Text> Created At: {item.created || '-'} | Update At: {item.updated || ''} </Text>
            <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginVertical: 5, width: "100%"}}>
                <Button style = {styles.buttonStyle} color= "blue" title='Delete' onPress={() => deleteData(item.uid)}/>
                <Button style = {styles.buttonStyle} color= "green" title='Update' onPress={() => editData(item)}/>
            </View>
        </View>
    );

    return(
        <View style = {styles.sectionContainer}>
            <Button style = {styles.buttonStyle} color= "red" title='Create Location' onPress={onCreateLocationClicked}/>
            <FlatList
                data = {data}
                keyExtractor = { (item) => item.id}
                renderItem = { renderItem }
            />
        </View>
    )

}

const styles = StyleSheet.create({
    sectionContainer:{
        alignContent:'flex-end',
        margin: 30,
    },
    buttonStyle: {        
        justifyContent: 'center',
    },
    row: {
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: "center"
    },
    name: {
        width: '100%',
        textAlign: "center",
        backgroundColor: 'grey',
        fontSize: 20,
        fontWeight: '700',
        padding: 5
    }
});

export default HomeScreen