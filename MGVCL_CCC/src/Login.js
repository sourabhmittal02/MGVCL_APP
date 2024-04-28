import React, { Component } from 'react'
import { Appearance, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import logo from './images/logo.png';
import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
            appearance: Appearance.getColorScheme(),
        }
    }
    componentDidMount = async () => {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
            this.setState({ appearance: colorScheme });
        });
        let uid = await AsyncStorage.getItem('USER_ID');
        if (uid != null)
            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    }
    _SignIn() {
        if (this.state.username == "" || this.state.password == "") {
            Alert.alert(global.TITLE, "Field(s) Can't Be Left Empty");
        } else {
            let body = {
                "loginId": this.state.username,
                "password": this.state.password,
            }
            this.setState({ isLoading: true })
            fetch(global.URL + "Login/DoLogin/", {
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
                    if (respObject.id > 0) {
                        await AsyncStorage.setItem('Name', respObject.name);
                        await AsyncStorage.setItem('ROLE_ID', respObject.rolE_ID.toString());
                        await AsyncStorage.setItem('USER_ID', respObject.useR_ID.toString());
                        await AsyncStorage.setItem('officE_ID', respObject.officE_ID.toString());
                        await AsyncStorage.setItem('UserName', respObject.useR_NAME);
                        await AsyncStorage.setItem('Pass', this.state.password);
                        await AsyncStorage.setItem('Token', respObject.accessToken);
                        this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
                        this.setState({ isLoading: false });
                    } else {
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, "Invalid Username or Password")
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
    _SignUp() {
        this.props.navigation.navigate('SignUp', { name: 'SignUp' })
    }
    render() {
        const { appearance } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={appearance === 'dark' ? 'light-content' : 'dark-content'} hidden={false} backgroundColor="transparent" translucent={true} animated={true} />
                <View style={{ flex: 1 }}>
                    <LinearGradient style={{ flex: 1, height: 120, justifyContent: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#486fe4', '#68bddc']} >
                    </LinearGradient>
                    <View style={{ flex: 3, backgroundColor: '#fff', flexGrow: 4 }}>
                        <View style={[styles.loginBox]}>
                            <Image
                                style={{ width: 100, height: 100, alignSelf: 'center' }}
                                source={logo}
                            />
                            <View style={[styles.inputView, { marginTop: 15 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Username"
                                    placeholderTextColor="#000"
                                    onChangeText={(user) => { this.setState({ username: user }); }}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 15 }]}>
                                <TextInput
                                    style={styles.TextInput2}
                                    placeholder="Password"
                                    placeholderTextColor="#000"
                                    secureTextEntry={true}
                                    onChangeText={(pass) => { this.setState({ password: pass }); }}
                                />
                            </View>
                            <View style={[{ justifyContent: 'center', width: screenWidth - 15 }, styles.loginFormView]}>
                                <TouchableOpacity style={[styles.Btn]} onPress={() => this._SignIn()}>
                                    <Text style={[{ margin: 10 }, styles.BtnText]}> Login </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[{ alignItems: 'flex-end',marginTop:10,marginRight:-20 }]}>
                            <TouchableOpacity onPress={() => this._SignUp()}>
                                    <Text style={[{ margin: 10,color:'#486fe4', fontSize:15,fontWeight:'bold' }]}> Customer's SignUp </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <LinearGradient style={{ flex: 1, height: 120, justifyContent: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#486fe4', '#68bddc']} >
                    </LinearGradient>
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isLoading}>
                    <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#F60000" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Loading....</Text>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
    },
    img: {
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000'
    },
    image: {
        marginBottom: 40,
        backgroundColor: "#009A22",//"#11245a",
        height: 100, resizeMode: 'contain'
    },

    inputView: {
        // backgroundColor: "#fff",
        borderRadius: 5,
        width: "70%",
        height: 45,
        marginBottom: 30,
        alignItems: "center",
    },

    TextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 15,
        width: "100%",
        // color: "#000",
        borderWidth: 1,
        // borderColor: "#eaeaea",
        backgroundColor: "#fafafa",
        borderColor: "#000",
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "50%",
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#6546D7",
        color: "#fff",
    },
    loginText: {
        fontSize: 20,
        color: "#fff"
    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
});