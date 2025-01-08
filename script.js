// Static festivals that don't change dates
const staticFestivals = [
    { name: "New Year's Day", month: 1, day: 1 },
    { name: "National Youth Day", month: 1, day: 12 },
    { name: "Republic Day", month: 1, day: 26 },
    { name: "International Women's Day", month: 3, day: 8 },
    { name: "National Science Day", month: 2, day: 28 },
    { name: "Ambedkar Jayanti", month: 4, day: 14 },
    { name: "May Day (Labour Day)", month: 5, day: 1 },
    { name: "World Environment Day", month: 6, day: 5 },
    { name: "National Doctors' Day", month: 7, day: 1 },
    { name: "Independence Day", month: 8, day: 15 },
    { name: "Teacher's Day", month: 9, day: 5 },
    { name: "Mahatma Gandhi Jayanti", month: 10, day: 2 },
    { name: "Children's Day", month: 11, day: 14 },
    { name: "Indira Gandhi Jayanti", month: 11, day: 19 },
    { name: "World AIDS Day", month: 12, day: 1 },
    { name: "National Mathematics Day", month: 12, day: 22 },
    { name: "Atal Jayanti", month: 12, day: 25 },
    { name: "Christmas", month: 12, day: 25 }
];

  
  let dynamicFestivals = [];
  
  // DOM Elements
  const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    addEventSubmit = document.querySelector(".add-event-btn ");
  
  let today = new Date();
  let activeDay;
  let month = today.getMonth();
  let year = today.getFullYear();
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  const eventsArr = [];
  getEvents();
  
  // Function to fetch festival dates from API
  async function fetchFestivalDates(year) {
    try {
      // Using Calendarific API as an example
      const apiKey = 'MJChxXAgkUFmpxOFqpFLll1x3aLWVpSB'; // Replace with your API key
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=IN&year=${year}&type=national,religious`
      );
      const data = await response.json();
      
      dynamicFestivals = data.response.holidays.map(holiday => ({
        name: holiday.name,
        month: holiday.date.datetime.month,
        day: holiday.date.datetime.day
      }));
      
      initCalendar();
    } catch (error) {
      console.error("Error fetching festival dates:", error);
      // Initialize calendar even if API fails
      initCalendar();
    }
  }
  
  function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
  
    date.innerHTML = months[month] + " " + year;
  
    let days = "";
  
    for (let x = day; x > 0; x--) {
      days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }
  
    for (let i = 1; i <= lastDate; i++) {
      let event = false;
      let festival = false;
      
      // Check for events
      eventsArr.forEach((eventObj) => {
        if (
          eventObj.day === i &&
          eventObj.month === month + 1 &&
          eventObj.year === year
        ) {
          event = true;
        }
      });
      
      // Check for static festivals
      staticFestivals.forEach(fest => {
        if (fest.month === month + 1 && fest.day === i) {
          festival = true;
        }
      });
      
      // Check for dynamic festivals
      dynamicFestivals.forEach(fest => {
        if (fest.month === month + 1 && fest.day === i) {
          festival = true;
        }
      });
  
      if (
        i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth()
      ) {
        activeDay = i;
        getActiveDay(i);
        updateEvents(i);
        
        let classes = ['day', 'today', 'active'];
        if (event) classes.push('event');
        if (festival) classes.push('festival');
        
        days += `<div class="${classes.join(' ')}">${i}</div>`;
      } else {
        let classes = ['day'];
        if (event) classes.push('event');
        if (festival) classes.push('festival');
        
        days += `<div class="${classes.join(' ')}">${i}</div>`;
      }
    }
  
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListner();
  }
  
  function prevMonth() {
    month--;
    if (month < 0) {
      month = 11;
      year--;
      fetchFestivalDates(year);
    }
    initCalendar();
  }
  
  function nextMonth() {
    month++;
    if (month > 11) {
      month = 0;
      year++;
      fetchFestivalDates(year);
    }
    initCalendar();
  }
  
  prev.addEventListener("click", prevMonth);
  next.addEventListener("click", nextMonth);
  
  initCalendar();
  
  function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      day.addEventListener("click", (e) => {
        getActiveDay(e.target.innerHTML);
        updateEvents(Number(e.target.innerHTML));
        activeDay = Number(e.target.innerHTML);
        
        days.forEach((day) => {
          day.classList.remove("active");
        });
        
        if (e.target.classList.contains("prev-date")) {
          prevMonth();
          setTimeout(() => {
            const days = document.querySelectorAll(".day");
            days.forEach((day) => {
              if (
                !day.classList.contains("prev-date") &&
                day.innerHTML === e.target.innerHTML
              ) {
                day.classList.add("active");
              }
            });
          }, 100);
        } else if (e.target.classList.contains("next-date")) {
          nextMonth();
          setTimeout(() => {
            const days = document.querySelectorAll(".day");
            days.forEach((day) => {
              if (
                !day.classList.contains("next-date") &&
                day.innerHTML === e.target.innerHTML
              ) {
                day.classList.add("active");
              }
            });
          }, 100);
        } else {
          e.target.classList.add("active");
        }
      });
    });
  }
  
  todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
  });
  
  dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
      dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
      dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
      if (dateInput.value.length === 3) {
        dateInput.value = dateInput.value.slice(0, 2);
      }
    }
  });
  
  gotoBtn.addEventListener("click", gotoDate);
  
  function gotoDate() {
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
      if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
        month = dateArr[0] - 1;
        year = dateArr[1];
        initCalendar();
        return;
      }
    }
    alert("Invalid Date");
  }
  
  function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
  }
  
  function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
      if (
        date === event.day &&
        month + 1 === event.month &&
        year === event.year
      ) {
        event.events.forEach((event) => {
          events += `<div class="event">
              <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${event.title}</h3>
              </div>
              <div class="event-time">
                <span class="event-time">${event.time}</span>
              </div>
          </div>`;
        });
      }
    });
  
    // Add festivals for the selected date
    let festivalNames = [];
    staticFestivals.forEach(fest => {
      if (fest.month === month + 1 && fest.day === date) {
        festivalNames.push(fest.name);
      }
    });
    dynamicFestivals.forEach(fest => {
      if (fest.month === month + 1 && fest.day === date) {
        festivalNames.push(fest.name);
      }
    });
  
    if (festivalNames.length > 0) {
      festivalNames.forEach(festName => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle" style="color: #4CAF50;"></i>
              <h3 class="event-title">${festName} (Festival)</h3>
            </div>
        </div>`;
      });
    }
  
    if (events === "") {
      events = `<div class="no-event">
              <h3>No Events</h3>
          </div>`;
    }
    eventsContainer.innerHTML = events;
    saveEvents();
  }
  
  addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
  });
  
  addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
  });
  
  document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
      addEventWrapper.classList.remove("active");
    }
  });
  
  addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
  });
  
  addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2) {
      addEventFrom.value += ":";
    }
    if (addEventFrom.value.length > 5) {
      addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
  });
  
  addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2) {
      addEventTo.value += ":";
    }
    if (addEventTo.value.length > 5) {
      addEventTo.value = addEventTo.value.slice(0, 5);
    }
  });
  
  addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
      alert("Please fill all the fields");
      return;
    }
  
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
    ) {
      alert("Invalid Time Format");
      return;
    }
  
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);
  
    let eventExist = false;
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.forEach((event) => {
          if (event.title === eventTitle) {
            eventExist = true;
          }
        });
      }
    });
    if (eventExist) {
      alert("Event already added");
      return;
    }
    const newEvent = {
      title: eventTitle,
      time: timeFrom + " - " + timeTo,
    };
  
    let eventAdded = false;
    if (eventsArr.length > 0) {
      eventsArr.forEach((item) => {
        if (
          item.day === activeDay &&
          item.month === month + 1 &&
          item.year === year
        ) {
          item.events.push(newEvent);
          eventAdded = true;
        }
      });
    }
  
    if (!eventAdded) {
      eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        events: [newEvent],
      });
    }
  
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);
  
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }
  });
  
  eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
      if (confirm("Are you sure you want to delete this event?")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;
        eventsArr.forEach((event) => {
          if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
          ) {
            event.events.forEach((item, index) => {
              if (item.title === eventTitle) {
                event.events.splice(index, 1);
              }
            });
            if (event.events.length === 0) {
              eventsArr.splice(eventsArr.indexOf(event), 1);
              const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}