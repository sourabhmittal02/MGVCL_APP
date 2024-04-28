import React, { Component } from 'react'
import { Image, Appearance, SafeAreaView, BackHandler, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import styles from './Style';
import logout from './images/logout.png';
import edit from './images/edit.png';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Phone: '',
      Email: '',
      RoleId: '',
      isLoading: false,
      openModel: false,
      appearance: Appearance.getColorScheme(),
    }
  }
  async componentDidMount() {
    this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      this.setState({ appearance: colorScheme });
    });
    this._GetToken();
    let uid = await AsyncStorage.getItem('USER_ID');
    let roleid = await AsyncStorage.getItem('ROLE_ID');
    console.log("ROLE:", roleid, "=", uid);
    this.setState({ RoleId: roleid });
    this._GetUserDetails(uid);
    //When Back To This Screen
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this._GetUserDetails(uid);
    });
    let nm = await AsyncStorage.getItem('Name');
    this.setState({ Name: nm });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    this.focusListener();
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton = () => {
    if (!this.props.navigation.isFocused()) {
      // The screen is not focused, so don't do anything
      return false;
    }
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => {
          //AsyncStorage.clear(); global.scrName = '';
          BackHandler.exitApp()
        }
      },], {
      cancelable: false
    }
    )
    return true;
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
  _GetUserDetails = async (uid) => {
    let token = "Bearer " + await AsyncStorage.getItem('Token');
    let rawbody = {
      "userid": uid,
      "kno": 0
    }
    fetch(global.URL + "Complaint/getdetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "platform": Platform.OS
      },
      body: JSON.stringify(rawbody),
      redirect: 'follow'
    }).then(response => response.text()).then(async responseText => {
      try {
        var respObject = JSON.parse(responseText);
        console.log("Details:", respObject);
        await AsyncStorage.setItem('Mobile', respObject[0].mobile_NO.toString());
        await AsyncStorage.setItem('Email', respObject[0].email);
        this.setState({ Phone: respObject[0].mobile_NO.toString() });
        this.setState({ Email: respObject[0].email });
      }
      catch (error) {
        console.log(error);
        Alert.alert(global.TITLE, error);
      }
    });
  }
  _RegNew = () => {
    this.props.navigation.navigate('RegisterComplaint', { name: 'RegisterComplaint' })
  }
  _ShowStatus = () => {
    this.props.navigation.navigate('ComplaintStatus', { name: 'ComplaintStatus' })
  }
  _ShowProfile = () => {
    this.props.navigation.navigate('Profile', { name: 'Profile' })
  }
  _AddKNO = () => {
    this.props.navigation.navigate('AddKNO', { name: 'AddKNO' })
  }
  _ShowAllComplaint = () => {
    this.props.navigation.navigate('FRTComplaint', { name: 'FRTComplaint' })
  }
  SignCap(){
    this.props.navigation.navigate('Sign', { name: 'Sign' })

  }
  render() {
    const {appearance}=this.state;
    const Menu = () => {
      return (
        <View>
          {/* FRT Login */}
          {this.state.RoleId === '10' && (
            <>
              <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10, marginBottom: -10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Arial", fontSize: 20, color: '#d15613' }}>Information</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.icon} onPress={() => this._ShowAllComplaint()} >
                    <View>
                      <Image
                        style={{ width: 50, height: 50, alignSelf: 'center' }}
                        source={require('./images/complaint.png')}
                      />
                      <Text style={{ fontSize: 10, color: '#000', alignSelf: 'center' }}>Show Complaint</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.icon} onPress={() => this.SignCap()} >
                  <Text>Image Capture</Text>
                </TouchableOpacity>
                </View> */}
                <View style={{ flex: 1 }}></View>
              </View>
            </>
          )}
          {/* outbound login */}
          {this.state.RoleId === '2' && (
            <></>
          )}
          {/* User Ligin */}
          {this.state.RoleId === '11' && (
            <>
              <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10, marginBottom: -10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Arial", fontSize: 18, color: '#d15613' }}>Add Information</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.icon} onPress={() => this._AddKNO()} >
                    <View>
                      <Image
                        style={{ width: 45, height: 45, alignSelf: 'center' }}
                        source={require('./images/kno.png')}
                      />
                      <Text style={{ fontSize: 14, color: '#000', alignSelf: 'center' }}>Add KNO</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1 }}></View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: -10, marginLeft: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Arial", fontSize: 18, color: '#d15613' }}>Complaints Details</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.icon} onPress={() => this._RegNew()} >
                    <View>
                      <Image
                        style={{ width: 45, height: 45, alignSelf: 'center' }}
                        source={require('./images/complaint.png')}
                      />
                      <Text style={{ fontSize: 14, color: '#000', alignSelf: 'center' }}>Register New</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.icon} onPress={() => this._ShowStatus()} >
                    <View>
                      <Image
                        style={{ width: 45, height: 45, alignSelf: 'center' }}
                        source={require('./images/status.png')}
                      />
                      <Text style={{ fontSize: 14, color: '#000', alignSelf: 'center' }}>Status</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.icon} onPress={() => this._ShowProfile()} >
                    <View>
                      <Image
                        style={{ width: 45, height: 45, alignSelf: 'center' }}
                        source={require('./images/view.png')}
                      />
                      <Text style={{ fontSize: 14, color: '#000', alignSelf: 'center' }}>View Profile</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={this.props.navigation} showBack={false} title={"Dashboard"} rightIcon={logout} openModeModel={'Dasboard'} />
        <ScrollView>
          <View style={{ flex: 1 }}>
            {/* <ImageBackground source={require('./images/bg.png')} resizeMode="stretch" style={styles.img}> */}
            <View style={{flexDirection: 'row',height:70 }}>
              <View style={{ flex: 1, alignItems: 'flex-end',margin:-10,marginRight:10 }}>
                <TouchableOpacity style={styles.icon} onPress={() => this._ShowProfile()} >
                  <Image style={{ width: 30, height: 30, alignSelf: 'center' }} source={edit} />
                  <Text style={{textAlign:'center', fontFamily: "Arial", fontSize: 12, color: '#000' }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <LinearGradient style={[styles.ProfileBox]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#486fe4', '#68bddc']} >
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontFamily: "Arial", fontSize: 14, color:appearance==='dark'?'#fff': '#000', textDecorationLine: 'underline' }}>Name </Text>
                  <Text style={{ fontFamily: "Arial", fontSize: 14, color:appearance==='dark'?'#fff':  '#000' }}>{this.state.Name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Arial", fontSize: 14, color:appearance==='dark'?'#fff':  '#000', textDecorationLine: 'underline' }}>Mobile </Text>
                  <Text style={{ fontFamily: "Arial", fontSize: 14, color:appearance==='dark'?'#fff':  '#000' }}>{this.state.Phone}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontFamily: "Arial", fontSize: 14, color:appearance==='dark'?'#fff': '#000', textDecorationLine: 'underline' }}>Email </Text>
                  <Text style={{ fontFamily: "Arial", fontSize: 14, color:appearance==='dark'?'#fff': '#000' }}>{this.state.Email}</Text>
                </View>
              </View>
            </LinearGradient>
            <View style={{ alignItems: 'flex-start' }}>
            </View>
            <Menu />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
