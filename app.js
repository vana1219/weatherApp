const localInput= document.querySelector(".localInput");
const userInput=document.querySelector(".userInput");
const weatherInfo=document.querySelector(".weatherInfo");
const backgroundIcon = document.getElementById("backgroundIcon");
const keyAPI="b0f0a42344f4b77209283cec7b9e473a";


userInput.addEventListener("submit", async event=>{
    event.preventDefault();

    const locate=localInput.value;
    if (backgroundIcon) {
        console.log("Hiding background icon...");
        backgroundIcon.style.display = "none";
    } else {
        console.error("Background icon element not found!");
    }
    if(locate){
        try{
            const weatherData= await getWeatherData(locate);
            testFunction(weatherData);
            displayWeatherData(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please Enter a Valid Location");
    }
})
async function getWeatherData(locate){
    const api=`https://api.openweathermap.org/data/2.5/weather?q=${locate}&appid=${keyAPI}`
    const response =await fetch(api);
    if(!response.ok){
        throw new Error("Couldn't fetch data");
    }
    return await response.json();
    
}
let searchedCity = {};
function displayWeatherData(data){
    const {name: city, 
           main:{temp, temp_max, temp_min},
           sys: {sunrise, sunset},
           weather: [{id, description}]}=data;
    


    /////////// Check if the current city is already in the list
    if (searchedCity[city.toLowerCase()]) {
        console.log(`The city "${city}" is already in the list.`);
        return; // Exit the function if the city is already in the list
    }
    // Add the city to the searchedCity object
    searchedCity[city.toLowerCase()] = true;


     // Update the background image based on the weather condition

    const weatherID = id;
    const backIcon=document.getElementById("backgroundIcon");
    const body = document.body;
    if (weatherID>=200 && weatherID<=232){
        body.style.backgroundImage = "url('./img/thunder.jpg')";
        backIcon.style.display = "none"; 
    } else if (weatherID>=300 && weatherID<=321){
        body.style.backgroundImage = "url('./img/drizzle.jpg')";
        backIcon.style.display = "none"; 
    }else if (weatherID>=500 && weatherID<=531){
        body.style.backgroundImage = "url('./img/rainy.jpg')";
        backIcon.style.display = "none"; 
    }else if (weatherID>=600 && weatherID<=622){
        body.style.backgroundImage = "url('./img/snow.jpg')";
        backIcon.style.display = "none"; 
    }else if (weatherID>=700 && weatherID<=781){
        body.style.backgroundImage = "url('./img/atmosphere.jpg')";
        backIcon.style.display = "none"; 
    }else if (weatherID==800){
        body.style.backgroundImage = "url('./img/sunny.jpg')";
        backIcon.style.display = "none"; 
    }else if (weatherID>=801 && weatherID<=802){
        body.style.backgroundImage = "url('./img/fewCloud.jpg')";
        backIcon.style.display = "none"; 
    }else if (weatherID>802 && weatherID<=804){
        body.style.backgroundImage = "url('./img/cloud.jpg')";
        backIcon.style.display = "none"; 
    }
    // Additional styles for the background
    body.style.backgroundSize = "cover"; // Ensure the image covers the entire screen
    body.style.backgroundPosition = "center"; // Center the image
    body.style.backgroundRepeat = "no-repeat";




    //////////// Remove the error message if it exists
    const errorElement = document.querySelector(".displayErr");
    if (errorElement) {
        errorElement.remove();
    }

    ///////////// Create a container for the city's weather info
    const cityWeatherContainer = document.createElement("div");
    cityWeatherContainer.classList.add("cityWeatherContainer"); // Add a class for styling


    const location=document.createElement("h1");
    const tempInfo=document.createElement("p");
    const weatherEmoji=document.createElement("p");
    const descript=document.createElement("p");
    const high=document.createElement("p");
    const low=document.createElement("p");
    const sunRise=document.createElement("p");
    const sunSet=document.createElement("p");

    location.textContent=city;
    tempInfo.textContent=`${convertToF(temp)}°F`;
    weatherEmoji.textContent=getWeatherEmoji(id);
    descript.textContent=description;
    high.textContent=`High: ${convertToF(temp_max)}°F`
    low.textContent=`Low: ${convertToF(temp_min)}°F`
    sunRise.textContent=`Sunrise: ${convertToTime(sunrise)}`;
    sunSet.textContent=`SunSet: ${convertToTime(sunset)}`;

    
    //Add CSS 
    location.classList.add("location");
    tempInfo.classList.add("tempInfo");
    descript.classList.add("descript");
    weatherEmoji.classList.add("weatherEmoji");
    high.classList.add("high");
    low.classList.add("low");
    sunRise.classList.add("sunRise");
    sunSet.classList.add("sunSet");

    
    cityWeatherContainer.appendChild(location);
    cityWeatherContainer.appendChild(tempInfo);
    cityWeatherContainer.appendChild(weatherEmoji);
    cityWeatherContainer.appendChild(descript);
    cityWeatherContainer.appendChild(high);
    cityWeatherContainer.appendChild(low);
    cityWeatherContainer.appendChild(sunRise);
    cityWeatherContainer.appendChild(sunSet);
    cityWeatherContainer.style.display="flex";

    // Append the city's weather container to the main weatherInfo container
    weatherInfo.style.display = "flex";
    weatherInfo.insertBefore(cityWeatherContainer, weatherInfo.firstChild);

    // Remove the 'currentCity' class from all children
    Array.from(weatherInfo.children).forEach(child => child.classList.remove("currentCity"));

    // Add the 'currentCity' class to the last child (current city)
    weatherInfo.firstChild.classList.add("currentCity");
}
    
function displayError(errMsg){
    // Clear existing content
    searchedCity = {};
    weatherInfo.textContent = "";

    const err=document.createElement("p");
    err.textContent=errMsg;
    err.classList.add("displayErr")

    weatherInfo.style.display="flex";
    weatherInfo.appendChild(err)
}
function convertToF(temp){
    return (temp*(9/5)-459.67).toFixed(0);
}
function convertToTime(timestamp){
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleTimeString(); // Output in local time

}
function getWeatherEmoji(id){
    switch(true){
        case (id>=200 && id<=232):
            return "⛈️";
        case (id>=300 && id<=321):
            return "🌨️";
        case (id>=500 && id<=531):
            return "🌦️";
        case (id>=600 && id<=622):
            return "❄️";
        case (id>=700 && id<=781):
            return "";
        case (id==800):
            return "☀️";
        case (id>=801 && id<=804):
            return "🌥️";
        default:
            return "🤔";
    }
}
function testFunction(data){
    console.log(data);
}

