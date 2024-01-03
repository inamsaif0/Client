import React from 'react'
import {View, StyleSheet, TouchableOpacity, SafeAreaView, Text} from 'react-native'
import {FontAwesome5} from '@expo/vector-icons'

export default function Screen(props) {

        return (
            <View style={styles.container}>
                <SafeAreaView style={{flex:1}}>
                    <TouchableOpacity style={{alignItems:'flex-end', margin:16}} onPress={props.navigation.openDrawer}>
                        <FontAwesome5 name="bars" size={24} color="#161924"/>
                    </TouchableOpacity>
                    <View style={styles.text}>{props.name} Screen</View>
                </SafeAreaView>
            </View>
        )
    
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffff"
    },
    text:{
        color:"#161924",
        fontSize:20,
        fontWeight:'400'
    }

});