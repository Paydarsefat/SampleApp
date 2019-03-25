import React, {Component} from "react";
import chabokpush from 'chabokpush-rn';
import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import {StyleSheet, Button, Text, View, TextInput,TouchableOpacity ,Alert} from 'react-native';

export default class Pushrn extends Component {

    constructor(props){
        super(props);

        this.state = {
            tagName: 'FREE',
            userId: undefined,
            channel: undefined,
            connectionColor: 'red',
            messageReceived: undefined,
            connectionState: 'Disconnected',
            messageBody: 'Hello world Message'
        };
    }

    componentDidMount(){
        this.initChabok();
        this.initPushNotification();
        this.onRegisterTapped();
    }

    initChabok() {
        const authConfig = {
            devMode: true,
            appId: 'pabecopo',
            username: 'rucesuitga',
            password: 'ohedodoceis',
            apiKey: 'd132b341126250955a7602da2b201af6ee8c838c'
        };
        const options = {
            silent: true
        };
        this.chabok = new chabokpush(authConfig, options);

        this.chabok.on('message', msg => {
            var phone = msg && msg.publishId && msg.publishId.split('/')[0];
            if (!phone) {
                phone = msg.channel.split('/')[0];
            }
            this.sendLocalPushNotification(msg,phone);
            var messageJson = this.getMessages() + JSON.stringify(msg);
            this.setState({messageReceived: messageJson});
        });

        this.chabok.on('closed', _ => {
            this.setState({
                connectionColor: 'red',
                connectionState: 'Closed'
            })
        });

        this.chabok.on('error', _ => {
            this.setState({
                connectionColor: 'red',
                connectionState: 'Error'
            })
        });

        this.chabok.on('connecting', _ => {
            this.setState({
                connectionColor: 'yellow',
                connectionState: 'Connecting'
            })
        });

        this.chabok.on('disconnected', _ => {
            this.setState({
                connectionColor: 'red',
                connectionState: 'Disconnected'
            })
        });
        this.chabok.on('connected', _ => {
            this.setState({
                connectionColor: 'green',
                connectionState: 'Connected'
            })
        });

        this.chabok.getUserId()
            .then(userId => {
                if (userId) {
                    this.setState({userId});
                    this.chabok.register(userId);
                }
            })
            .catch();
    }

    initPushNotification() {
        PushNotification.configure({
            onRegister:  ({token}) => {
                if(token){
                    this.chabok.setPushNotificationToken(token)
                }
            },
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                console.warn( 'NOTIFICATION:', notification );
                // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            senderID: "839879285435", // ANDROID ONLY: (optional) GCM Sender ID.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }

    sendLocalPushNotification(msg, user) {
        const notifObject = {
            show_in_foreground: true,
            local_notification: true,
            priority: "high",
            message: msg.content,
            /* Android Only Properties */
            ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: msg.content, // (optional) default: "message" prop
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            title: `New message from ${user}`, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        };
        PushNotification.localNotification(notifObject);
    }

    //  ----------------- Register Group -----------------
    onRegisterTapped() {
        //Alert.alert(this.props.userId)
        const {userId} = this.props;
        if (userId) {
            this.chabok.register(userId);
        } else {
            console.warn('The userId is undefined');
        }
    }
    onUnregisterTapped() {
        this.chabok.unregister();
    }
    onSubscribeTapped() {
        if (this.state.channel) {
            this.chabok.subscribe(this.state.channel);
        } else {
            console.warn('The channel name is undefined');
        }
    }
    onUnsubscribeTapped() {
        if (this.state.channel) {
            this.chabok.unSubscribe(this.state.channel);
        } else {
            console.warn('The channel name is undefined');
        }
    }

    // ----------------- Publish Group -----------------
    onPublishTapped() {
        const msg = {
            channel: "default",
            user: this.state.userId,
            content: this.state.messageBody || 'Hello world'
        };
        this.chabok.publish(msg)
    }
    onPublishEventTapped() {
        this.chabok.publishEvent('batteryStatus', {state: 'charging'});
    }

  //  ----------------- Tag Group -----------------
  onAddTagTapped() {
        if (this.state.tagName) {
            this.chabok.addTag(this.state.tagName)
                .then(({count}) => {
                    alert(this.state.tagName + ' tag was assign to ' + this.getUserId() + ' user with '+ count + ' devices');
                })
                .catch(_ => console.warn("An error happend adding tag ..."));
        } else {
            console.warn('The tagName is undefined');
        }
    }
    onRemoveTagTapped() {
        if (this.state.tagName) {
            this.chabok.removeTag(this.state.tagName)
                .then(({count}) => {
                    alert(this.state.tagName + ' tag was removed from ' + this.getUserId() + ' user with '+ count + ' devices');
                })
                .catch(_ => console.warn("An error happend removing tag ..."));
        } else {
            console.warn('The tagName is undefined');
        }
    }

  //  ----------------- Track Group -----------------
  onAddToCartTrackTapped() {
        this.chabok.track('AddToCard',{order:'200'});
    }
    onPurchaseTrackTapped() {
        this.chabok.track('Purchase',{price:'15000'});
    }
    onCommentTrackTapped() {
        this.chabok.track('Comment',{postId:'1234555677754d'});
    }
    onLikeTrackTapped() {
        this.chabok.track('Like',{postId:'1234555677754d'});
    }

    getUserId() {
        return this.props.userId || ''
    }

    getMessages() {
        if (this.state.messageReceived) {
            return this.state.messageReceived + '\n --------- \n\n';
        }
        return '';
    }

    getTagName() {
        return this.state.tagName || '';
    }

    getMessageBody() {
        return this.state.messageBody || '';
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.nestedButtonView} marginTop={-10}>
                    <View style={styles.circleView} backgroundColor={this.state.connectionColor}/>
                    <Text>{this.state.connectionState}</Text>
                </View>
                <View style={styles.nestedButtonView}>
                    <TextInput
                        style={styles.input}
                        placeholder="User id"
                        width="60%"
                        ///onChangeText={userId => this.setState({userId})}
                        >
                        {this.getUserId()}</TextInput>
                    <TextInput
                        style={styles.input}
                        width="40%"
                        placeholder="Channel name"
                        onChangeText={channel => this.setState({channel})}/>
                </View>

                <View style={styles.nestedButtonView}>

                    <Button
                        style={styles.button}
                        title="Register"
                        onPress={this.onRegisterTapped.bind(this)}/>
                    <Button
                        style={styles.button}
                        title="Unregister"
                        onPress={this.onUnregisterTapped.bind(this)}/>
                </View>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingRight: 12,
        paddingLeft: 12,
        paddingBottom: 12,
        width: '100%',
    },
    nestedButtonView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    circleView:{
        width: 15,
        height: 15,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 4
    },
    button: {
        padding: 2,
        marginLeft: 2,
        marginRight: 2
    },
    textView:{
      borderColor: 'rgba(127,127,127,0.3)',
        backgroundColor: 'rgba(127,127,127,0.06)',
        width: '100%',
        height: '70%',
    },
    input: {
        padding: 4,
        height: 40,
        borderColor: 'rgba(127,127,127,0.3)',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 0,
        marginRight: 5,
        marginLeft: 0
    }
});

