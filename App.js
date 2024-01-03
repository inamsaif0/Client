
import {createContext,useState} from 'react'
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import Login from './Login';
import HomeScreen from './HomeScreen'
import { NativeBaseProvider } from 'native-base';
import Example from './Example';
import Music from './Music';
import Record from './Screens/Record';
import ListRecordings from './Screens/listRercordings';
const Stack = createStackNavigator();
export const UserContext = createContext();

export default function App() {
  const [userEmail, setUserEmail] = useState('')

  return (
    <UserContext.Provider value={{userEmail,setUserEmail}}>

    <NativeBaseProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} ></Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen} ></Stack.Screen>
        <Stack.Screen name="Example" component={Example} ></Stack.Screen>
        <Stack.Screen name="MusicData" component={Music} ></Stack.Screen>
        <Stack.Screen name="recordings" component={Record} options={{headerShown: true,headerTitle:""}}></Stack.Screen>
        <Stack.Screen name="listRecordings" component={ListRecordings} ></Stack.Screen>
        {/* <Stack.Screen name="Recordings" component={Recordings}></Stack.Screen> */}

        
        {/* <Stack.Screen name='List' component={Listpdf}></Stack.Screen> */}

      </Stack.Navigator>
    </NavigationContainer>
    </NativeBaseProvider>
    </UserContext.Provider>
  )
};