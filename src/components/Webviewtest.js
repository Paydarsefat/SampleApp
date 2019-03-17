import React, {Component} from "react";
import { Alert, Text, View,Button, TouchableHighlight,WebView} from "react-native";
import { bindExpression } from "@babel/types";
// import { WebView } from 'react-native-webview';


export default class Webviewtest extends Component {

    constructor( props ) {
        super( props );

        this.webView = null;
        this.state = {
            zip :'ok'
        }
        this.onMessage = this.onMessage.bind(this)
    }

    onMessage( event ) {
        console.log( "On Message", event.nativeEvent.data );
       Alert.alert("دریافت اطلاعات از وب در موبایل 2 On Message");
      this.setState({
        zip: event.nativeEvent.data+"ops"
      })
    }

    sendPostMessage() {
        console.log( "Sending post message" );
        Alert.alert("ارسال از موبایل به وب 2  sendPostMessage");
        this.webView.postMessage( "Post message from react native" );
    }

    render() {
        return (
            
            <View  style={{flex: 1}}>
                <Button style={{padding: 10, backgroundColor: 'blue', marginTop: 20}}    title="sendPostMessage"
onPress={() => this.sendPostMessage()}/>
 <Button style={{padding: 10, backgroundColor: '#ffffff', marginTop: 20}}    title="Get Message"
onPress={this.onMessage}/>
 <Text style={{flex :1}}>
      You input {this.state.zip}.
      </Text>
                <WebView
                    style={{flex: 1}}
                     source={{uri:'https://www.salamati24.com/testi'}}
                    ref={( webView ) => this.webView = webView}
                    onMessage={this.onMessage}
                />
            </View>
            
        );
    }
}

