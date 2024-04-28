import React, { Component } from 'react'
import { SafeAreaView, BackHandler, Alert, ActivityIndicator, Appearance, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-picker';

export default class AddRemark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
            OID: '',
            scrName: 'Complaint Remark',
            StatusList: [],
            StatusId: '',
            StatusName: '',
            ImgSign: '',
            ComplaintNo: '',
            UserId: '',
            Remark: '',
            appearance: Appearance.getColorScheme(),
        }
        this._onSaveEvent = this._onSaveEvent.bind(this);
    }
    async componentDidMount() {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
            this.setState({ appearance: colorScheme });
        });
        this.setState({ ComplaintNo: this.props.route.params.CompNo })
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({ UserId: uid.toString() });
        this._StatusList();
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
    _StatusList = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        fetch(global.URL + "Complaint/GetComplaintCurrentStatusList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            this.setState({ isLoading: false });
            try {
                let respObject = JSON.parse(responseText);
                let List = [];
                respObject.forEach(object => {
                    let dropdownObject = { label: object.currenT_STATUS.toString(), value: object.id.toString() };
                    List.push(dropdownObject)
                });
                this.setState({ StatusList: List });
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("2. ", error);
                alert(error);
            }
        });
    }
    saveSign() {
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        this.setState({ ImgSign: result.encoded })
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result.pathName);
    }
    _onDragEvent() {
        // This callback will be called when the user enters signature
        console.log("dragged");
    }
    _Update= async () => {
        if (this.state.StatusName === 'Resolved By Consumer' && this.state.ImgSign==='') {
            Alert.alert(global.TITLE,'Please Signature First')
        }
        else {
            let token = "Bearer " + await AsyncStorage.getItem('Token');
            console.log(token);
            let body;
            if(this.state.StatusName === 'Resolved By Consumer'){
                body = {
                    "complaintNo": this.state.ComplaintNo.toString(),
                    "userID": this.state.UserId.toString(),
                    "remark": this.state.Remark,
                    "status": this.state.StatusId,
                    "Image":this.state.ImgSign
                }
            }else{
                body = {
                    "complaintNo": this.state.ComplaintNo.toString(),
                    "userID": this.state.UserId.toString(),
                    "remark": this.state.Remark,
                    "status": this.state.StatusId,
                    "Image":""
                }
            }
            console.log(body);
            fetch(global.URL + "Complaint/SaveRemark", {
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
                    console.log(respObject);
                    if (respObject.response == 1) {
                        Alert.alert(global.TITLE, respObject.status);
                        this.props.navigation.navigate('FRTComplaint', { name: 'FRTComplaint' })
                    }
                } catch (error) {
                    this.setState({ isLoading: false });
                    console.log("1. ", error);
                    alert(error);
                }
            });
        }
    };
    render() {
        const { appearance } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'Remark'} />
                <View style={{ flex: 1, margin: 10 }}>
                    {/* <Text style={[styles.TextInput,{padding:10,fontWeight:'bold'}]}>Complaint No. {this.state.ComplaintNo}</Text> */}
                    <View>
                        {/* <Text style={[styles.LabelBox, { padding: 10, fontWeight: 'bold', color: appearance === 'dark' ? '#fff' : "#000" }]}>User Id {this.state.UserId}</Text> */}
                        <Text style={[styles.LabelBox, { padding: 10, fontWeight: 'bold', color: appearance === 'dark' ? '#fff' : "#000" }]}>Complaint No. {this.state.ComplaintNo}</Text>
                    </View>
                    <View style={{ height: 50, marginTop: 15, }}>
                        <Dropdown
                            style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue', width: 200 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={{ color: '#000' }}
                            data={this.state.StatusList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Status' : '...'}
                            searchPlaceholder="Search..."
                            value={this.state.KNO}
                            onFocus={() => this.setState({ isFocus: true })}
                            onBlur={() => this.setState({ isFocus: false })}
                            onChange={item => {
                                this.setState({ StatusId: item.value });
                                this.setState({ StatusName: item.label });
                                this.setState({ isFocus: false })
                            }}
                        />
                    </View>
                    <View style={{ flex: this.state.StatusName === 'Resolved By Consumer' ? 3 : 0.5 }}>
                        <TextInput
                            style={[styles.LabelBox,{height:150}]}
                            multiline={true}
                            placeholder="Enter Remark"
                            placeholderTextColor="#000"
                            onChangeText={(text) => { this.setState({ Remark: text }); }}
                        />
                        {this.state.StatusName === 'Resolved By Consumer' && (
                        <View style={{ flex:3, margin: 0, flexGrow: 1 }}>
                            <SignatureCapture
                                style={[{ flexGrow: 3 }, styles.signature]}
                                ref="sign"
                                onSaveEvent={this._onSaveEvent}
                                onDragEvent={this._onDragEvent}
                                saveImageFileInExtStorage={false}
                                showNativeButtons={false}
                                showTitleLabel={false}
                                backgroundColor="#cccccc"
                                strokeColor="#000000"
                                minStrokeWidth={8}
                                maxStrokeWidth={8}
                                viewMode={"portrait"} />

                            <View style={{ flex: 0.5, flexDirection: "row" }}>
                                <TouchableOpacity style={styles.buttonStyle}
                                    onPress={() => { this.saveSign() }} >
                                    <Text>Save</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonStyle}
                                    onPress={() => { this.resetSign() }} >
                                    <Text>Reset</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                         )}
                    </View>
                    <View style={{alignItems:'center',flex:1,marginTop:-50 }}>
                        <TouchableOpacity style={[styles.Btn, styles.shadowProp]} onPress={() => this._Update()}>
                            <Text style={styles.BtnText}>Submit Remark</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
