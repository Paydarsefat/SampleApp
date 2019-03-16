import React, {Component} from "react";
import { Text, View, TouchableHighlight, WebView} from "react-native";

export default class Webviewtest extends Component {

    constructor( props ) {
        super( props );

        this.webView = null;
    }

    onMessage( event ) {
        console.log( "On Message", event.nativeEvent.data );
    }

    sendPostMessage() {
        console.log( "Sending post message" );
        this.webView.postMessage( "Post message from react native" );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TouchableHighlight style={{padding: 10, backgroundColor: 'blue', marginTop: 20}} onPress={() => this.sendPostMessage()}>
                    <Text style={{color: 'white'}}>Send post message from react native</Text>
                </TouchableHighlight>
                <WebView
                    style={{flex: 1}}
                    source={{uri: 'https://popping-heat-6062.firebaseapp.com'}}
                    ref={( webView ) => this.webView = webView}
                    onMessage={this.onMessage}
                />
            </View>
        );
    }
}

