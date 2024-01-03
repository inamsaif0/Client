import React from 'react'
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

const Timer = (props:any) => {
    const {time} = props;
    let timeSplit=time.split(':')
    const [hours, setHours ] =  useState(parseInt(timeSplit[0]));
    const [ minutes, setMinutes ] = useState(parseInt(timeSplit[1]));
    const [seconds, setSeconds ] =  useState(parseInt(timeSplit[2]));
    useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
            if (minutes === 0) {
                if (hours === 0) {
                    clearInterval(myInterval)
                } else {
                    setHours(hours - 1);
                    setMinutes(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    return (
        <View>

        { minutes === 0 && seconds === 0
            ? null
            : <Text style={{ color: "black", fontSize: 20, textAlign: "center", paddingTop: 40 }}> {hours}:{minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</Text> 
        }
        </View>
    )
}

export default Timer;