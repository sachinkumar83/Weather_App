const API_KEY="06e1973a02934906614f633ac6ecdb71";

const DAYS_OF_THE_WEEK=[ "sun","mon" ,"tue" , "wed", "thu","fri","sat"];

const getCurrentWeatherData=async()=>{
    const city="uttar pradesh";
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    return response.json();
}

const formatTemperature=(temp)=>`${temp?.toFixed(1)}°`;
const createIconUrl=(icon)=>` http://openweathermap.org/img/wn/${icon}@2x.png`;

loadCurrentForecast= ({name,main:{temp,temp_max,temp_min},weather:[{description}]}) =>{
  
    const currentForecastElement=document.querySelector("#current-forecast");
    currentForecastElement.querySelector(".city").textContent=name;
    currentForecastElement.querySelector(".temp").textContent=formatTemperature(temp);
    currentForecastElement.querySelector(".description").textContent=description;
    currentForecastElement.querySelector(".min-max-temp").textContent=`High:${formatTemperature(temp_max)}, Low:${formatTemperature(temp_min)}`;
  

  // <h1>City Name</h1>
  //<p class="temp">Temp</p>
  //<p class="description">Description</p>
  //<p class="min-max-temp">High Low</p>

}

// hourly forecast
const getHourlyForecast=async({name:city})=>{
   
  const response =await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  const data=await response.json();
  console.log(data);
  
  return data.list.map(forecast=>{
    const{ main:{temp,temp_max,temp_min},dt,dt_txt,weather:[{description,icon}] }=forecast;

    return{temp,temp_max,temp_min,dt,dt_txt,description,icon};
  }) 
  
}

const loadHourlyForecast=(hourlyforecast)=>{
  console.log(hourlyforecast);
  let dateFor12Hours=hourlyforecast.slice(1,13);
  const hourlyContainer=document.querySelector(".hourly-container");
  let innerHTMLString=``;

  for ( let {temp,icon,dt_txt,} of dateFor12Hours){
      innerHTMLString+=`
      <article>
          <h3 class="time">${dt_txt.split(" ")[1]}</h3>
          <img class="icon" src="${createIconUrl(icon)}"> 
          <p class="hourly-temp">${formatTemperature(temp)}</p>
      </article>`

  } 
  hourlyContainer.innerHTML=innerHTMLString; 
  
}
//five -day
const calculateDayWiseforecast=(hourlyforecast)=>{
   let dayWiseForecast = new Map();
   for(let forecast of hourlyforecast){
      const[date]=forecast.dt_txt.split(" ");
      const dayOfTheWeek=DAYS_OF_THE_WEEK[new Date(date).getDay()];
      console.log(dayOfTheWeek);
      if(dayWiseForecast.has(dayOfTheWeek) ){
        let forecastForTheDay=dayWiseForecast.get(dayOfTheWeek);
        forecastForTheDay.push(forecast);
        dayWiseForecast.set(dayOfTheWeek,forecastForTheDay);
      }
      else{
        dayWiseForecast.set(dayOfTheWeek,[forecast ])
      }
  } 


}

const loadFiveDayForecast=(hourlyforecast)=>{
    console.log(hourlyforecast);
    const dayWiseForecast=calculateDayWiseforecast(hourlyforecast);
    
}



// feels-like
const loadFeelsLike=({main:{feels_like}})=>{
    let container=document.querySelector("#feel-like");
    container.querySelector(".feels-like-temp").textContent=formatTemperature(feels_like);
   // console.log(currentWeather);
}

const loadHumidity=({main:{humidity}})=>{
  let container=document.querySelector("#humidity");
  container.querySelector(".humidity-value").textContent=formatTemperature(humidity);
}
 // console.log(currentWeather);
  
// =====================main=======================

document.addEventListener("DOMContentLoaded",async()=>{
   const currentWeather=await getCurrentWeatherData();
   loadCurrentForecast(currentWeather);

   const hourlyforecast=await getHourlyForecast(currentWeather);
   loadHourlyForecast(hourlyforecast);
   loadFiveDayForecast(hourlyforecast);
   loadFeelsLike(currentWeather);
   loadHumidity(currentWeather);
  // console.log(currentWeather);

}) 