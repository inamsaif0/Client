import React, { useState, useEffect, useRef } from 'react'
import { Pressable, SafeAreaView, Text } from 'react-native'
import QuizMain from './QuizMain'

interface Itest {
    questionNumber: number,
    question: string,
    options: Array<string>,
    type: string,
    answer:string
}
//id=2
const test: Itest[] = [
    {
        questionNumber: 1,
        question: "He _______ to school every day.",
        options: ["go", "goes", "went", "gone"],
        type: "Radio",
        answer: "goes"
    },
    {
        questionNumber: 2,
        question: "Yesterday, they _______ a delicious dinner.",
        options: ["eat", "eats", "ate", "eaten"],
        type: "Radio",
        answer: "ate"
    },
    {
        questionNumber: 3,
        question: "Sarah _______ her keys this morning.",
        options: ["lose", "loses", "lost", "losted"],
        type: "Radio",
        answer: "lost"
    },
    {
        questionNumber: 4,
        question: "We _______ a great time at the party last night.",
        options: ["have", "has", "had", "haved"],
        type: "Radio",
        answer: "had"
    },
    {
        questionNumber: 5,
        question: "Tom _______ to the store to buy some milk in the morning",
        options: ["go", "goes", "went", "gone"],
        type: "Radio",
        answer: "went"
    },
    {
        questionNumber: 6,
        question: "She _______ a wonderful song at the concert.",
        options: ["sing", "sings", "sang", "sung"],
        type: "Radio",
        answer: "sang"
    },
    {
        questionNumber: 7,
        question: "I _______ my phone on the bus yesterday.",
        options: ["lose", "loses", "lost", "losted"],
        type: "Radio",
        answer: "lost"
    },
    {
        questionNumber: 8,
        question: "They _______ a new car last week.",
        options: ["buy", "buys", "bought", "buyed"],
        type: "Radio",
        answer: "bought"
    },
    {
        questionNumber: 9,
        question: "The cat _______ up a tree.",
        options: ["climb", "climbs", "climbed", "clomb"],
        type: "Radio",
        answer: "climbed"
    },
    {
        questionNumber: 10,
        question: "We _______ late for the meeting yesterday.",
        options: ["arrive", "arrives", "arrived", "arrivied"],
        type: "Radio",
        answer: "arrived"
    }
]
//beginner 2 id=3

const test2:Itest[]=[
    {
        questionNumber: 1,
        question: "She _______________ (play) tennis yesterday.",
        options: ["play", "played", "plays", "will play / is going to play"],
        type: "Radio",
        answer: "played"
    },
    {
        questionNumber: 2,
        question: "We _______________ (watch) a movie right now.",
        options: ["watch", "watched", "are watching", "will watch / are going to watch"],
        type: "Radio",
        answer: "are watching"
    },
    {
        questionNumber: 3,
        question: "They _______________ (eat) lunch every day.",
        options: ["eat", "ate", "eats", "will eat / are going to eat"],
        type: "Radio",
        answer: "eat"
    },
    {
        questionNumber: 4,
        question: "He _______________ (clean) his room tomorrow.",
        options: ["clean", "cleaned", "cleans", "will clean / is going to clean"],
        type: "Radio",
        answer: "will clean / is going to clean"
    },
    {
        questionNumber: 5,
        question: "Yesterday, I _______________ (go) to the park.",
        options: ["go", "went", "goes", "will go / am going to go"],
        type: "Radio",
        answer: "went"
    },
    {
        questionNumber: 6,
        question: "We _______________ (study) English at the moment.",
        options: ["study", "studied", "are studying", "will study / are going to study"],
        type: "Radio",
        answer: "are studying"
    },
    {
        questionNumber: 7,
        question: "They _______________ (play) soccer next weekend.",
        options: ["play", "played", "plays", "will play / are going to play"],
        type: "Radio",
        answer: "will play / are going to play"
    },
    {
        questionNumber: 8,
        question: "She _______________ (dance) at the party yesterday.",
        options: ["dance", "danced", "dances", "will dance / is going to dance"],
        type: "Radio",
        answer: "danced"
    },
    {
        questionNumber: 9,
        question: "We usually _______________ (watch) TV in the evening.",
        options: ["watch", "watched", "watches", "will watch"],
        type: "Radio",
        answer: "watch"
    },
    {
        questionNumber: 10,
        question: "He _______________ (travel) to Korea next month.",
        options: ["travel", "traveled", "travels", "will travel / is going to travel"],
        type: "Radio",
        answer: "will travel / is going to travel"
    }
]

