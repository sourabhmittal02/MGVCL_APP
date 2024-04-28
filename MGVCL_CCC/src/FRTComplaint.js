import React, { Component } from 'react'
import { FlatList, Image, SafeAreaView, BackHandler, Alert, ActivityIndicator,Appearance, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';

export default class FRTComplaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
            OID: '',
            scrName: '',
            ListComplaint: [],
            showPopup: false,
            showDetailPopup: false,
            ItemDetail: [],
            StatusList: [],
            StatusId: '',
            CNos: '',
            UserId: '',
            Remark: '',
            appearance: Appearance.getColorScheme(),
        }
    }
    async componentDidMount() {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
            this.setState({ appearance: colorScheme });
        });
        this._GetToken();
        this.setState({ scrName: "FRT Complaints" })
        let oid = await AsyncStorage.getItem('officE_ID');
        this.setState({ OID: oid.toString() });
        let uid = await AsyncStorage.getItem('USER_ID');
        this.setState({ UserId: uid.toString() });
        this._ListFRTComplaint();
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
    _ListFRTComplaint = async () => {
        let token = "Bearer " + await AsyncStorage.getItem('Token');
        let body = {
            "officeId": this.state.OID.toString()
        }
        // console.log("Office Id==>", body);
        fetch(global.URL + "Complaint/GetFRTWiseComplaint", {
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
                // console.log(respObject);
                this.setState({ ListComplaint: respObject });
            } catch (error) {
                this.setState({ isLoading: false });
                console.log("1. ", error);
                alert(error);
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
    _AddRemark(ComplaintNo) {
        // this.setState({ CNos: ComplaintNo });
        // this.setState({ showPopup: !this.state.showPopup });
        this.props.navigation.navigate('AddRemark', {name: 'AddRemark',CompNo:ComplaintNo});
    }
    _ShowDetail(obj) {
        this.setState({ showDetailPopup: true });
        this.setState({ ItemDetail: obj });
        console.log('===>', obj);
    }
    handleDetailModelClose = () => {
        this.setState({ showDetailPopup: false });
    }
    handleModalClose = async () => {
        if (this.state.Remark == '') {
            this.setState({ showPopup: false });
        }
        else {
            let token = "Bearer " + await AsyncStorage.getItem('Token');
            let body = {
                "complaintNo": this.state.CNos.toString(),
                "userID": this.state.UserId.toString(),
                "remark": this.state.Remark,
                "status": this.state.StatusId
            }
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
                        this.setState({ showPopup: false });
                        Alert.alert("AVVNL", respObject.status);
                    }
                } catch (error) {
                    this.setState({ isLoading: false });
                    console.log("1. ", error);
                    alert(error);
                }
            });
        }
    };
    FlatListHeader = () => {
        const {appearance}=this.state;
        return (
            <View
                style={{
                    marginTop: 0,
                    height: 40,
                    width: "100%",
                    backgroundColor: "#000",//"#014260",//"#b5f5bf",
                    flexDirection: 'row'
                }}>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 0.5, color:appearance==='dark'?'#fff': "#000" }}>#</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 2, color: appearance==='dark'?'#fff': "#000" }}>Complaint No</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Type</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Name</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Status</Text>
                <Text style={{ fontSize: 14, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Action</Text>
            </View>
        );
    }
    _HideRemark() {
        this.setState({ showPopup: false });
    }
    render() {
        const {appearance}=this.state;
        const MyHeader = () => {
            return (
                <View
                    style={{
                        marginTop: 0,
                        height: 40,
                        width: "100%",
                        backgroundColor: "#486fe4",//"#014260",//"#b5f5bf",
                        flexDirection: 'row',
                        elevation: 5, // Adjust the elevation to control the shadow effect
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 3.84,
                    }}>
                    <Text style={{ fontSize: 12, marginLeft: 10, alignSelf: "center", flex: 0.5, color: appearance==='dark'?'#fff': "#000" }}>#</Text>
                    <Text style={{ fontSize: 12, marginLeft: 10, alignSelf: "center", flex: 2, color: appearance==='dark'?'#fff': "#000" }}>Complaint No</Text>
                    <Text style={{ fontSize: 12, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Type</Text>
                    <Text style={{ fontSize: 12, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Name</Text>
                    <Text style={{ fontSize: 12, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Status</Text>
                    <Text style={{ fontSize: 12, marginLeft: 10, alignSelf: "center", flex: 1, color: appearance==='dark'?'#fff': "#000" }}>Action</Text>
                </View>
            );
        };
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation} showBack={true} showImage={false} title={this.state.scrName} rightIcon={logout} openModeModel={'ChangePass'} />
                <MyHeader />
                <FlatList
                    data={this.state.ListComplaint}
                    // ListHeaderComponent={this.FlatListHeader}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <View style={{ paddingTop: 5, paddingBottom: 10, width: '100%', backgroundColor: index % 2 == 0 ? "#ffffff" : "#eaeefc", flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 0.5, color: "#000000" }}>{index + 1}</Text>
                            {/* <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.complaintNo}</Text> */}
                            <View style={{ alignSelf: "center", flex: 0.8, }}>
                                <TouchableOpacity onPress={() => {
                                    this._ShowDetail(item);
                                }}>
                                    <Text style={{ marginLeft: 8, fontSize: 8, color: "#0000ff", fontWeight: 'bold' }}>{item.complaintNo}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, }}>
                                <TouchableOpacity onPress={() => {
                                    this._ShowDetail(item);
                                }}>
                                    <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.complaintType}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, }}>
                                <TouchableOpacity onPress={() => {
                                    this._ShowDetail(item);
                                }}>
                                    <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, }}>
                                <TouchableOpacity onPress={() => {
                                    this._ShowDetail(item);
                                }}>
                                    <Text style={{ marginLeft: 10, alignSelf: "center", fontSize: 11, flex: 1, color: "#000000" }}>{item.complaint_Status}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => {
                                this._AddRemark(item.complaintNo);
                            }}
                            >
                                <Image
                                    style={{ marginRight: 20, width: 30, height: 30, alignSelf: 'center' }}
                                    source={require('./images/remark.png')}
                                />
                                <Text style={{ marginRight: 20, alignSelf: "center", color: "red", fontSize: (10), }}>Remark</Text></TouchableOpacity>
                        </View>
                    }
                />
                {/* Model For Complaint Detail */}
                <Modal visible={this.state.showDetailPopup} transparent={true} animationType='slide' onRequestClose={this.handleDetailModelClose}>
                    <View style={[styles.popup1]}>
                        <View style={{ flex: 3 }}>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Complaint No.: {this.state.ItemDetail.complaintNo}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Complaint Type: {this.state.ItemDetail.complaintType}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Complaint Status: {this.state.ItemDetail.complaint_Status}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Name: {this.state.ItemDetail.name}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Father Name: {this.state.ItemDetail.fatheR_NAME}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>KNO: {this.state.ItemDetail.kno}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Mobile: {this.state.ItemDetail.mobilE_NO}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Alternate No.: {this.state.ItemDetail.alternatE_MOBILE_NO}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Address: {this.state.ItemDetail.address}</Text>
                        </View>
                        <TouchableOpacity style={styles.Btn} onPress={this.handleDetailModelClose}>
                            <Text style={{ color: appearance==='dark'?'#fff': "#000" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/* Model For Add Complaint Remark */}
                <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.handleModalClose}>
                    <View style={[styles.popup]}>
                        <View style={{ marginTop: -20, alignSelf: 'flex-end' }}>
                            <Text onPress={() => this._HideRemark()} style={{padding:5, color: 'red', fontSize: 20 }}>X</Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>Complaint No. {this.state.CNos}</Text>
                            <Text style={[styles.Label,{color:appearance==='dark'?'#fff': "#000"}]}>User Id {this.state.UserId}</Text>
                        </View>
                        <View style={{ flex: 3, marginTop: 15 }}>
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
                                    this.setState({ isFocus: false })
                                }}
                            />
                        </View>
                        <View style={{ flex: 2,margin:0 }}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Enter Remark"
                                placeholderTextColor="#000"
                                onChangeText={(text) => { this.setState({ Remark: text }); }}
                            />
                        </View>
                        <View style={{margin:0, flexDirection:'row-reverse' }}>
                            <TouchableOpacity style={styles.Btn} onPress={this.handleModalClose}>
                                <Text style={{ color: appearance==='dark'?'#fff': "#000" }}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
