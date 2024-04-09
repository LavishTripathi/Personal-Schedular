
import {Calendar,dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse" ;
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../src/App.css'

const style = {
  rbcBtnGroup: {
    display:"flex"
  }
};



const locales ={
  "en-US": require("date-fns/locale/en-US")
}
const localizer =dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales

})

function App() {
  const [timetables, setTimetables] = useState([])
  const [timetable, setTimetable] = useState("")

  useEffect(() => {
    const getTimetables = async () => {
      const response = await axios.get("https://sutt-front-task2-d09a14a7c50b.herokuapp.com/timetables", {headers: {Authorization: localStorage.getItem("token")}} )

      const data = response.data
      if (data?.length > 0) {
        setTimetable(data[0]._id)
      }

      setTimetables(data)
    }
    
    getTimetables()
  }, [])

  console.log(timetables)

  const [newEvent, setNewEvent ] = useState({title : "",start : "",end : ""})
  const [allEvents,setAllEvents] = useState([])

  
  useEffect(() => {
    const getEvents = async () => {
      if (timetable.length > 0) {
        const response = await axios.get(`https://sutt-front-task2-d09a14a7c50b.herokuapp.com/timetables/${timetable}/events`, {headers: {Authorization: localStorage.getItem("token")}})
        
        const data = response?.data;
        
        let events = []
        data.forEach((d)=>{
          const start = new Date(d.startDate)
          const end = new Date(d.endDate)
          
          const event = {title: d.name, start, end}
          events = [...events, event]
        })
        
        setAllEvents(events)
      }
    }
    
    getEvents()
  }, [timetable])
  
  console.log(allEvents)
  
  const [names, setNames] = useState([])
  useEffect(()=>{
    const filtered = [];
    
    timetables.forEach((timetable) => {
      filtered.push(timetable.name)
    })

    setNames(filtered)
  },[timetables])
  
  
  const handleAddEvent = async () => {
    const body = {
      name: newEvent.title,
      startTime: newEvent.start.toISOString().slice(0,10),
      endTime: newEvent.end.toISOString().slice(0,10)
    }
    try {
      await axios.post(`https://sutt-front-task2-d09a14a7c50b.herokuapp.com/timetables/${timetable}/events/`,body, {headers: {Authorization: localStorage.getItem("token")}})
      .then(
        setAllEvents([...allEvents, newEvent])
      )     
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleDeleteTimetable = async () => {
    try {
      await axios.delete(`https://sutt-front-task2-d09a14a7c50b.herokuapp.com/timetables/${timetable}`,{headers: {Authorization: localStorage.getItem("token")}})
      
      const filtered = timetables.filter((timetable) => timetable._id !== timetable);
      setTimetables(filtered)
      setTimetable(filtered[0]._id) 

      console.log({filtered})
      
      alert("Timetable has been deleted!")
    } catch (error) {
      
    }
  }

  
  const defaultOption = names[0];
  return (
    <div className="App">
      <h1>Calendar</h1>
      <h2>Add New Event</h2>
      <div style={{display: "flex", alignItems: "center"}}>
        <input type="text" placeholder="Add Title" style={{width:"20%",marginRight:"10px"}}
          value={newEvent.title} onChange={(e)=> setNewEvent({...newEvent,title:e.target.value})}
          />
        <DatePicker placeholderText="Start Date" style={{marginRight:"10px"}}
        selected={newEvent.start} onChange={(start)=> setNewEvent({...newEvent,start})}
        showTimeSelect timeIntervals={60} timeFormat="hh:mm"/>
        <DatePicker placeholderText="End Date" style={{marginLeft:"10px"}}
        selected={newEvent.end} onChange={(end)=> setNewEvent({...newEvent,end})}
        showTimeSelect timeIntervals={60} timeFormat="hh:mm" />
        <button style={{marginTop:"8px",color:"white",backgroundColor:"blue", width: "max-content", height: "max-content",padding:"5px"}} onClick={handleAddEvent}>Add Event</button>

      </div>

      <div style={{display: "flex",marginTop:"30px"}}>
      <Dropdown options={names} value={defaultOption} placeholder="Select a Timetable" />
      <button onClick={handleDeleteTimetable} style={{width:"100px", marginLeft: "10px", backgroundColor:"red",height:"max-content",padding:"5px",}}>Delete Timetable</button>
      
     
      </div>


      <div style={{width: "100vw"}}>
        { <Calendar localizer={localizer} events={allEvents} startAccessor="start" 
      endAccessor="end" style={{height:500,margin:"50px"}}/> }
      </div>
   
    </div>
  );
}

export default App;