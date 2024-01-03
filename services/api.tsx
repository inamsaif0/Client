const apiUrl='http://52.78.100.137:3001/api';


export default async function postDataToServer(data:object){
    try {
        console.log(data)
    await fetch(apiUrl+'/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data})
    })
}
    catch(error){
        console.log(error);
        }
    
    

}