import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import music from './assets/music.png'
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Timer from '../Components/Timer';


import {
  Button,
  Title,
  Paragraph,
} from 'react-native-paper';

function Item({ item, recording, recordings , index}) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  
  const togglePlay = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      await recordings[index].sound.replayAsync();
    } else {
      setIsPlaying(false);
      await recordings[index].sound.stopAsync();
    }
  };

    
  return (
    <View key={recordings.duration} style={styles.listItem}>
      <Image source={music} style={{ width: 60, height: 60, borderRadius: 30 }} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>Recording {index + 1} - {recordings[index].duration}</Text>
        <Text>Audio</Text>
      </View>
      <TouchableOpacity style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }} onPress={togglePlay}>

        <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#5c0931" />
    
        
      </TouchableOpacity>
    </View>
  );

}
// function GetRecordingLines({item}) {
//   return recordings.map((recordingLine, index) => {
//     return (
//       <View key={index} style={styles.listItem}>
//       <Image source={music} style={{ width: 60, height: 60, borderRadius: 30 }} />
//       <View style={{ alignItems: "center", flex: 1 }}>
//         <Text style={{ fontWeight: "bold" }}>Recording {index + 1} - {item.duration}</Text>
//         <Text>Audio</Text>
//       </View>
//       <TouchableOpacity style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }}>
//         <Text><Button icon="play" theme={{ colors: { primary: '#5c0931' } }}  onPress={() => item.sound.replayAsync()} title="Play">
//         </Button>
//         </Text>
//       </TouchableOpacity>
//     </View>
//     );
//   });
// }

export default class Listaudio extends React.Component {
  state = {
    // data:[
    //     {
    //         "name": "Miyah Myles",
    //         "email": "miyah.myles@gmail.com",
    //         "position": "Data Entry Clerk",
    //         "photo": "https:\/\/images.unsplash.com\/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6"
    //     },
    //     {
    //         "name": "June Cha",
    //         "email": "june.cha@gmail.com",
    //         "position": "Sales Manager",
    //         "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/44.jpg"
    //     },
    //     {
    //         "name": "Iida Niskanen",
    //         "email": "iida.niskanen@gmail.com",
    //         "position": "Sales Manager",
    //         "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/68.jpg"
    //     },
    //     {
    //         "name": "Renee Sims",
    //         "email": "renee.sims@gmail.com",
    //         "position": "Medical Assistant",
    //         "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/65.jpg"
    //     },
    //     {
    //         "name": "Jonathan Nu\u00f1ez",
    //         "email": "jonathan.nu\u00f1ez@gmail.com",
    //         "position": "Clerical",
    //         "photo": "https:\/\/randomuser.me\/api\/portraits\/men\/43.jpg"
    //     },
    //     {
    //         "name": "Sasha Ho",
    //         "email": "sasha.ho@gmail.com",
    //         "position": "Administrative Assistant",
    //         "photo": "https:\/\/images.pexels.com\/photos\/415829\/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb"
    //     },
    //     {
    //         "name": "Abdullah Hadley",
    //         "email": "abdullah.hadley@gmail.com",
    //         "position": "Marketing",
    //         "photo": "https:\/\/images.unsplash.com\/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=a72ca28288878f8404a795f39642a46f"
    //     },
    //     {
    //         "name": "Thomas Stock",
    //         "email": "thomas.stock@gmail.com",
    //         "position": "Product Designer",
    //         "photo": "https:\/\/tinyfac.es\/data\/avatars\/B0298C36-9751-48EF-BE15-80FB9CD11143-500w.jpeg"
    //     },
    //     {
    //         "name": "Veeti Seppanen",
    //         "email": "veeti.seppanen@gmail.com",
    //         "position": "Product Designer",
    //         "photo": "https:\/\/randomuser.me\/api\/portraits\/men\/97.jpg"
    //     },
    //     {
    //         "name": "Bonnie Riley",
    //         "email": "bonnie.riley@gmail.com",
    //         "position": "Marketing",
    //         "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/26.jpg"
    //     }
    // ],
    recording: undefined,
    recordings: [],
    message: "",
    icon: "pause",
  }
  startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        this.setState({ recording });
      } else {
        this.setState({ message: "Please grant permission to app to access microphone" });
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }


  // stopRecording = async () => {
  //   const { recording, recordings } = this.state;
  //   this.setState({ recording: undefined });

  //   await recording.stopAndUnloadAsync();

  //   let updatedRecordings = [...recordings];
  //   const { sound, status } = await recording.createNewLoadedSoundAsync();
  //   updatedRecordings.push({
  //     sound: sound,
  //     duration: this.getDurationFormatted(status.durationMillis),
  //     file: recording.getURI()
  //   });
  //   console.log(updatedRecordings);

  //   this.setState({ recordings: updatedRecordings });
  // }



  getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        this.setState({ recording });
      } else {
        this.setState({ message: "Please grant permission to app to access microphone" });
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  stopRecording = async () => {
    const { recording, recordings } = this.state;
    this.setState({ recording: undefined });
  
    await recording.stopAndUnloadAsync();
  
    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: this.getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });
    console.log(updatedRecordings);
  
    this.setState({ recordings: updatedRecordings });
  
    // Convert the file to binary data
    const fileUri = recording.getURI();
    const fileResponse = await fetch(fileUri);
    const fileBlob = await fileResponse.blob();
    const userId = await AsyncStorage.getItem('userId');
    // Create form data object and append the file
    const formData = new FormData();
    formData.append('audioFile', fileBlob, 'recording.wav');
  
    // Send the binary data to the backend using Axios
    try {
      const response = await axios.post(`http://3.35.175.207:3001/uploadaudio/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      // Handle the response from the backend
      console.log(response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    }
  };

  getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  getRecordingLines() {
    const { recordings } = this.state;

    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.listItem}>
          <Image source={music} style={{ width: 60, height: 60, borderRadius: 30 }} />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>Recording {index + 1} - {recordingLine.duration}</Text>
            <Text>Audio</Text>
          </View>
          <TouchableOpacity style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }} onPress={ () => {this.state.icon == 'play' ? setState({icon:'pause'}) : this.setState({icon:'play'})}}>
            <Text><Button theme={{ colors: { primary: '#5c0931' } }} onPress={() => recordingLine.sound.replayAsync()} title="Play">
            </Button>
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  }
  uploadFile = async (binaryData) => {
    try {
      const response = await axios.post('YOUR_BACKEND_API_URL', binaryData, {
        headers: { 'Content-Type': 'application/octet-stream' }
      });
      
      // Handle the response from the backend
      console.log(response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    }
  }

  render() {
    const { message, recording } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <Button style={{ backgroundColor: '#5c0931', color: '#ffff' }} theme={{ colors: { primary: '#fff' } }}

            onPress={recording ? this.stopRecording : this.startRecording}
          >{recording ? 'Stop Recording' : 'Start Recording'}</Button>

        </TouchableOpacity>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.recordings}
          renderItem={({ item, index }) => (
            <Item item={item} recording={this.state.recording} recordings={this.state.recordings} index={index} />
          )}
          keyExtractor={item => item._key}
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    backgroundColor: '#F7F7F7',
    marginTop: 20,
    borderRadius: 10,

  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "95%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  }
});