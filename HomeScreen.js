import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Tab ICons...
import home from './assets/home.png';
import logout from './assets/logout.png';
// Menu
import menu from './assets/menu.png';
import close from './assets/close.png';
import { useNavigation } from '@react-navigation/native';
// Photo
import logo from './assets/adaptive-icon.png'
import photo from './assets/photo.jpg';
import { ScrollView, Stack } from 'native-base';
import Example from './Example';
import doc from './assets/doc.png'
import quiz from './assets/quiz.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import music from './assets/music.png';
import * as ImagePicker from 'expo-image-picker';


export default function App({ navigation }) {
  const [currentTab, setCurrentTab] = useState("Home");
  const [tabId, setTabId] = useState(0);
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);
  const navigationtodraw = useNavigation();
  const defaultImage = Image.resolveAssetSource(logo).uri

  const [image, setImage] = useState();

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const handleClick = (tabId) => {
    if(tabId===0)
    {
      setTabId(tabId)
      setCurrentTab('Notes');

    }
    if(tabId===1)
    {
      setTabId(tabId)
      setCurrentTab('Recordings');

    }
    // if(tabId===2)
    // {
    //   setTabId(tabId)
    //   setCurrentTab('Quiz');

    // }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (result) {
      setImage(result.assets[0].uri);
      console.log(image)
      try {

        await AsyncStorage.setItem(user, JSON.stringify(result.assets[0].uri)).then(() => console.log('saved'))
      }
      catch (error) {
        console.log(error)
      }
    }
  };





  const [user, setUser] = useState('');
  const [level, setLevel] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function startupGetter() {

      try {
        const id = await AsyncStorage.getItem('userId').then((userid) => setUser(userid))
        const em = await AsyncStorage.getItem('email').then((email) => setEmail(email))
        const lv = await AsyncStorage.getItem('level').then((level) => setLevel(level))
        const imageTemp = await AsyncStorage.getItem(user).then((img) => { setImage(JSON.parse(img)); return img })
          .then((img) => img ? null : setImage(defaultImage))
        return id
      }
      catch {
        console.error('Failed to get user ID in AsyncStorage:', error);

      }
    }
    startupGetter()
  }, [])
  

  async function handleLogout(){
    await AsyncStorage.multiRemove(['session','userEmail'])
    .then(()=>navigation.navigate('Login'))
  }

  const TabButton = (currentTab, setCurrentTab, title) => {
    const navigation = useNavigation();

    return (
      <TouchableOpacity onPress={() => {
        Animated.timing(scaleValue, {
          toValue: showMenu ? 1 : 0.88,
          duration: 300,
          useNativeDriver: true
        })
          .start()

        Animated.timing(offsetValue, {
          // YOur Random Value...
          toValue: showMenu ? 0 : 230,
          duration: 300,
          useNativeDriver: true
        })
          .start()

        Animated.timing(closeButtonOffset, {
          // Your Random Value...
          toValue: !showMenu ? -30 : 0,
          duration: 300,
          useNativeDriver: true
        })
          .start()

        setShowMenu(!showMenu);
        if (title == "LogOut") {
          handleLogout()  
        }
        else {
          setCurrentTab(title)
        }
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: 'center',
          paddingVertical: 8,
          backgroundColor: currentTab == title ? 'white' : 'transparent',
          paddingLeft: 13,
          paddingRight: 35,
          borderRadius: 8,
          marginTop: 15
        }}>



          <Text style={{
            fontSize: 15,
            fontWeight: 'bold',
            paddingLeft: 15,
            color: currentTab == title ? "#5c0931" : "white"
          }}>{title}</Text>

        </View>
      </TouchableOpacity>
    );
  }



  return (

    <View style={styles.container}>

      <View style={{ justifyContent: 'flex-start', padding: 15, marginTop: 20, }}>
        <Pressable style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden',marginTop:50 }} onPress={() => pickImage()}>

          {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
        </Pressable>


        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 10,
          paddingLeft: 10,
          paddingTop: 10
        }}>{user}</Text>
        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 10,
          paddingLeft: 10
        }}>{email}</Text>
        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 10,
          paddingLeft: 10
        }}>{level}</Text>



        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {
            // Tab Bar Buttons....
          }



          {TabButton(currentTab, setCurrentTab, "Home")}
          {TabButton(currentTab, setCurrentTab, "Notes")}
          {TabButton(currentTab, setCurrentTab, "Recordings")}
          {/* {TabButton(currentTab, setCurrentTab, "Quiz")} */}

        </View>

        <View>
          {TabButton(currentTab, setCurrentTab, "LogOut", logout)}
        </View>

      </View>

      {
        // Over lay View...
        // main screen

      }

      <Animated.View style={{
        flexGrow: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: showMenu ? 15 : 0,
        // Transforming View...
        transform: [
          { scale: scaleValue },
          { translateX: offsetValue }
        ]
      }}>

        {
          // Menu Button...
        }

        <Animated.View style={{
          transform: [{
            translateY: closeButtonOffset
          }]
        }}>
          <TouchableOpacity onPress={() => {
            // Do Actions Here....
            // Scaling the view...
            Animated.timing(scaleValue, {
              toValue: showMenu ? 1 : 0.88,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(offsetValue, {
              // YOur Random Value...
              toValue: showMenu ? 0 : 230,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(closeButtonOffset, {
              // Your Random Value...
              toValue: !showMenu ? -30 : 0,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            setShowMenu(!showMenu);
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>


              <Image source={showMenu ? close : menu} style={{
                width: 20,
                height: 20,
                tintColor: 'black',


              }}></Image>
              <Text style={{ color: "#5c0931", fontSize: 20, fontWeight: 600 }}>OTP</Text>
              <View>{ }</View>
            </View>

          </TouchableOpacity>

          {currentTab === "Home" &&
            <View style={styles.box} showsVerticalScrollIndicator={false}>

              <TouchableOpacity onPress={() => handleClick(0)}>
                <View style={{
                  width: '60%',
                  height: 210,
                  borderRadius: 15,
                  marginTop: 25,
                  marginLeft:70,

                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F4F4F4',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,

                }} imageStyle={{ borderRadius: 15 }}
                >
                  <Image source={doc} style={{ width: '30%', height: '50%', }}></Image>
                  <Text style={{ fontSize: 20, color: '#5c0931', marginTop: 10 }}> Notes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClick(1)} >
                <View style={{
                  width: '60%',
                  height: 210,
                  borderRadius: 15,
                  marginTop: 25,
                  marginLeft:70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F4F4F4',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,

                }} imageStyle={{ borderRadius: 15}}
                ><Image source={music} style={{ width: '30%', height: '50%', }}></Image>
                  <Text style={{ fontSize: 20, color: '#5c0931', marginTop: 10 }}>Recordings</Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => handleClick(2)} disabled>
              <View style={{
                  width: '100%',
                  height: 210,
                  borderRadius: 15,
                  marginTop: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F4F4F4',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,

                }} imageStyle={{ borderRadius: 15 }}
                ><Image source={quiz} style={{ width: '30%', height: '50%', }}></Image>
                  <Text style={{ fontSize: 20, color: '#5c0931', marginTop: 10 }}>Quiz</Text>
                </View>
              </TouchableOpacity> */}
              {/* <View style={{height:130}}></View> */}
          
            </View>}
            {currentTab==='Notes'&& <View style={{ height: "100%" }}><Example handleClick={handleClick} tabId={0}/></View>}
            {currentTab==='Recordings'&& <View style={{ height: "100%" }}><Example handleClick={handleClick} tabId={1}/></View>}
            {/* {currentTab==='Quiz'&& <View style={{ height: "100%" }}><Example handleClick={handleClick} tabId={2}/></View>} */}
        </Animated.View>
      </Animated.View>
    </View >
  );
}



// For multiple Buttons...
// this is the function i can use for all the pages

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#5c0931',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height:"100%",
    
  },
  box: {
    display: 'flex',
    marginTop:80
    // flexDirection: "row",
      // marginLeft:70
    // alignItems: 'center',
    // justifyContent:'center'
  }
});
