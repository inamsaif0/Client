
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Slider } from '@miblanchard/react-native-slider';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import { useNavigation } from '@react-navigation/native';


const AudioPlayer = ({ audioFile, title, getActive, index,active , onDelete ,isPlayAudio,pause}) => {

  const navigation = useNavigation()
  const sliderAnimation = useState(new Animated.Value(0))[0];

  const animateSlider = (value) => {
    Animated.timing(sliderAnimation, {
      toValue: value,
      duration: 300, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  };


  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [date,setDate]=useState();
  const [time,setTime]=useState();
  const [exists,setExists]=useState();
  function Parsedate() {
    if(title){

      const dateArray = title.split('_')
      timestamp = dateArray[1]?.replace(".m4a", "");
      const parsedDate = new Date(timestamp);
      if(!Object.prototype.toString.call(parsedDate) === '[object Date]')
      {
        setExists(true)
      }

      
      
      
      
      console.log(timestamp)
      if (!isNaN(parsedDate)) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        const hours = String(parsedDate.getHours()).padStart(2, "0");
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
        
        const formattedTime=`${hours}:${minutes}`
        
        
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        setDate(formattedDate)
        setTime(formattedTime)
      }
    }
      
    }

  useEffect(() => {

    if(isPlayAudio){
      stopPlayback()
    }
        loadAudio();
    return () => {
      unloadAudio();
      if(isPlayAudio){
        stopPlayback()
      }
    };
  }, [isPlayAudio]);

  useEffect(() => {
    // Update the playback position as audio plays
    const updatePlaybackPosition = (status) => {

      if (status.isLoaded && status.isPlaying) {
        setPlaybackPosition(status.positionMillis);
        //getActive(index, true)
      }

      if (status.isLoaded && status.positionMillis === status.durationMillis) {
        setPlaybackPosition(0);
        setIsPlaying(false);
        //getActive(index, false)
      }
    };

    if (sound) {
      sound.setOnPlaybackStatusUpdate(updatePlaybackPosition);
    }
  }, [sound]);

  const loadAudio = async () => {
    try {
      await Audio.Sound.createAsync({ uri: audioFile }, {}, updatePlaybackStatus)
      .then(({sound})=>setSound(sound))
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const unloadAudio = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);
    }
  };
  const [use,setUse]=useState(false)

  useEffect(()=>{
    if(isPlaying){
      togglePlayback()
    }
  },[active])
  

  
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);


  const togglePlayback = async () => {
    
       

      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          if(getActive)
          {
            getActive(!active)

          }
          // Check if the playback position is at the end
          const isAtEnd = playbackPosition === playbackDuration;

          // Reset the playback position to 0 if at the end
          const position = isAtEnd ? 0 : playbackPosition;
          
          // Update the position before playing
          await sound.setPositionAsync(position);
          
          await sound.playAsync();
          
          // Call getActive with the updated isPlaying value
          
          
          animateSlider(isPlaying ? 0 : 1);
        }

        // Toggle the isPlaying state
        setIsPlaying(!isPlaying);
  

      }
    
  };


  
  const stopPlayback = async () => {
    
    // console.log()
    if (sound) {
      console.log("rrrrrrrrrrrrrrrrrr" )
    
        await sound.pauseAsync();
      

      // Toggle the isPlaying state
      setIsPlaying(false);


    }
  
};

  useEffect(async () => {
    setIsPlaying(false)
    await stopPlayback()

    return  async()  => {
      console.log(sound ,'Compodasdas asd d asd asd das asnent focused');




              setIsPlaying(!isPlaying);

        // unsubscribeFocus();
        // unsubscribeBlur();
    };
}, [navigation]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const forward = () => {
    if (playbackPosition + 5000 < playbackDuration) {

      handleSliderValueChange(playbackPosition + 5000)
    }
  }
  const back = () => {
    if (playbackPosition - 5000 > 0) {

      handleSliderValueChange(playbackPosition - 5000)
    }
  }

  const handleSliderValueChange = async (value) => {
    setPlaybackPosition(value);
    if (sound) {
      try {

        await sound.setPositionAsync(Math.floor(value));
      }
      catch (error) {
        console.log("error seeking audio")
      }
    }
  };

  return (

    <View style={styles.container}>
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  {title && (
    <Text style={[styles.title, { width: '70%' }]} numberOfLines={1} ellipsizeMode="tail">
      {title}
    </Text>
  )}
{onDelete &&
  <TouchableOpacity onPress={() => onDelete(index)}>
    <FontAwesome name="trash" size={26} color="red" />
  </TouchableOpacity>
}
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
              {formatTime(playbackPosition)}
            </Text>
            <Text style={styles.playbackText}>
              {formatTime(playbackDuration)}
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
            (<Pressable onPress={togglePlayback}>
              <AntDesign name="pause" size={34} color="#5c0931" />
            </Pressable>) :
            (<Pressable onPress={togglePlayback}>
              <AntDesign name="play" size={34} color="#5c0931" />
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

export default AudioPlayer;