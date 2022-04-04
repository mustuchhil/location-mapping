import { TextInput, Text, Button, View, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ( {navigation, route} ) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignInClicked = () => {

        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
           const user = userCredentials.user;
           //console.log('Logged in with:', user.uid);
            navigation.navigate("Home", { uid: user.uid });
         })
         .catch(error => alert(error.message));
    }

    const onSignUpClicked = () => {
        console.log(`Checking ${email} ${password} `)
        createUserWithEmailAndPassword(auth, email, password)
        .then((res)=>{
            navigation.navigate("Home", {uid: res.user.uid});
        })
        .catch((res)=>{
        //console.log(res);
        })
    }

    return(
        <View style={styles.sectionContainer}>
            <TextInput
                style={styles.inputStyle}
                placeholder='Enter Email Address'
                textContentType="emailAddress"
                autoCapitalize='none'
                keyboardType='email-address'
                returnKeyType='next'
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.inputStyle}
                placeholder='Enter Password'
                textContentType="password"
                autoCapitalize='none'
                returnKeyType='next'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            <Button style = {styles.buttonStyle} color= "orangered" title='LogIn' onPress={onSignInClicked}/>
            <Text></Text>
            <Button style = {styles.buttonStyle} color= 'orangered' title='SignUp' onPress={onSignUpClicked}/>

        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer:{
        marginTop: 32,
        paddingHorizontal: 24,
    },
    inputStyle: {
        height: 50,
        margin: 8,
        borderColor: 'orangered',
        borderWidth: 1,
        padding: 5,
    },
    buttonStyle: {
        margin: 30,
        padding: 10,
        
    },
});

export default LoginScreen