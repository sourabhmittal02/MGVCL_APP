import React from 'react';
import { Appearance, Alert, BackHandler, View, TouchableOpacity, Text, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from './Service/NavigationService';
import BackIcon from './images/back.png';
import LinearGradient from 'react-native-linear-gradient';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appearance: Appearance.getColorScheme(),
        }
    }
    componentDidMount() {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
            this.setState({ appearance: colorScheme });
        });
    }
    logout = () => {
        AsyncStorage.clear();
        Alert.alert(
            'Logout App',
            'Logout the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => {
                    AsyncStorage.clear();
                    NavigationService.navigateAndReset('Login');
                }
            },], {
            cancelable: false
        }
        )
        // global.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }],
        // });
    }
    goBack() {
        this.props.navigation.goBack();
    }
    render() {
        const { appearance } = this.state;
        return (
            // <TouchableOpacity>
            <>
                <StatusBar barStyle={appearance === 'dark' ? 'light-content' : 'dark-content'} hidden={false} backgroundColor="transparent" translucent={true} animated={true} />
                <LinearGradient style={{paddingTop:40, height: 80, justifyContent: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#486fe4', '#68bddc']} >
                    <View on style={{  flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            {this.props.showBack && <TouchableOpacity onPress={() => { this.goBack() }}>
                                <Image style={{tintColor:appearance==='dark'?"#fff": "#000", width: 25, height: 25, marginRight: 0, resizeMode: 'contain',  marginLeft: 10 }} source={BackIcon}></Image>
                            </TouchableOpacity>}
                        </View>
                        <Text style={{ flex: 1.5, fontSize: 16, color:appearance==='dark'? "#fff":"#000", alignSelf: "center", textAlign: "center" }}>{this.props.title}</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={this.logout}>
                                <Image style={{ width: 25, height: 25, marginRight: 0, tintColor:appearance==='dark'?"#fff": "#000", marginRight: 10, resizeMode: 'contain' }} source={this.props.rightIcon}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </>
            // </TouchableOpacity>
        )
    }
}
