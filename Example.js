import {
  Button,
  Title,
  Paragraph,
} from 'react-native-paper';
import {
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
} from 'react-native-paper-tabs';
import { View } from 'native-base';
import Listpdf from './Listpdf'
import pdf from './assets/pdf.png'
import Quiz from './Quiz';
import Record from './Screens/Record';
import ListRecordings from './Screens/listRercordings';
import React from 'react';

function Example({tabId,handleClick}) {

    return (
      <>
      <Tabs
      style={{backgroundColor:'white', marginTop:15, borderRadius:10}} 
      theme={{ colors: { primary: '#5c0931' } }}
      uppercase={false}
      defaultIndex={tabId}
      disableSwipe={false} 
      >
        <TabScreen onPress={()=>handleClick(0)} label="Notes" icon="file-document">
          <View style={{flex:0.95}}>
           <Documents />
          </View>
        </TabScreen>
        <TabScreen onPress={()=>handleClick(1)} label="Recordings" icon="record-rec">
          <View style={{flex:0.9}}>
          <ListRecordings />
          <View style={{height:50}}></View>
          </View>
        </TabScreen>
      </Tabs>
        </>
    
    )
}

function Documents() {
  const goTo = useTabNavigation();
  const index = useTabIndex();
  return (
    <View style={{ flex:1 }}>
      <Listpdf image={pdf}/>
    </View>
  );
}


export default Example;