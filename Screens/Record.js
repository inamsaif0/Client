import * as React from 'react';
import { Text, View, StyleSheet, Animated, Pressable, Easing, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import Timer from '../Components/Timer';
import { AntDesign } from '@expo/vector-icons';
import { useState, useContext } from 'react'
import { Entypo } from '@expo/vector-icons';
import Stopwatch from '../Components/stopwatch';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { EmailContext } from '../Login';
import { UserContext } from '../App';
import { TextInput } from 'react-native';
import AudioPlayer from '../Components/Audioplayer';
// import * as Permissions from 'expo-permissions';
import Autocomplete from 'react-native-autocomplete-input';
import { useEffect } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import { useFocusEffect } from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';



const sendAudioToServer = async (location, email, fileName, teacherName) => {
    try {
        // Read the audio file as binary data
        // console.log('Location',location)
        const audioData = await FileSystem.readAsStringAsync(location, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const time = new Date()
        // console.log('audio',audioData)

        // Send the audio file to the Node.js server
        const response = await fetch('http://52.78.100.137:3001/audio', {
            method: 'POST',
            body: JSON.stringify({ audio: audioData, time: time, email: email, name: fileName.replace(/\s/g, '-'), teacherData: teacherName, status: null }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('response', response)
        return response

    } catch (error) {
        console.error('Error sending audio to server:', error);
    }
};



export default function Record() {
    const email = useContext(UserContext);

    const [fadeInOutAnim] = useState(new Animated.Value(0));


    const navigation = useNavigation()

    const [dataPause, setDataPause] = useState(false);

    const [recording, setRecording] = useState();
    const [fileName, setFileName] = useState('');
    const [pause, setPause] = useState();
    const [isPageRender, setIsPageRender] = useState(false);

    const [location, setLocation] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [clear, setClear] = useState(false)
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [teachers, setTeachers] = useState([]);
    const [teachersName, setTeacherName] = useState('');
    const [showSelectTeacherMessage, setShowSelectTeacherMessage] = useState(false);


    // const [selectedTeacher, setSelectedTeacher] = useState('');


    const [query, setQuery] = useState('');
    // const countries = ["Egypt", "Canada", "Australia", "Ireland"]
    const [screenTime, setScreenTime] = useState(0);
    const isValidEnglishInput = (text) => /^[a-zA-Z0-9 _-]*$/.test(text);


    useEffect(() => {
        let interval;

        if (recording) {
            // Start an interval to update screen time every second
            interval = setInterval(() => {
                setScreenTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            // Cleanup the interval when component unmounts or recording stops
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [recording]);


    useEffect(() => {
        // Fetch data from the API
        fetch('http://52.78.100.137:3001/getTeachers')
            .then(response => response.json())
            .then(data => setTeachers(data.data)) // Assuming the array is under the 'data' property
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    const dropdownData = teachers.map(teacher => teacher.teacherName);



    // const findTeachers = (query) => {
    //     if (query === '') {
    //         return [];
    //     }

    //     const regex = new RegExp(`${query.trim()}`, 'i');
    // let teacherNames = teachers



    const fadeIn = () => {
        Animated.timing(fadeInOutAnim, {
            toValue: 1,
            duration: 500, // Fade in duration (adjust as needed)
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeInOutAnim, {
            toValue: 0,
            duration: 500, // Fade out duration (adjust as needed)
            useNativeDriver: true,
        }).start(() => {
            setShowNotification(false);
        });
    };

    React.useEffect(() => {
        if (showNotification) {
            fadeIn();
            setTimeout(fadeOut, 2000); // Fade out after 2 seconds (adjust as needed)
        }
    }, [showNotification]);


    useEffect(() => {
        // Component mount logic

        return () => {
            // Component unmount logic
            if (recording) {
                stopRecording();
            }
        };
    }, [recording]);
    // useEffect(() => {
    //     // Component mount logic
    //     if(dataPause){
    //         setDataPause(false)
    //     }
    //     else{
    //         setDataPause(true)
    //     }

    // }, []);
    // useEffect(async () => {


    //     const unsubscribeFocus = navigation.addListener('focus', async () => {
    //         // Logic to execute when the component gains focus (e.g., resume recording)
    //         if(dataPause){
    //             setDataPause(false)
    //         }
    //         else{
    //             setDataPause(true)
    //         }
    //         console.log('Component focused');
    //         // Pause recording when the component loses focus

    //     });

    //     const unsubscribeBlur = navigation.addListener('blur', async () => {
    //         // Logic to execute when the component loses focus (e.g., pause recording)
    //         if(dataPause){
    //             setDataPause(false)
    //         }
    //         else{
    //             setDataPause(true)
    //         }
    //         console.log('Component blurred');
    //          // Pause recording when the component loses focus
    //     });
    //     // setIsPlaying(false)

    //     // Cleanup subscriptions when the component unmounts
    //     return  async()  => {
    //       console.log(sound ,'Compodasdas asd d asd asd das asnent focused');





    //         unsubscribeFocus();
    //         unsubscribeBlur();
    //     };
    // }, [navigation]);
    // const navigation = useNavigation();


    const cancelRecording = async () => {

        if (recording) {
            scaleAnimation.stop()
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            setRecording(null);
        }
        setLocation("")
        setClear(!clear)
        setFileName("")

    };


    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');

            const recordingOptions = {
                android: {
                    extension: '.wav', // You can adjust the extension based on your preference
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 32000, // Adjust the bit rate to further reduce file size
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                    // You may need to experiment with these options to find the best quality for your use case
                },
                ios: {
                    extension: '.wav', // You can adjust the extension based on your preference
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 32000, // Adjust the bit rate to further reduce file size
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
                    // You may need to experiment with these options to find the best quality for your use case
                },
            };

            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            console.log(recording, 'sssssss')
            setRecording(recording);
            console.log('Recording started');

            // Assuming you want to stop the recording after 2 minutes (120,000 milliseconds)
            // setTimeout(() => {
            //     stopRecording();
            // }, 120000); // Adjust the duration as needed

        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    // async function startRecording() {
    //     try {
    //         scaleAnimation.start()
    //         console.log('Requesting permissions..');
    //         await Audio.requestPermissionsAsync();
    //         await Audio.setAudioModeAsync({
    //             allowsRecordingIOS: true,
    //             playsInSilentModeIOS: true,
    //         });

    //         console.log('Starting recording..');
    //         const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
    //         );
    //         setRecording(recording);
    //         console.log('Recording started');
    //     } catch (err) {
    //         console.error('Failed to start recording', err);
    //     }
    // }

    // async function stopRecording() {
    //     try {

    //         scaleAnimation.stop()
    //         console.log('Stopping recording..');
    //         setRecording(undefined);
    //         setPause(false)
    //         await recording.stopAndUnloadAsync();
    //         await Audio.setAudioModeAsync({
    //             allowsRecordingIOS: false,
    //         });
    //         const uri = recording.getURI();
    //         setLocation(uri)
    //     }
    //     catch (error) {
    //         console.error(error)
    //     }
    // }
    async function stopRecording() {
        try {
            scaleAnimation.stop();
            console.log('Stopping recording..');

            if (recording) {
                // Check if the recorder exists before stopping it
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setLocation(uri);
            } else {
                console.warn('Recorder does not exist. Prepare it first using Audio.prepareToRecordAsync.');
            }

            setRecording(undefined);
            setPause(false);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function pauseRecording() {
        if (recording) {
            try {
                scaleAnimation.stop()
                const status = await recording.getStatusAsync();
                if (status.isRecording) {
                    await recording.pauseAsync();
                    setPause(true);
                }
            } catch (error) {
                console.error('Error pausing recording:', error);
            }
        }
    }

    async function resumeRecording() {
        if (recording) {
            try {
                scaleAnimation.start()
                const status = await recording.getStatusAsync();
                if (!status.isRecording) {
                    await recording.startAsync();
                    setPause(false);
                }
            } catch (error) {
                console.error('Error resuming recording:', error);
            }
        }
    }



    const retrieveData = async () => {
        try {
            const existingArray = await AsyncStorage.getItem('RECORDING');
            return existingArray ? JSON.parse(existingArray) : [];
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage:', error);
            return [];
        }
    };
    // this is to append the recording in async storage so we can retrive it in future
    const appendValue = async (newValue) => {
        try {
            const existingArray = await retrieveData();
            existingArray.push({ title: currentDateTime, audio: newValue });
            await AsyncStorage.setItem('RECORDING', JSON.stringify(existingArray));
            console.log('Value appended successfully.');
        } catch (error) {
            console.error('Error appending value in AsyncStorage:', error);
        }
    };

    async function goBack() {
        await stopRecording();
        // await pauseRecording()

        navigation.goBack()
    }
    function stateChange() {
        if (dataPause) {
            setDataPause(false)
        }
        else {
            setDataPause(true)
        }
    }
    async function handleUpload() {

        try {
            if (!teachersName) {
                setShowSelectTeacherMessage(true);

                // Hide the message after 5 seconds
                setTimeout(() => {
                    setShowSelectTeacherMessage(false);
                }, 5000);

                return false;
            }
            setLoading(true)
            const response = await sendAudioToServer(location, email.userEmail, fileName, teachersName);
            cancelRecording();
            setLoading(false)
            setShowNotification(true);
            // Handle the response if needed
            console.log('Server response:', response);
        } catch (error) {
            // Handle any errors that occurred during the upload
            console.error('Error uploading audio:', error);
            // Optionally show an error notification or perform other error handling
        }
    }

    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const opacityValue = React.useRef(new Animated.Value(1)).current;



    const scaleAnimation = Animated.loop(
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1.05,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
            }),


        ])
    );

    if (loading) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

                <ActivityIndicator size="large" color="#5c0931" />
                <Text style={{ marginTop: 50, padding: 20, textAlign: "center", fontWeight: 600 }}>Please Don't Close The App Your Recording Is Being Uploaded</Text>
            </View>
        )
    }



    return (
        <View style={styles.Parent}>
            {/* Note on top of the screen */}
            <View style={styles.marqueeContainer}>
                <Text
                    style={styles.marqueeText}
                    // repeatSpacer={50}
                    // marqueeDelay={1000}
          
                >
                    Note: Please keep this screen on while recording.
                </Text>
            </View>
            <View style={{ width: "100%" }}>

                {


                    location && <AudioPlayer audioFile={location} pause={dataPause} />
                }
            </View>

            <View style={styles.container}>

                <SelectDropdown
                    data={dropdownData}
                    onSelect={(selectedItem, index) => {
                        setTeacherName(teachers[index]);
                        console.log(teachers[index], index);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item;
                    }}
                    // defaultValueByIndex={0}
                    dropdownStyle={styles.dropdownStyle}
                    buttonStyle={styles.buttonStyle}
                    buttonTextStyle={styles.buttonTextStyle}
                    rowStyle={styles.rowStyle}
                    defaultButtonText="Select a teacher"

                />
                {showSelectTeacherMessage && (
                    <Text style={styles.errorMessage}>Please select a teacher.</Text>
                )}
                {/* renderTeacherItem */}
                <TextInput
                style={{
                    margin: 0,
                    marginTop: 1,
                    padding: 5,
                    width: "90%",
                    borderBottomColor: '#5c0931',
                    borderBottomWidth: 2,
                }}
                onChangeText={(text) => {
                    if (isValidEnglishInput(text)) {
                        setFileName(text);
                    }
                }}
                value={fileName}
                placeholder='Enter Filename (English only)'
                keyboardType='default'  // Set keyboardType to default to open the English keyboard
            />

                <Stopwatch start={recording} clear={clear} pause={pause} screenTime={screenTime} />
                <Animated.View style={{
                    transform: [{ scale: scaleValue }],
                }}>
                    <Pressable onPress={recording ? stopRecording : startRecording} style={{ backgroundColor: '#5c0931', width: 200, height: 200, borderRadius: 200, justifyContent: 'center', alignItems: 'center' }}>

                        {recording ?
                            <Entypo name="controller-stop" size={44} color="white" /> :
                            <Text style={{ color: 'white', fontSize: 30 }}>
                                RECORD
                            </Text>}
                    </Pressable>
                </Animated.View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: "space-around", alignItems: "center", width: "95%", height: 70, borderRadius: 20 }}>
                    <Pressable onPress={() => handleUpload()} disabled={location === ""}>
                        <Entypo name="check" size={40} color="#5c0931" />
                    </Pressable>
                    <Pressable onPress={pause ? resumeRecording : pauseRecording}>
                        {pause ?
                            <AntDesign name="play" size={40} color="black" /> :
                            <AntDesign name="pausecircle" size={40} color="black" />

                        }
                    </Pressable>


                    <Pressable onPress={goBack}>
                        <Entypo name="list" size={40} color="black" style={{}} />
                    </Pressable>

                    <Pressable onPress={() => cancelRecording()}>
                        <Entypo name="cross" size={40} color="#5c0931" style={{}} />
                    </Pressable>
                </View>
                {/* <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
                /> */}
            </View>
            {showNotification && (
                <Animated.View
                    style={[
                        styles.notificationContainer,
                        {
                            opacity: fadeInOutAnim,
                        },
                    ]}
                >
                    <AntDesign name="checkcircleo" size={50} color="green" />
                    <Text>Upload Complete!</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20

    },
    Parent: {
        flex: 1,
        backgroundColor: '#ecf0f1',


    },
    errorMessage: {
        color: 'red'
    },
    notificationContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        width: "80%", // Adjust the width as needed
        alignSelf: 'center',
        top: "40%",
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
    },
    autocompleteItem: {
        padding: 10,
        borderBottomColor: '#5c0931',
        borderBottomWidth: 1,
    },
    autocompleteText: {
        fontSize: 16,
    },
    dropdownStyle: {
        backgroundColor: '#5c0931',
    },
    buttonStyle: {
        width: '90%',
        // marginBottom: 2,
        backgroundColor: '#5c0931',
        borderRadius: 8,
    },
    buttonTextStyle: {
        color: 'white',
    },
    rowStyle: {
        padding: 10,
        backgroundColor: '#ecf0f1',
    },
    marqueeContainer: {
        backgroundColor: '#5c0931', // Theme color
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    marqueeText: {
        color: 'white', // Text color
        fontWeight: 'bold',
        fontSize: 12,
    },
});

