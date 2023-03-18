import { useState } from 'react'
import './App.css'
import APIform from './Components/APIform';
import Gallery from './Components/Gallery';


const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


/** url
 *  format - jpeg, png, 
 *  width 
 *  height
 * response type? json or image?
 * no ads,
 * no cookei banners
 * 
 * 
 */
 
function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const [quota, setQuota] = useState(null);


  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  /**
   * submitForm() handles the form submission and checks if the url is valid or not.
   * If it is invalid, it makes the query by using the makeQuery()
   */
  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    console.log("in submit form");
    if(inputs.url == "" || inputs.url == " "){
      alert("You forgot to submit an url!");
    } else{
      for(const [key,value] of Object.entries(inputs)) {
        if(value == ""){
          inputs[key] = defaultValues[key]
        }
      }
    }
    makeQuery();  
  }


  /**
   * This function makes the query for the API. It initializes the query based on user input 
   * gained from the form. 
   * This function is called only after submitForm() finishes its validation for proper input.
   */
  
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_start = "https://";
    let fullURL = url_start + inputs.url;

    console.log("in make query");

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);

  }



  /**
   * This function makes an api call 
   */
  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    console.log(json);

    if (json.url == null){
      alert("Oops! Something went wrong with that query, let's try again!")
        }
    else {
      setCurrentImage(json.url);
      setPrevImages((images) => [...images, json.url]); //setting the gallery of previous images
      console.log(json);
      reset();
      getQuota();
    }

  }

  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
    
  }

  const getQuota = async () => {
    const returnedQuota = await fetch("https://api.apiflash.com/v1/urltoimage/quota?access_key=" + ACCESS_KEY)
    const result = await returnedQuota.json()

    setQuota(result);
  }

  return (
    <div className= "whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>

      <div className='quota'>
      {quota ? (
        <p className="quota">
          {" "}
          Remaining API calls: {quota.remaining} out of {quota.limit}
        </p>
      ) : (
        <p></p>
      )}
      </div>

      <APIform
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
          <br></br>
          {/* Here we do conditional rendering. If theere is currentImage then we render it. If it isn't then an empty
          div is returned*/}
          {currentImage? (<img className = "screenshot" src = {currentImage} alt="Screenshot returned!"/>) 
          : 
          (<div> </div>
          )}

        {/**Container that displays the query built so far */}
        <div className="container" id = "query">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
      </div>

      <br></br>

      
  <div className="container">
    <Gallery images={prevImages} />
      </div>
      <br></br>
      </div>
    
    );
  }

export default App;
