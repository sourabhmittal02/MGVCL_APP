import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, BackHandler, Alert, ActivityIndicator, Dimensions, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            openModel: false,
            scrName: 'Profile',
            Name: '',
            Email: '',
            Address: '',
            Phone: '',
            UID: '',
        }
    }
    async componentDidMount() {
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({ UID: uid });
        this._GetUserDetails(uid);
    }
    _GetToken = async () => {
        let body = {
            "loginId": "MGVCL",
            "password": "2023",
        }
        fetch(global.URL + "Login/GetToken/", {
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
                await AsyncStorage.setItem('Token', respObject.accessToken);
            }
            catch (error) {
                console.log(error);
                Alert.alert(global.TITLE, "Error In Getting Token");
            }
        });
    }
    async _GetUserDetails(uid) {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "userid": uid,
        }
        fetch(global.URL + "Complaint/GetDetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {

                var respObject = JSON.parse(responseText);
                console.log("Data=====>", respObject);
                if (respObject == null) {
                    Alert.alert(global.TITLE, "No Data Found");
                } else {

                    this.setState({ Name: respObject[0].name });
                    this.setState({ Email: respObject[0].email });
                    this.setState({ Address: respObject[0].address });
                    this.setState({ Phone: respObject[0].mobile_NO.toString() });
                }
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("1. ", error);
                alert(error);
            }
        });
    }
    async _Update() {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "User_ID": this.state.UID,
            "Name": this.state.Name,
            "Address": this.state.Address,
            "Email": this.state.Email,
            "Phone": this.state.Phone,
        }
        fetch(global.URL + "Complaint/UpdateDetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            var respObject = JSON.parse(responseText);
            console.log(respObject);
            if (respObject.response == 1) {
                Alert.alert(global.TITLE, "User Details Updated Successfully");
                this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
            } else {
                Alert.alert(global.TITLE, "Error In Updating User Details");
            }
        });
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'Profile'} />
                <ScrollView>
                    <View style={[{ margin: 5 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Name</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Name}
                            onChangeText={(user) => { this.setState({ Name: user }); }}
                        />
                    </View>
                    <View style={[{ margin: 5 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Address</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Address}
                            onChangeText={(adrs) => { this.setState({ Address: adrs }); }}
                        />
                    </View>
                    <View style={[{ margin: 5 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Email</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Email}
                            onChangeText={(email) => { this.setState({ Email: email }); }}
                        />
                    </View>
                    <View style={[{ margin: 5 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Mobile</Text>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#ccc"
                            value={this.state.Phone}
                            keyboardType='number-pad'
                            onChangeText={(mbl) => { this.setState({ Phone: mbl }); }}
                        />
                    </View>
                    <View style={[{ width: screenWidth - 15, flexDirection: 'row-reverse', height: 120 }]}>
                        <TouchableOpacity style={[styles.Btn, styles.shadowProp]} onPress={() => this._Update()}>
                            <Text style={[{ margin: 10 }, styles.BtnText]}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
