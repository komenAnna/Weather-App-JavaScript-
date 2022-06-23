//create a var wrapper to access the class wrapper which holds all elements in the html body
const wrapper = document.querySelector(".wrapper"),
//create a var that holds the input-part class which is accessed from the wrapper class
inputPart = wrapper.querySelector(".input-part"),
//create a var that holds the info-text class which is accessed from the wrapper class
infoText = wrapper.querySelector(".info-text"),
//create a var that holds the input field which is accessed from the wrapper class
inputField = wrapper.querySelector("input");

//a var that stores the weather icon depeding on the api ID diven from the fetch request in the info on the console
const wIcons = document.querySelector(".weather-part img");

//a var to execute an event for the back arrow
const arrowBack = document.querySelector("header i");

//var to use in storing the api url in fetching weather data
let api;

//create a var for the get device location button which on click will get lat and lon values of user device
//then send the coordiates to the api and get wether details on it
const locationBtn = document.querySelector("button");

// store the open weather api key in a variable then call it in the function requestApi
//this APIkey should be private meaning i should be the only one that can see it
const apiKey = "#";

//create an event with the inputField var created baove that when the user keys in a city name and presses enter
//keyup event occurs when a keyboard key is released; so on keyup execute the following event
inputField.addEventListener("keyup", e =>{
    //check if user presses enter button and input field is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
        //requestApi(city) function declared below then called here to be executed on the inputField.value
    }
});


// ==========call API from open weather via "Get device location" button to display current weather data ==========
locationBtn.addEventListener("click", ()=>{
    //geolocation api is used to get the current geographical location of a user
    if(navigator.geolocation){    //if browser supports geolocation api
         //getCurrentPosition() method is used to return the user's location
         //if the method is successful the onSuccess function will call
         //if unsuccessful, the onError function will call
         navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
});
//call the functions passed in as arguments in navigator.geolocation.getCurrentPosition() method
function onSuccess(position){
    //if the user allows the request for location, we use the lat and lon values only
    const {latitude, longitude} = position.coords;  //get lat and lon of the user device from coords object
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}
function onError(error){
    infoText.innerText = error.message; 
    infoText.classList.add("error");
}



// ========== Call API from open weather by city to display the current weather data ==========
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}


// =========== DEFINE FUNCTIONALITY OF THE fetchData() FUNCTION ==========
//that is called in the function requestApi(city) and function onSuccess
//create a function that will fetch the data thru the api and so it can be reused 
//when using get location button or the city name
function fetchData(){
    infoText.innerText = "Getting weather details...";
    infoText.classList.add("pending");
    //getting api response and returning it with parsing into JS oject and in another
    //then function calling weather details function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}


// ========== THE API result IS PASSED ONTO THE weatherDetails ==========
//info is an object that holds the properties of the result argument passed onto the 
//weather details from the api fetch response in fetchData()
//in other words; info === result
//we'll use dot notation to access this object's properties
function weatherDetails(info){
//info.cod == "404" simply is an error message which means that the server is unable to locate 
//the city name from the openweather map api files
//cod == "200" indicates success i.e the file is located
//if not found it displays the infoText.innerText and replaces the pending class with the error class
    if(info.cod == "404"){
        infoText.innerText = `${inputField.value} is not a valid city name`;
        infoText.classList.replace("pending", "error");
    } else {
        //if the city name is valid, the following data fetched from the api and stored in variables is displayed
        //lets get required properties values form console.log(info) to display the weather
     //info.name access the property name 
        const city = info.name;
    //info.sys.country access the property country which is a child of sys
        const country = info.sys.country;
    //var holds the values of the array property weather and takes the description and id values
        const {description, id} = info.weather[0];
    //var also holds the values of the key properties feels_like, humidity and temp accessed from the main property
        const {feels_like, humidity, temp} = info.main;

        //lets pass the values to a particular HTML element
        //the above accessed data is then passed into their respective predefined HTML elements
        wrapper.querySelector(".temp .num").innerText = Math.floor(temp);  //rounds off to mearest integer
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .num-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
        
        //checking the custom id the api returns to show the image to display
        //the weather array in info.weather has a unique ID that groups the weather condition
        //with properties like "main" and "description". Check this out on the console
        if(id == 800){
            wIcons.src = "assets/Weather-icons/clear.svg";
        } 
        else if(id >=200 && id <= 232) {
            wIcons.src = "assets/Weather-icons/storm.svg";
        } 
        else if(id >= 600 && id <= 622) {
            wIcons.src = "assets/Weather-icons/snow.svg";
        } 
        else if(id >= 701 && id <= 781) {
            wIcons.src = "assets/Weather-icons/haze.svg";
        }
        else if(id >= 801 && id <= 804) {
            wIcons.src = "assets/Weather-icons/storm.svg";
        }
        else if((id >= 300 && id <= 321) || (id >= 500 & id <= 531)){
            wIcons.src = "assets/Weather-icons/rain.svg";
        }

        //when data is found accurately, remove classes pending and error
        infoText.classList.remove("pending", "error");
        //add class active, this will hide the input part section and display the weather part section
        wrapper.classList.add("active");
        //the info (fetchData() results is logged to the console)
        console.log(info);
    }
    
}

//onClick of the arrow button, the active class is removed hence the input part section is dispalyed and the weather part hidden
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
