import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
function App() {
  const [city,setCity] = useState("");
  const [country,setCountry] = useState("");
  const [cityName,setCityName] = useState("...");
  const [net,setNet] = useState(false);
  const [data,setData] = useState();
  const [add,setAdd] = useState("");
  const [coord,setCoord] = useState({
    latitude: 0,
    longitude: 0
  });
  const date = new Date();
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const [dt,setDt] = useState({
    day: weekday[date.getDay()],
    date: date.getDate(),
    month: month[date.getMonth()],
    year: date.getFullYear(),
    hour: date.getHours(),
    minutes: (date.getMinutes()<10)? "0" + date.getMinutes() : date.getMinutes()
  });
  const getDateAndTime = ()=>{
      const d = new Date();
      setDt({
        day: weekday[d.getDay()],
        date: d.getDate(),
        month: month[d.getMonth()],
        year: d.getFullYear(),
        hour: d.getHours(),
        minutes: (d.getMinutes()<10)? "0" + d.getMinutes() : d.getMinutes()
      })
  }
   setInterval(getDateAndTime,60000);
  const change = (e)=>{
    const {name,value} = e.target;
    if (name==="city"){
      setCity(value);
    }
    else{
      setCountry(value);
    }
  }
  const next = ()=>{
    setNet(true);
  }
  useEffect(()=>{
    if ( navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoord({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation data:", error);
        }
      );
    }
  },[]);
  const weather = ()=>{
    axios.get("https://api.openweathermap.org/data/2.5/weather?units=metric&lat=" + coord.latitude + "&lon=" + coord.longitude + "&appid="+`${import.meta.env.VITE_API_ID}`).then((res)=>{setData(res.data); setAdd(res.data.name + "," + res.data.sys.country);setCityName(" " +res.data.name);});
  }
  const getWeather = ()=>{
    axios.get("https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + city.toLowerCase()+ "," + country.toLowerCase() + "&appid="+`${import.meta.env.VITE_API_ID}`).then((res)=>{setData(res.data)});
    setCityName(" " + city.slice(0,1).toUpperCase() + city.slice(1));
    setAdd(city.slice(0,1).toUpperCase() + city.slice(1) + "," + country.slice(0,1).toUpperCase() + country.slice(1) );
    setCity("");
    setCountry("");
    setNet(false);
  }
  return (
    <>
      <div className="header">
      <h2 className="title">Weather<span className="titleSpan">App</span></h2>
      <h4 className="time">{dt.day}, {dt.date} {dt.month},{dt.year} | {dt.hour}:{dt.minutes}</h4>
      </div>
      <h1 className="intro">Let's check the weather now in{cityName}</h1>
      <LocationOnIcon className="LocIcon" onClick={weather}/>
      {!net&&<input type="text" className="city" value={city} name="city" placeholder="place" onChange={change} required></input>}
      {!net&&<button onClick={next} className="next"><NavigateNextIcon className="Nicon"/>Next</button>}
      {net&&<input type="text" value={country} name="country" className="city" placeholder="country" onChange={change} required></input>}
      {net&&<button onClick={getWeather} className="next"><SearchIcon className="search"/>Get Weather</button>}
      {data&&<div className="weather">
        <h3 className="area">{add}</h3>
        <hr></hr>
        <img src={"https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"} className="icon"></img>
        <div className="details">
        <h4 className="cw">{data.weather[0].main}</h4>
        <h4 className="temp"><ThermostatIcon className="thermo"/> {data.main.temp}&#8451;</h4>
        <h4 className="wind"><AirIcon className="air"/> {data.wind.speed} km/h</h4>
        </div>
      </div>}
      <img className="bg" src="bg.jpg"></img>
    </>
  )
}

export default App
