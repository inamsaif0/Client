import Start from "./Screens/Start";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./Screens/Home";




const Stack = createNativeStackNavigator();


export default function Quiz() {

  return (
    <>
      <NavigationContainer independent={true} >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Start" component={Start} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  )

}


