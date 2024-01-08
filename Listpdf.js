import React, { useState } from 'react';
import { Modal,RefreshControl, StyleSheet, Text, View, FlatList, Image, Pressable, Linking, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import pdf from './assets/pdf.png';
import { UserContext } from './App';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'native-base';
import docWord from './assets/docWord.png'
import DateTimePicker from '@react-native-community/datetimepicker';
export default function Listpdf() {
  const email = React.useContext(UserContext);

  const [docs, setDocs] = useState(null);
  const [selectedItemUrl, setSelectedItemUrl] = useState(null);
  const [notPdf, setNonPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [arrow, setArrow] = useState(true)
  const [datePicked, setDatePicked] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false)


  function setDate() {
    setShow(false);
    setFilter(!filter)
  }



  const toggleSort = () => {
    setDocs([...docs].reverse());
    setArrow(prevState => !prevState);
  };

  const onChange = (event, selectedDate) => {

    if(Platform.OS==='android')
    {
      setFilter(true)
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
    }
    setFilter(true)
    const currentDate = selectedDate;
    setDatePicked(currentDate);

  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  React.useEffect(() => {
    console.log(datePicked)
    if(filter){

      try {
        handleFilter(datePicked)
      }
      catch (error) {
      console.log(error)
      
    }
  }
  }, [filter,datePicked])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getDocs(email.userEmail)
      setRefreshing(false);

  }, []);




  async function handleFilter(specifiedDate) {
    try {
      const response = await fetch(`http://3.35.175.207:3001/documents?email=${email.userEmail}`, {
        method: 'GET'
      });
      const data = await response.json();
    if (specifiedDate) {
      const specifiedDateMinusOneDay = new Date(specifiedDate);
      specifiedDateMinusOneDay.setDate(specifiedDateMinusOneDay.getDate());

      const specifiedDateString = specifiedDateMinusOneDay.toISOString().split('T')[0];

      console.log(specifiedDateString + "date here")

      const filteredDates = data.filter((doc) => {
        console.log(doc.date)
        return doc.date.split('T')[0] === specifiedDateString;
      });
      setDocs([...filteredDates])

    }
  }
    catch(error){
        console.log(error)
    }
  }

  async function getDocs(email) {
    try {
      const response = await fetch(`http://52.78.100.137:3001/documents?email=${email}`, { method: 'GET' })
        .then((response) => response.json())
        .then((data) => setDocs(data))
        .then(() => setIsLoading(false))
        .catch((error) => console.error('Error retrieving doc files:', error));
    } catch (error) {
      console.log("Error getting documents", error);
    }
  }


  React.useEffect(() => {
    getDocs(email.userEmail);
  }, []);

  const openModal = (itemUrl) => {
    setSelectedItemUrl(itemUrl);
    setModalVisible(true);

  };

  const closeModal = () => {
    setSelectedItemUrl(null);
    setModalVisible(false);
    console.log('closing modal')
  };

  function renderListItem({ item }) {
    const isPdf = item.filename.split('.').pop().toLowerCase() === 'pdf';
    const lastSection = item.filename.replace(/\.[^/.]+$/, "");





    return (
      <View>
        <Pressable onPress={() => {
          openModal("http://docs.google.com/gview?embedded=true&url=" + item.fileUrl);
        }}
     
        style={styles.listItem}>
          <Image source={isPdf?pdf:docWord} style={{ width: 60, height: 60, borderRadius: 30 }} />
          <View style={{ alignItems: "flex-start", marginLeft: 10, justifyContent: 'space-evenly', flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{lastSection}</Text>
            <Text style={{ fontWeight: "bold" }}>Teacher: {item.teacher}</Text>
            <Text style={{ fontWeight: "bold" }}>{`${new Date(item.date).getDate()}-${new Date(item.date).getMonth() + 1}-${new Date(item.date).getFullYear()}`}</Text>
            <Text>{item.position}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color={'#5c0931'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>

        <Pressable onPress={() => toggleSort()} style={{ margin: 10, backgroundColor: '#5c0931', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, padding: 10, width: 150 }}>
          <Text style={{ color: 'white', fontWeight: 600, }}>
            Sort By Date
          </Text>
          {
            arrow ? (<AntDesign name="up" size={24} color="white" />) : (<AntDesign name="down" size={24} color="white" />)

          }
        </Pressable>
        <Pressable onPress={() => setShow(true)} style={{ margin: 10, backgroundColor: '#5c0931', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, padding: 10, width: 150 }}>
          <Text style={{ color: 'white', textAlign: "center", fontWeight: 600 }}>
            Filter By Date
          </Text>
          <AntDesign name="filter" size={24} color="white" />


        </Pressable>
      </View>
      <FlatList
        data={docs}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        renderItem={renderListItem}
        keyExtractor={(item) => item._id}
      />
      {show && (
        <View>
          {Platform.OS==='ios'&&<Pressable onPress={() => setDate()} style={{padding:10}}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>}
          <DateTimePicker
            
            testID="dateTimePicker"
            value={datePicked}
            mode={'date'}
            onChange={onChange}
            display='inline'
            style={{paddingTop:40}}

          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closeModal()}
      >
        <Pressable style={{ padding: 20, marginTop: 40, zIndex: 2, alignItems: "flex-end" }} onPress={() => closeModal()}>
          <AntDesign name="closecircle" size={24} color="black" />
        </Pressable>
        {modalVisible && (
          <WebView
            javaScriptEnabled={true}
            source={{ uri: selectedItemUrl }}
            style={{ flex: 1 }}
            startInLoadingState={true} // Add this prop to enable the loading state
            onError={(error) => console.log(error)}
            renderLoading={() => <ActivityIndicator style={{ flex: 1, zIndex: 3 }} size="large" color="#5c0931" />}
          />
        )}
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 0.88,
    backgroundColor: '#F7F7F7',
    // marginTop: 20,
    borderRadius: 10,

  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "95%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  }
});