//inter level 2 id=4    beg1
const test4:Itest[]=[
    {
        questionNumber: 1,
        question: "Sarah _____ go to bed early tonight.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "should"
    },
    {
        questionNumber: 2,
        question: "If I won the lottery, I _____ travel the world.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "would"
    },
    {
        questionNumber: 3,
        question: "You _____ apologize for your mistake.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "should"
    },
    {
        questionNumber: 4,
        question: "I _____ help you with your homework if you need it.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "could"
    },
    {
        questionNumber: 5,
        question: "We _____ have a picnic if the weather is nice.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "would"
    },
    {
        questionNumber: 6,
        question: "They _____ have arrived by now, but they got stuck in traffic.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "could"
    },
    {
        questionNumber: 7,
        question: "_____ you pass me the salt, please?",
        options: ["Should", "Would", "Could"],
        type: "Radio",
        answer: "Could"
    },
    {
        questionNumber: 8,
        question: "You _____ have told me about the party. I would have loved to come!",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "could"
    },
    {
        questionNumber: 9,
        question: "If I had more time, I _____ learn to play the piano.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "would"
    },
    {
        questionNumber: 10,
        question: "I think you _____ consider taking a vacation. You've been working hard.",
        options: ["should", "would", "could"],
        type: "Radio",
        answer: "should"
    }
]
//id=1
//Inter Level Quiz    //this has to change 

////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
const test3: Itest[] = [

    {
        questionNumber: 1,
        question: "Can you please _______ the TV? It's too loud.",
        options: ["turn on", "turn off", "turn up", "turn down"],
        type: "Radio",
        answer: "turn down"
    },
    {
        questionNumber: 2,
        question: "Sarah _______ her coat and left the room.",
        options: ["put on", "take off", "get on", "get off"],
        type: "Radio",
        answer: "take off"
    },
    {
        questionNumber: 3,
        question: "We need to _______ the meeting because the manager is sick.",
        options: ["call off", "call in", "call out", "call up"],
        type: "Radio",
        answer: "call off"
    },
    {
        questionNumber: 4,
        question: "Could you _______ the window? It's getting stuffy in here.",
        options: ["open up", "close off", "shut down", "break in"],
        type: "Radio",
        answer: "open up"
    },
    {
        questionNumber: 5,
        question: "The teacher asked the students to _______ a story about their summer vacation.",
        options: ["make up", "break up", "bring up", "set up"],
        type: "Radio",
        answer: "make up"
    },
    {
        questionNumber: 6,
        question: "I'm sorry, but I can't _______ what you're saying. Could you please repeat it?",
        options: ["make out", "make up", "put off", "put up"],
        type: "Radio",
        answer: "make out"
    },
    {
        questionNumber: 7,
        question: "They _______ a great performance at the concert last night.",
        options: ["put on", "put off", "put up", "put in"],
        type: "Radio",
        answer: "put on"
    },
    {
        questionNumber: 8,
        question: "I'm going to _______ my old clothes and donate them to charity.",
        options: ["give off", "give away", "give in", "give up"],
        type: "Radio",
        answer: "give away"
    },
    {
        questionNumber: 9,
        question: "The manager _______ the new project during the team meeting.",
        options: ["handed out", "handed over", "handed in", "handed off"],
        type: "Radio",
        answer: "handed out"
    },
    {
        questionNumber: 10,
        question: "I need to _______ this document before the deadline.",
        options: ["fill in", "fill out", "fill up", "fill off"],
        type: "Radio",
        answer: "fill out"
    }

];

//Adjective/Adverbs 1

const test5:Itest[]=[
    {
        questionNumber: 1,
        question: "I saw a _______________ movie last night.",
        options: ["boring", "bored", "boredly", "boredness"],
        type: "Radio",
        answer: "boring"
    },
    {
        questionNumber: 2,
        question: "Sarah speaks English _______________.",
        options: ["good", "well", "better", "best"],
        type: "Radio",
        answer: "well"
    },
    {
        questionNumber: 3,
        question: "Could you please speak _______________? I can't hear you.",
        options: ["more loudly", "loud", "louderly", "loudness"],
        type: "Radio",
        answer: "more loudly"
    },
    {
        questionNumber: 4,
        question: "My friend plays the guitar _______________.",
        options: ["good", "well", "better", "best"],
        type: "Radio",
        answer: "well"
    },
    {
        questionNumber: 5,
        question: "We should _______________ prepare for the exam.",
        options: ["good", "well", "better", "best"],
        type: "Radio",
        answer: "well"
    },
    {
        questionNumber: 6,
        question: "I had a _______________ day at work today.",
        options: ["tiring", "tired", "tiringly", "tiredness"],
        type: "Radio",
        answer: "tiring"
    },
    {
        questionNumber: 7,
        question: "They arrived _______________ than expected.",
        options: ["late", "lately", "lateness", "later"],
        type: "Radio",
        answer: "later"
    },
    {
        questionNumber: 8,
        question: "The pizza tastes _______________.",
        options: ["deliciously", "delicious", "deliciousness", "deliciously"],
        type: "Radio",
        answer: "delicious"
    },
    {
        questionNumber: 9,
        question: "She speaks French _______________ than her sister.",
        options: ["fluent", "fluently", "fluentness", "fluenter"],
        type: "Radio",
        answer: "fluently"
    },
    {
        questionNumber: 10,
        question: "He answered the question _______________.",
        options: ["correct", "correctly", "correctness", "correcter"],
        type: "Radio",
        answer: "correctly"
    }
]

