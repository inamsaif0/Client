import React, { FC, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput, Switch } from 'react-native';

export type questionProps = {
    collect: boolean
    index: number
    questionNumber: number;
    question: string;
    options: Array<string>;
    type: string;
    getSelected: (selected: any) => void;
    getScore: (score: any) => void;
    answer:string
    completed:boolean
    end:boolean
};




const Answerquestions: FC<questionProps> = (props): JSX.Element => {
    const tempArray:Array<boolean>=Array(props.options.length).fill(false)



    const [selected, setSelected] = useState({});
    const [score, setScore] = useState(0);

    const [isEnabled, setIsEnabled] = useState<boolean[]>([...tempArray]);
    const toggleSwitch = (i:number) => {
        const updateCheck:Array<boolean>=[...isEnabled]
        updateCheck[i]=!updateCheck[i]
        //console.log(i);
        //console.log(isEnabled)
        setIsEnabled(updateCheck);
        setSelected({...selected,[props.index]:[...isEnabled]})
    }

    const firstUpdate = useRef(true);


    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        else {
            props.getSelected(selected)
            props.getScore(score)


        }

    }, [props.index, props.collect,props.end])

    const handleNext = async (selectedAns: any) => {
        setSelected({ ...selected, [props.index]: selectedAns });
        if(props.options[selectedAns]===props.answer)
        {
            console.log("Correct answer")
            setScore(score+1)
        }

    }




    return (
        <SafeAreaView style={styles.container}>
            <Text
                style={{
                    color: "#5c0931",
                    fontSize: 20,
                    paddingBottom: 30,


                }}
            >
                {props.question}
            </Text>
            {props.type === 'Radio' ?
                props.options.map((option, i) => {
                    return (
                        !props.completed ? (
                            <Pressable
                              key={i}
                              style={
                                props.answer === option
                                  ? {
                                      flexDirection: "row",
                                      alignItems: "center",
                                      borderWidth: 1,
                                      marginVertical: 10,
                                      borderRadius: 30,
                                      backgroundColor: "green",
                                    }
                                  : {
                                      flexDirection: "row",
                                      alignItems: "center",
                                      borderWidth: 1,
                                      marginVertical: 10,
                                      borderRadius: 30,
                                    }
                              }
                            >
                            <Text
                                style={{

                                    textAlign: "center",
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width: 30,
                                    height: 30,
                                    padding: 8,
                                    borderRadius: 15,
                                    margin: 9,
                                    backgroundColor: '#5c0931',
                                    color: 'white',
                                    overflow: "hidden"

                                }}
                            >
                                {String.fromCharCode((i % 26) + 65)}
                            </Text>
                            <Text style={(props.answer===option) ? { marginLeft: 10, color: "white" } : { marginLeft: 10, color: "black" }}>
                                {option}
                            </Text>
                            </Pressable>
                          ) :
                        <Pressable
                            onPress={() => handleNext(i)}
                            key={i}
                            
                            style={(selected[props.index] != null && selected[props.index] === i) ? {

                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 1,
                                marginVertical: 10,
                                borderRadius: 30,
                                backgroundColor: "#5c0931",


                            } : {
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 1,
                                marginVertical: 10,
                                borderRadius: 30,
                            }
                        }
                        >
                            <Text
                                style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    textAlign: "center",
                                    width: 35,
                                    height: 35,
                                    padding: 7,
                                    borderRadius: 19,
                                    margin: 10,
                                    
                                    backgroundColor: '#5c0931',
                                    color: 'white',
                                    overflow: "hidden"

                                }}
                            >
                                {String.fromCharCode((i % 26) + 65)}
                            </Text>
                            <Text style={(selected[props.index] != null && selected[props.index] === i) ? { marginLeft: 10, color: "white" } : { marginLeft: 10, color: "black" }}>
                                {option}
                            </Text>
                        </Pressable>
                    );

                }) : null
            }
            {
                props.type === "openEnded" ? <View
                    style={{
                        backgroundColor: "white",
                        borderBottomColor: '#000000',
                        borderBottomWidth: 1,
                    }}>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={4}

                        onChangeText={text => handleNext(text)}
                        style={{ padding: 10 }}
                    />
                </View>

                    : null
            }

            {
                props.type === "checkBox" ?
                props.options.map((options,i)=>
                {
                    return(

                        
                        
                        <View key={i} style={{ flex: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between',flexDirection:'row',margin:10}}>
                        <Text style={{fontSize:20,fontWeight:'500'}}>{'sds'}</Text>
                        <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>toggleSwitch(i)}
                        value={isEnabled[i]}
                        />
                          </View>
                        
                        )
                    }
                    )
                    
                       :
                    null
            }
        </SafeAreaView>

    )
}




const styles = StyleSheet.create({
    container: {
        margin: 20,



    },
})

export default Answerquestions;
