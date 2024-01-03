import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal } from 'react-native';
import Answerquestions from '../Components/answer-questions';
import { SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import postDataToServer from '../services/api'
import End from './End';
import Timer from '../Components/Timer';
import { AntDesign } from '@expo/vector-icons';
import { background } from 'native-base/lib/typescript/theme/styled-system';

interface Itest {
    questionNumber: number,
    question: string,
    options: Array<string>,
    type: string
}

const test2: Itest[] = [
    {
        questionNumber: 1,
        question: "He _______ to school every day.",
        options: ["go", "goes", "went", "gone"],
        type: "Radio"
    },
    {
        questionNumber: 2,
        question: "Yesterday, they _______ a delicious dinner.",
        options: ["eat", "eats", "ate", "eaten"],
        type: "Radio"
    },
    {
        questionNumber: 3,
        question: "Sarah _______ her keys this morning.",
        options: ["lose", "loses", "lost", "losted"],
        type: "Radio"
    },
    {
        questionNumber: 4,
        question: "We _______ a great time at the party last night.",
        options: ["have", "has", "had", "haved"],
        type: "Radio"
    },
    {
        questionNumber: 5,
        question: "Tom _______ to the store to buy some milk in the morning",
        options: ["go", "goes", "went", "gone"],
        type: "Radio"
    },
    {
        questionNumber: 6,
        question: "She _______ a wonderful song at the concert.",
        options: ["sing", "sings", "sang", "sung"],
        type: "Radio"
    },
    {
        questionNumber: 7,
        question: "I _______ my phone on the bus yesterday.",
        options: ["lose", "loses", "lost", "losted"],
        type: "Radio"
    },
    {
        questionNumber: 8,
        question: "They _______ a new car last week.",
        options: ["buy", "buys", "bought", "buyed"],
        type: "Radio"
    },
    {
        questionNumber: 9,
        question: "The cat _______ up a tree.",
        options: ["climb", "climbs", "climbed", "clomb"],
        type: "Radio"
    },
    {
        questionNumber: 10,
        question: "We _______ late for the meeting yesterday.",
        options: ["arrive", "arrives", "arrived", "arrivied"],
        type: "Radio"
    }

]
//Inter Level Quiz
const test: Itest[] = [

    {
        questionNumber: 1,
        question: "Can you please _______ the TV? It's too loud.",
        options: ["turn on", "turn off", "turn up", "turn down"],
        type: "Radio"
    },
    {
        questionNumber: 2,
        question: "Sarah _______ her coat and left the room.",
        options: ["put on", "take off", "get on", "get off"],
        type: "Radio"
    },
    {
        questionNumber: 3,
        question: "We need to _______ the meeting because the manager is sick.",
        options: ["call off", "call in", "call out", "call up"],
        type: "Radio"
    },
    {
        questionNumber: 4,
        question: "Could you _______ the window? It's getting stuffy in here.",
        options: ["open up", "close off", "shut down", "break in"],
        type: "Radio"
    },
    {
        questionNumber: 5,
        question: "The teacher asked the students to _______ a story about their summer vacation.",
        options: ["make up", "break up", "bring up", "set up"],
        type: "Radio"
    },
    {
        questionNumber: 6,
        question: "I'm sorry, but I can't _______ what you're saying. Could you please repeat it?",
        options: ["make out", "make up", "put off", "put up"],
        type: "Radio"
    },
    {
        questionNumber: 7,
        question: "They _______ a great performance at the concert last night.",
        options: ["put on", "put off", "put up", "put in"],
        type: "Radio"
    },
    {
        questionNumber: 8,
        question: "I'm going to _______ my old clothes and donate them to charity.",
        options: ["give off", "give away", "give in", "give up"],
        type: "Radio"
    },
    {
        questionNumber: 9,
        question: "The manager _______ the new project during the team meeting.",
        options: ["handed out", "handed over", "handed in", "handed off"],
        type: "Radio"
    },
    {
        questionNumber: 10,
        question: "I need to _______ this document before the deadline.",
        options: ["fill in", "fill out", "fill up", "fill off"],
        type: "Radio"
    }
];

export default function QuizMain({ timer, end, navigation, updateCompleted, id, shuffleProp, completed }) {

    const [index, setIndex] = useState<number>(0);
    const [selected, setSelected] = useState({});
    const [submit, setSubmit] = useState(false);
    const [collect, setCollect] = useState(false);
    const [shuffle, setShuffle] = useState(shuffleProp);
    const [score, setScore] = useState(0);
    const [pass, setPass] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);








    function shuffleArray(array: Itest[]): Itest[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
    function display(id: string) {
        if (id === "1") {
            const temp = shuffleArray(test)
            console.log(temp)
            setShuffle([...temp]);
        }
        else if (id === "2") {
            const temp = shuffleArray(test2)
            setShuffle([...temp])
        }

    }

    function next() {
        if (index != shuffle?.length - 1) {

            setIndex(index + 1)
        }

    }

    function previous() {
        if (index != 0) {
            setSubmit(false)

            setIndex(index - 1)
        }

    }


    function submitHandler() {
        if (index === shuffle?.length - 1) {
            setSubmit(true)
        }

    }

    const getSelected = (selected: SetStateAction<{}>) => {
        setSelected(selected);
    }

    const getScore = (score: SetStateAction<number>) => {
        setScore(score)
    }

    function updateServer() {
        if ((score / shuffle.length) * 100 > 40) {
            setPass(true)
        }
        setCollect(true);

        console.log(createFinalObject(shuffle, selected))
        // postDataToServer(createFinalObject(shuffle, selected))
        updateCompleted(id, false)
    }





    function createFinalObject(questionPaper: Array<Itest>, selected: any) {
        let finalObject = shuffle.map((id: object, index_value: number) => {
            return {
                question: questionPaper[index_value].question,
                get answer() {
                    if (typeof (selected[`${index_value}`]) === 'string') {
                        return selected[`${index_value}`];
                    }
                    else if (typeof (selected[`${index_value}`]) === 'number') {
                        return questionPaper[index_value].options[selected[`${index_value}`]]
                    }
                    else if (selected[`${index_value}`]?.constructor === Array) {
                        console.log("hello array")
                        let answerStrings: Array<string> = [];
                        selected[`${index_value}`].map((checks: boolean, index: number) => {
                            if (checks) {
                                answerStrings.push(questionPaper[index_value].options[index])
                            }
                        }
                        )
                        return answerStrings.toString();
                    }
                    else {

                        return "no type found"
                    }
                }

            }
        })
        return finalObject

    }
    function handleModal(){
        setSubmit(true)
        updateServer()
    }



    useEffect(() => {
        submitHandler()
    }, [index])



    return (
        <>
            {collect && completed ? <End navigation={navigation} pass={pass} score={score} total={shuffle.length} /> :
                <View style={{ flex: 1}}>

                <ScrollView contentContainerStyle={{ }}                >
                    <StatusBar style="auto" />
                    <>
                       {!collect?

                           <Modal animationType='slide' transparent={true} visible={end}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 22,
                                backgroundColor:"rgba(0,0,0,0.6)"
                            }}>
                                <View style={{
                                    margin: 20,
                                    backgroundColor: 'white',
                                    borderRadius: 20,
                                    padding: 35,
                                    alignItems: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 5,
                                }}>
                                    <AntDesign name="clockcircleo" size={104} color="#5c0931" />
                                    <Text style={{
                                        fontWeight:"600",
                                        paddingVertical:20,
                                        marginBottom: 15,
                                        textAlign: 'center',
                                    }}>
                                        Your Time Has Ended Click The Below Button To View Results

                                    </Text>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => handleModal()}>
                                        <Text style={styles.textStyle}>Show Results</Text>
                                    </Pressable>

                                </View>

                            </View>

                        </Modal>:null
                                        }
                        <View style={{}}>
                            {!completed?<Pressable style={{padding:30,justifyContent:"center",margin:10, backgroundColor:'#5c0931'}} onPress={()=>navigation.navigate('Home')}>
                                <Text style={{textAlign:"center", color:"white",fontWeight:"600"}}>
                                    Home
                                </Text>

                            </Pressable>:null}
                            {completed ?
                                <Timer time={timer} /> : null
                            }
                        </View>
                        <Text style={{ textAlign: "center", color: 'grey', fontWeight: '400' }}><Text>Question Number : {index + 1}</Text></Text>
                        {completed ?
                            <Text style={{ textAlign: "center", color: 'grey', fontWeight: '400' }}>Current Score {score} out of {shuffle.length}</Text> : null

                        }
                        <Answerquestions
                            collect={collect}
                            index={index}
                            questionNumber={shuffle[index].questionNumber}
                            question={shuffle[index].question}
                            options={shuffle[index].options}
                            type={shuffle[index].type}
                            answer={shuffle[index].answer}
                            getSelected={getSelected}
                            getScore={getScore}
                            completed={completed}
                            end={end}
                        />
                        {
                            submit && completed ?
                                <View style={{ flexDirection: "row", justifyContent: "space-around", paddingTop: 10 }}>


                                    <Pressable style={{ backgroundColor: "green", height: 50, borderRadius: 10, width: "80%", justifyContent: "center", alignItems: 'center' }}
                                        onPress={() => updateServer()}
                                    >
                                        <Text style={{ color: "white" }}>
                                            Submit
                                        </Text>
                                    </Pressable>
                                </View>
                                : null

                        }
                        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingTop: 20 }}>
                            <Pressable
                                style={{ backgroundColor: "#5c0931", height: 50, borderRadius: 10, width: 100, justifyContent: "center", alignItems: 'center' }}



                                onPress={() => previous()}
                            ><Text
                                style={{ color: "white" }}
                            >
                                    Previous
                                </Text>
                            </Pressable>
                            {


                                !submit&&<Pressable
                                style={{ backgroundColor: "#5c0931", height: 50, borderRadius: 10, width: 100, justifyContent: "center", alignItems: 'center' }}
                                
                                onPress={() => next()}
                                ><Text
                                style={{ color: "white" }}
                                >
                                    Next
                                </Text>
                            </Pressable>
                            }
                        </View></>



                        <View style={{height:100}} />

                </ScrollView>
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
        padding:20,
      backgroundColor: '#5c0931',
    },
    buttonClose: {
        padding:20,
      backgroundColor: '#5c0931',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
  });
