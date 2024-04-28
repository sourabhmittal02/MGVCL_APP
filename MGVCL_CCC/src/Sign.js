import React, { Component } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, TouchableHighlight } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-picker';

class SignatureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signatureImage: null,
        };
    }

    // handleSaveSignature = () => {
    //     this.signatureRef.saveImage().then((path) => {
    //         this.setState({ signatureImage: path });
    //     });
    // };

    // handleClearSignature = () => {
    //     this.signatureRef.resetImage();
    //     this.setState({ signatureImage: null });
    // };

    // handleSelectSignatureImage = () => {
    //     const options = {
    //       title: 'Select Signature Image',
    //       storageOptions: {
    //         skipBackup: true,
    //         path: 'images',
    //       },
    //     };

    //     ImagePicker.launchImageLibrary(options, (response) => {
    //       if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //       } else if (response.error) {
    //         console.log('ImagePicker Error: ', response.error);
    //       } else {
    //         this.setState({ signatureImage: response.uri });
    //       }
    //     });
    //   };

    // handleSendSignature = () => {
    //     const { signatureImage } = this.state;
    //     if (!signatureImage) {
    //         Alert.alert('Error', 'Please sign first or select a signature image');
    //         return;
    //     }

    //     // Send signatureImage to server
    //     // Example: You can use fetch or axios to send the image
    // };
    saveSign() {
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result.pathName);
    }
    _onDragEvent() {
        // This callback will be called when the user enters signature
        console.log("dragged");
    }
    render() {
        const { signatureImage } = this.state;

        return (
            // <View style={styles.container}>
            //     <SignatureCapture
            //         style={styles.signature}
            //         ref={(ref) => {
            //             this.signatureRef = ref;
            //         }}
            //         onSaveEvent={this.handleSaveSignature}
            //     />

            //     <Button title="Clear Signature" onPress={this.handleClearSignature} />

            //     <Button title="Select Signature Image" onPress={this.handleSelectSignatureImage} />

            //     {signatureImage && (
            //         <View style={styles.previewContainer}>
            //             <Image source={{ uri: signatureImage }} style={styles.previewImage} />
            //         </View>
            //     )}
            //     <Button title="Send Signature" onPress={this.handleSendSignature} />
            // </View>
                <View style={{marginTop:30, flex: 1, flexDirection: "column" }}>
                    <SignatureCapture
                        style={[{ flex:2 }, styles.signature]}
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

                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <TouchableHighlight style={styles.buttonStyle}
                            onPress={() => { this.saveSign() }} >
                            <Text>Save</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={styles.buttonStyle}
                            onPress={() => { this.resetSign() }} >
                            <Text>Reset</Text>
                        </TouchableHighlight>

                    </View>

                </View>
        );
    }
}

const styles = StyleSheet.create({
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
    container: {
        margin:20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    signature: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderColor: '#000',
        borderWidth: 1,
    },
    previewContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
    },
});

export default SignatureScreen;
