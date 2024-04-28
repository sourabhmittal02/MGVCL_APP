import React, { Component } from 'react'
import {FlatList, ImageBackground, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FlatList } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class AddKNO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            UID: '',
            Kno: '',
            ListKno: [],
            isLoading: false,
        }
    }
    async componentDidMount() {
        this._GetToken();
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({ UID: uid });
        this._ListKno(uid);
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
    _AddKNO = async () => {
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        var raw = JSON.stringify({
            "userid": this.state.UID,
            "kno": this.state.Kno
        });
        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: raw,
            redirect: 'follow'
        };
        fetch(global.URL + "Complaint/Add_kno", requestOptions)
            .then(response => response.text()).then(async responseText => {
                try {
                    var respObject = JSON.parse(responseText);
                    // if (responseText) {
                    Alert.alert(global.TITLE, respObject.status);
                    // } else {
                    //     Alert.alert(global.TITLE, "KNO Already Added");
                    // }
                }
                catch (error) {
                    console.log("Error  ", error);
                }
                this._ListKno(this.state.UID);
            })
            .catch(error => console.log('error', error));
        // fetch("http://117.250.3.20/CoreCallCenterAPIUAT/Complaint/Add_kno", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": token,
        //         "platform": Platform.OS
        //     },
        //     body: raw,
        //     redirect: 'follow'
        // }).then(response => response.text()).then(async responseText => {
        //     try {
        //         var respObject = JSON.parse(responseText);
        //         console.log("Resp  ", respObject);
        //     }
        //     catch(error){
        //         console.log("Error  ", error);
        //     }
        //     // if(respObject){
        //     //     Alert.alert(global.TITLE,"KNO Add Successfully");
        //     // }else{
        //     //     Alert.alert(global.TITLE,"KNO Already Added");
        //     // }
        //     //this._ListKno(this.state.UID);
        // });
    }
    _ListKno = async (uid) => {
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "userid": uid,
            "kno": 0
        }
        fetch(global.URL + "Complaint/ListKNO/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            this.setState({ isLoading: false });
            try {
                let respObject = JSON.parse(responseText);
                this.setState({ ListKno: respObject });
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("1. ", error);
                alert(error);
            }
        });
    }
    FlatListHeader = () => {
        return (
            <View
                style={{
                    marginTop: 10,
                    height: 40,
                    width: "100%",
                    backgroundColor: "#486fe4",
                    flexDirection: 'row'
                }}>
                <Text style={{ fontSize: 16, marginLeft: 10, alignSelf: "center", flex: 0.5, color: "#000" }}>ID</Text>
                <Text style={{ fontSize: 16, marginEnd: 10, alignSelf: "center", flex: 2, textAlign: 'center', color: "#000" }}>Kno</Text>
            </View>
        );
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'ChangePass'} />
                <View style={{flex:0.3,flexDirection:'column'}}>
                    <View style={{flex:0.5}}>
                        <TextInput
                            style={styles.TextInput}
                            editable={true}
                            placeholderTextColor="#000"
                            value={this.state.Name}
                            placeholder='Enter KNO'
                            keyboardType='name-phone-pad'
                            onChangeText={(user) => { this.setState({ Kno: user }); }}
                        />
                    </View>
                    <View style={{flex:1,flexDirection:'row-reverse',margin:10}}>
                        <TouchableOpacity style={[styles.Btn, styles.shadowProp]} onPress={() => this._AddKNO()}>
                                <Text style={[{ margin: 10 }, styles.BtnText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={this.state.ListKno}
                    ListHeaderComponent={this.FlatListHeader}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                    //#99D9EA
                        <View style={{ paddingTop: 10, paddingBottom: 10, width: '100%', backgroundColor: index % 2 == 0 ? "#ffffff" : "#99aef0", flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 12, flex: 0.5, color: "#000000" }}>{index + 1}</Text>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 12, flex: 1, color: "#000000" }}>{item.kno}</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        )
    }
}
