import React from 'react';
import { View } from 'react-native';

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export class RNCamera extends React.Component {
    static Constants = {
        Aspect: {},
        BarCodeType: {},
        Type: { back: 'back', front: 'front' },
        CaptureMode: {},
        CaptureTarget: {},
        CaptureQuality: {},
        Orientation: {},
        FlashMode: {},
        TorchMode: {},
    }

    takePictureAsync = () => {
        return new Promise(resolve => {
            resolve({
                uri: 'caminho_arquivo',
            });
            this.props.onPictureTaken();
        });
    }

    recordAsync = async () => {
        this.props.onRecordingStart();
        return new Promise(resolve => {
            resolve({
                uri: 'caminho_arquivo',
            });
            this.stopRecording();
        });
    }

    stopRecording = () => {
        this.props.onRecordingEnd();
    }

    render() {
        return (
            <View {...this.props} />
        )
    }
}

export default RNCamera;