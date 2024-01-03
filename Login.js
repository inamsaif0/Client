import React, { useContext,useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'native-base';
import { Dimensions, KeyboardAvoidingView,Keyboard, Image, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text, ScrollView, ListItem } from 'react-native';
import { Icon } from 'native-base';
import { Checkbox } from 'react-native-paper';
// import { Container, Header, Content, Form, Item, Input } from 'native-base';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';
// import adaptiveicon from './assets/adaptive-Icon.png'
// import adaptiveicon from './assets/adaptive-Icon.png'4
import adaptiveicon from './assets/adaptive-icon_home.png'
import { UserContext } from './App';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login({ navigation }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [checked, setChecked] = React.useState(false);
    const [block,setBlocker]=React.useState(false);
    //const navigation = useNavigation();
    const { setUserEmail } = useContext(UserContext)


    const [error, setError] = React.useState(false)
    const handleLogin = async () => {
       
        validateEmail();
        validatePassword();
        if (!emailError && !passwordError) {
            const response = await axios.post('http://52.78.100.137:3001/login', {
                email: email,
                password: password
            })
            if (response.data.success) {
                setUserEmail(email)
                try {
                    await AsyncStorage.setItem('userId', response.data.message.studentName);
                    await AsyncStorage.setItem('email', response.data.message.studentId);
                    await AsyncStorage.setItem('level', response.data.message.level);
                    if(checked){
                        await AsyncStorage.setItem('session',`${checked}`)      
                        await AsyncStorage.setItem('sessionEmail',`${response.data.message.studentId}`)      
                    }
                    console.log('User ID set in AsyncStorage:', response.data.message._id);
                } catch (error) {
                    console.error('Failed to set user ID in AsyncStorage:', error);
                    // alert('Wrong Credentials')
                }
                console.log(response)
                navigation.replace('Home')
                
                
            }
            else {
                if(response.data?.message==="blocked")
                {
                    setBlocker(true)
                }
                else{

                    setUserEmail(email)
                    setError(true)
                }
                console.log(error)
            }
            
        }
    }
    useEffect(()=>{
        async function checkSession(){
            await AsyncStorage.getItem('session')
            .then((session)=>{
                if(session==='true')
                {
                    navigation.replace('Home')
                }
            })
            await AsyncStorage.getItem('sessionEmail').then((userEmail)=>setUserEmail(userEmail))
        }
        checkSession()
    },[])

    const validateEmail = () => {
        if (!email) {
            setEmailError('Email is required');
        } else if (!isValidEmail(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Password is required');
        } else {
            setPasswordError('');
        }
    };

    const isValidEmail = (value) => {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    // const handleLogin = () => {
    //     validateEmail();
    //     validatePassword();

    //     if (!emailError && !passwordError) {
    //         // Proceed with login logic here
    //         console.log('Login pressed');
    //         navigation.navigate('Home');
    //     }
    // };
    // const handleFacebookLogin = () => {
    //     // Handle Facebook login here
    //     console.log('Facebook login pressed');
    //   };

    //   const handleTwitterLogin = () => {
    //     // Handle Twitter login here
    //     console.log('Twitter login pressed');
    //   };

    //   const handleInstagramLogin = () => {
    //     // Handle Instagram login here
    //     console.log('Instagram login pressed');
    //   };

    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


        <ScrollView style={{ flex: 1, backgroundColor: '#fffff' }}
            showsVerticalScrollIndicator={false}>
                <View style={{zIndex:0, height: Dimensions.get('window').height / 2.1, }}>


                <View style={styles.brandView}>
                    {/* <Icon
                        name="location-sharp"
                        style={{ color: "#ffff", fontSize: 100 }}
                    /> */}
                    <Image source={adaptiveicon} style={{ height: 200, width: 200 }}></Image>

                </View>
                    </View>
            <View style={styles.bottomView}>
                <View style={{ padding: 60 }}>
                    <Text style={{ fontSize: 34, color: '#5c0931' }} >Welcome</Text>
                    
                    <View style={styles.bottomPart}>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            onBlur={validateEmail}
                            style={styles.input}
                            left={<TextInput.Icon icon="account" />}

                        />
                        <HelperText type="error" visible={!!emailError}>
                            {emailError}
                        </HelperText>
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            onBlur={validatePassword}
                            secureTextEntry
                            style={styles.input}
                            left={<TextInput.Icon icon="lock" />}
                        />
                        <HelperText type="error" visible={!!passwordError}>
                            {passwordError}
                        </HelperText>

                        {
                            error ? (<Text style={{color:"red"}}>wrong credentials try again</Text>) : null
                        }
                        <View style={styles.end}>
                            <Checkbox.Android
                                style={{}}
                                theme={{ colors: { primary: '#5c0931' } }}
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked);
                                }}
                            />
                            <Text>Remember Me</Text>
                            {/* <Text style={{alignSelf:'flex-end'}}>Forgot Password</Text> */}
                        </View>
                    </View>
                    <Button onPress={handleLogin} style={styles.button} theme={{ colors: { primary: '#ffff' } }}>
                        Login
                    </Button>
                    {
                        block&&(<Text style={{color:'red'}}>your account has been deactivated</Text>)
                    }

                </View>
            </View>
            {/* <StatusBar style="auto" /> */}
        </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    brandView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
        paddingBottom:50
    },
    brandViewText: {
        color: "#ffff",
        fontSize: 40,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    bottomView: {
        zIndex:1,
        marginTop:-50,
        flex: 1,
        borderTopStartRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor:'white',
    },
    container: {
     flex:1,
     
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#5c0931',
        fontColor: '#ffff',
        marginBottom: 80
    },
    bottomPart: {
        marginTop: 30,
    },
    end: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    socialButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',

        marginTop: 20,
    },
    socialButton: {
        width: 40,
        marginTop: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    socialButtonContent: {
        // Adjust the width as per your requirement
        height: 36,
    },
    socialButtonLabel: {
        fontSize: 14,
    },
    facebookButton: {
        backgroundColor: '#4267B2',
    },
    twitterButton: {
        backgroundColor: '#1DA1F2',
    },
    instagramButton: {
        backgroundColor: '#C13584',
    },
    socialIcon: {
        color: '#FFFFFF',
        marginLeft: 15
    },
});
