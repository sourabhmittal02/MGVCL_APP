import React, { Component } from 'react'
import { Appearance, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import logo from './images/logo.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            cust_name:'',
            address:'',
            mobile:'',
            email:'',
            isLoading: false,
            appearance: Appearance.getColorScheme(),
        }
    }

    _SaveCustomer(){
          if (this.state.username == "" || this.state.password == "") {
            Alert.alert(global.TITLE, "Field(s) Can't Be Left Empty");
        } else {
            let body={
                "useR_NAME": this.state.username,
                "password": this.state.password,
                "name": this.state.cust_name,
                "address": this.state.address,
                "mobilE_NO": this.state.mobile,
                "emaiL_ID": this.state.email
              }
            this.setState({ isLoading: true })
            fetch(global.URL + "Login/RegisterUser/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "platform": Platform.OS
                },
                body: JSON.stringify(body),
                redirect: 'follow'
            }).then(response => response.text()).then(async responseText => {
                try {
                    var respObject = JSON.parse(responseText);
                    console.log(respObject);
                    if (respObject.response > 0) {
                        Alert.alert(global.TITLE, respObject.status)
                        this.props.navigation.navigate('Login', { name: 'Login' })
                        this.setState({ isLoading: false });
                    } else {
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, respObject.status)
                    }
                    this.setState({ isLoading: false });

                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                    Alert.alert(global.TITLE, "Invalid Username or Password");
                }
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, "2. There is some problem. Please try again" + error);
            });
        }
    }
    render() {
        const { appearance } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={appearance === 'dark' ? 'light-content' : 'dark-content'} hidden={false} backgroundColor="transparent" translucent={true} animated={true} />
                <View style={{ flex: 1 }}>
                    <LinearGradient style={{ flex: 1, height: 120, justifyContent: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#486fe4', '#68bddc']} >
                    </LinearGradient>
                    <View style={{ flex: 3, backgroundColor: '#fff', flexGrow: 5 }}>
                        <View style={[styles.Box]}>
                            <Image
                                style={{ width: 100, height: 100, alignSelf: 'center' }}
                                source={logo}
                            />
                            <Text style={{textAlign:'center',color:'#000'}}>Please Enter Details For New Registration</Text>
                            <View style={[styles.inputView, { marginTop: 0 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Username"
                                    placeholderTextColor="#000"
                                    onChangeText={(user) => { this.setState({ username: user }); }}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 0 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Password"
                                    placeholderTextColor="#000"
                                    secureTextEntry={true}
                                    onChangeText={(pass) => { this.setState({ password: pass }); }}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 0 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Name"
                                    placeholderTextColor="#000"
                                    onChangeText={(user) => { this.setState({ cust_name: user }); }}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 0 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Address"
                                    placeholderTextColor="#000"
                                    onChangeText={(user) => { this.setState({ address: user }); }}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 0 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Mobile"
                                    keyboardType='phone-pad'
                                    placeholderTextColor="#000"
                                    onChangeText={(user) => { this.setState({ module: user }); }}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 0 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="EMail"
                                    keyboardType='email-address'
                                    placeholderTextColor="#000"
                                    onChangeText={(user) => { this.setState({ email: user }); }}
                                />
                            </View>
                            <View style={[{ alignItems: 'center',  }]}>
                                <TouchableOpacity style={[styles.Btn]} onPress={() => this._SaveCustomer()}>
                                    <Text style={[{ margin: 10 }, styles.BtnText]}> Sign Up </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
