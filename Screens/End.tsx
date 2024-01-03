import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, Pressable } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';

import ConfettiCannon from 'react-native-confetti-cannon';
import { View } from 'react-native'


export default function End({ navigation, pass, score, total }) {

    const [shoot, setShoot] = useState(false);

    useEffect(() => {
        //Time out to fire the cannon
        setTimeout(() => {
            setShoot(true);
        }, 10);
    }, []);
    return (
        <>
            <SafeAreaView
                style={{
                    alignItems: 'center', flexDirection: 'column', height: "100%", backgroundColor: "#F6C256"
                }}
            >
                {pass ? (<View style={{justifyContent:"center",alignItems:"center",backgroundColor:"white",padding:30,margin:20,borderRadius:10}}>
                    {shoot ? (
                        <ConfettiCannon count={200} origin={{ x: -10, y: -10 }} />
                    ) : null}
                    <View style={{ backgroundColor: "#5c0931", width: 244, height: 244, borderRadius: 244 / 2, justifyContent: "center",alignItems:"center" }}>
                        <FontAwesome5 name="trophy" size={120} color="#F6C256" style={{ paddingTop: 30 }} />
                    </View>
                        <Text style={{ color: "black", fontSize: 30, textAlign: "center", paddingVertical: 20 }}>
                            Conratulations You Passed
                        </Text>
                        <Text style={{color:"grey"}}>
                            Score {score} Out Of {total}
                        </Text>
                </View>
                ) :
                    (<View style={{justifyContent:"center",alignItems:"center",backgroundColor:"white",padding:30,margin:20,borderRadius:10}}>
                    
                    <View style={{ backgroundColor: "#5c0931", width: 244, height: 244, borderRadius: 244 / 2, justifyContent: "center",alignItems:"center" }}>


                        <FontAwesome5 name="sad-tear" size={120} color="#F6C256" style={{ }} />



                    </View>
                        <Text style={{ color: "black", fontSize: 30, textAlign: "center", paddingVertical: 20 }}>
                            Please Try Again
                        </Text>
                        <Text style={{color:"grey"}}>
                            Score {score} Out Of {total}
                        </Text>
                </View>)
                }
                <Pressable
                    style={{ backgroundColor: "#5c0931", height: 50, borderRadius: 10, width: 300, justifyContent: "center", alignItems: 'center' }}
                    onPress={() => { navigation.navigate('Home') }}

                >
                    <Text
                        style={{ color: "white",fontWeight:"800" }}
                    >
                        Go Back Home
                    </Text>
                </Pressable>
            </SafeAreaView>
        </>
    )
}
