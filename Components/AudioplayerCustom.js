
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Slider } from '@miblanchard/react-native-slider';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import { useNavigation } from '@react-navigation/native';


const AudioPlayerCustom = ({ title, audioFile, index, active, getActive,tabChange }) => {
  const [sound, setSound] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);


  //useEffect
  useEffect(() => {
    loadAudio()
  }, []);


  useEffect(() => {

    if (isPlaying) {
      togglePlayback()
    }
  }, [active])

  
  useEffect(() => {
    console.log("chal gaya use effecrt")
    loadAudio()
      stopAudio()
  }, [tabChange])


  useEffect(() => {
    // Update the playback position as audio plays
    const updatePlaybackPosition = (status) => {

      if (status.isLoaded && status.isPlaying) {
        setPlaybackPosition(status.positionMillis);
      }

      if (status.isLoaded && status.positionMillis === status.durationMillis) {
        setPlaybackPosition(0);
        setIsPlaying(false);
      }
    };

    if (sound) {
      sound.setOnPlaybackStatusUpdate(updatePlaybackPosition);
    }
  }, [sound]);


  const navigation = useNavigation()
  const sliderAnimation = useState(new Animated.Value(0))[0];
  const [isPlaying, setIsPlaying] = useState(false);

  //functions

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);
    }
  };

  const loadAudio = async () => {
    try {
      await Audio.Sound.createAsync({ uri: audioFile }, {}, updatePlaybackStatus)
        .then(({ sound }) => {
          setSound(sound)
        })
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };



  const stopAudio = async () => {
    console.log(sound ,"chal gaya use function styop audio")

    if (sound) {
      console.log("sound mill gaya")

      await sound.pauseAsync();
      setIsPlaying(false)
    }
  }

  const togglePlayback = async () => {
    if (sound) {

      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false)
      }

      if (!isPlaying) {
        if (getActive) { getActive(!active) }
        // Check if the playback position is at the end
        const isAtEnd = playbackPosition === playbackDuration;
        // Reset the playback position to 0 if at the end
        const position = isAtEnd ? 0 : playbackPosition;
        await sound.setPositionAsync(position);
        await sound.playAsync();
        setIsPlaying(true)
      }

    }

  };



  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  
  return (

    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {title && (
          <Text style={[styles.title, { width: '70%' }]} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        )}
        {/* {onDelete &&
          <TouchableOpacity onPress={() => onDelete(index)}>
            <FontAwesome name="trash" size={26} color="red" />
          </TouchableOpacity>
        } */}
      </View>


      {isPlaying && (
        <View style={styles.playbackContainer}>
          <Animated.View
            style={[
              styles.playbackContainer,
              {
                opacity: sliderAnimation,
                transform: [{
                  translateY: sliderAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                }],
              },
            ]}
          >


            <Slider
              value={playbackPosition}
              onValueChange={value =>
                handleSliderValueChange(value)
              }
              maximumValue={playbackDuration}
              maximumTrackTintColor='gray'
              thumbTintColor='#5c0931'
            />
          </Animated.View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.playbackText}>
              {playbackPosition}
            </Text>
            <Text style={styles.playbackText}>
              {playbackDuration}
            </Text>


          </View>

        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: "center" }}>
        <Pressable onPress={() => back()}>

          <MaterialIcons name="replay-5" size={24} color="black" />

        </Pressable>
        {
          isPlaying ?
            (<Pressable onPress={() => togglePlayback()}>
              <AntDesign name="pause" size={34} color="#5c0931" />
            </Pressable>) :
            (<Pressable >
              <AntDesign name="play" onPress={() => togglePlayback()} size={34} color="#5c0931" />
            </Pressable>)
        }
        <Pressable onPress={() => forward()}>

          <MaterialIcons name="forward-5" size={24} color="black" />
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    borderRadius: 20,
    padding: 15,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10
  },
  playbackContainer: {
    marginTop: 10,

  },
  playbackText: {
    fontSize: 12,
    color: 'black'
  },
});

export default AudioPlayerCustom;