const test6:Itest[]=[
    {
        questionNumber: 1,
        question: "I always start my day with a _______________ cup of coffee.",
        options: ["strong", "strongly", "stronger", "strongness"],
        type: "Radio",
        answer: "strong"
    },
    {
        questionNumber: 2,
        question: "She sings _______________ in the shower.",
        options: ["beautifully", "beautiful", "beautify", "beautifulness"],
        type: "Radio",
        answer: "beautifully"
    },
    {
        questionNumber: 3,
        question: "He drives _______________ than his brother.",
        options: ["faster", "fastly", "fastest", "fastness"],
        type: "Radio",
        answer: "faster"
    },
    {
        questionNumber: 4,
        question: "The weather today is _______________.",
        options: ["wonderful", "wonderfully", "wonder", "wonderfulness"],
        type: "Radio",
        answer: "wonderful"
    },
    {
        questionNumber: 5,
        question: "Please speak _______________ so that everyone can understand you.",
        options: ["clearly", "clear", "clearer", "clearness"],
        type: "Radio",
        answer: "clearly"
    },
    {
        questionNumber: 6,
        question: "The movie was _______________ exciting!",
        options: ["incredibly", "incredible", "increasable", "incredibleness"],
        type: "Radio",
        answer: "incredibly"
    },
    {
        questionNumber: 7,
        question: "They walked _______________ towards the beach.",
        options: ["slowly", "slow", "slower", "slowness"],
        type: "Radio",
        answer: "slowly"
    },
    {
        questionNumber: 8,
        question: "The new restaurant serves _______________ food.",
        options: ["delicious", "deliciously", "deliciousness", "deliciously"],
        type: "Radio",
        answer: "delicious"
    },
    {
        questionNumber: 9,
        question: "He arrived _______________ than I expected.",
        options: ["earlier", "early", "earlierly", "earliness"],
        type: "Radio",
        answer: "earlier"
    },
    {
        questionNumber: 10,
        question: "She did her homework _______________.",
        options: ["carefully", "careful", "care", "carefulness"],
        type: "Radio",
        answer: "carefully"
    }
]




export default function Start({ navigation, route }) {
    const { updateCompleted, id ,completed} = route.params;

    const testTime = '0:01:00';
    function StringToTime(time: string): number {
        let timeSplit = time.split(':')
        let h = parseInt(timeSplit[0])
        let m = parseInt(timeSplit[1])
        let s = parseInt(timeSplit[2])
        return ((h * 3600) + (m * 60) + s) * 1000

    }

    const [startQuiz, setStartQuiz] = useState<boolean>(false);
    const [endQuiz, setEndQuiz] = useState<boolean>(false)
    const [shuffle,setShuffle]=useState([])

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
        else if (id === "3") {
            const temp = shuffleArray(test3)
            setShuffle([...temp])
        }
        else if (id === "4") {
            const temp = shuffleArray(test4)
            setShuffle([...temp])
        }
        else if (id === "5") {
            const temp = shuffleArray(test5)
            setShuffle([...temp])
        }
        else if (id === "6") {
            const temp = shuffleArray(test6)
            setShuffle([...temp])
        }

    }




    useEffect(() => {
        if (startQuiz) {
            const timer = setTimeout(() => {
                display(id)
                setStartQuiz(false)
                setEndQuiz(true);
                updateCompleted(id, false)
            }, StringToTime(testTime));
            console.log(timer + 'left')

            return () => clearTimeout(timer);

        }
    }, [startQuiz]);

    function handleStart(){
        display(id)
        setStartQuiz(true);
    }


    return (
        <>
            {endQuiz ? (<QuizMain navigation={navigation} end={endQuiz} timer={testTime} updateCompleted={updateCompleted} id={id} shuffleProp={shuffle} completed={completed}/>) : (startQuiz ? (<QuizMain navigation={navigation} end={false} timer={testTime} updateCompleted={updateCompleted} id={id} shuffleProp={shuffle} completed={completed} />) :
                (<SafeAreaView
                    style={{
                        alignItems: 'center', flexDirection: 'column'
                    }}
                >

                    <Text style={{ color: "black", fontSize: 60, textAlign: "center", paddingVertical: 50 }}>
                        Start Quiz?
                    </Text>
                    <Text style={{ textAlign: "center", color: "grey", paddingVertical: 50 }}>
                        Once You Press The Start Button The Timer Will Start
                    </Text>
                    <Pressable
                        style={{ backgroundColor: "#5c0931", height: 50, borderRadius: 10, width: 100, justifyContent: "center", alignItems: 'center' }}
                        onPress={() => handleStart()}
                    >
                        <Text
                            style={{ color: "white" }}
                        >
                            Start Quiz
                        </Text>
                    </Pressable>
                </SafeAreaView>))
            }
        </>
    )
}
