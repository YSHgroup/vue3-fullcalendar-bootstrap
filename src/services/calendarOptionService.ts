import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { FullCalendar as F } from "@/interfaces";



const handleDateClick = (arg: F.DateClickArg) => {
  alert("Date click! " + arg.dateStr);
};

export const calendarOptions: F.CalendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    start: 'dayGridYear,dayGridMonth,dayGridWeek,dayGridDay,timeGridWeek,timeGridDay timeGridFive',
    center: 'title',
    end: 'addResource prevYear,prev,next,nextYear'
  },
  footerToolbar: {
    start: 'custom1,custom2',
    center: '',
    end: 'prev,next'
  },
  views: {
    timeGridFive: {
      type: 'dayGrid',
      duration: {
        weeks: 5
      },
      buttonText: 'Fivedays'
    }
  },
  monthStartFormat: {
    month: 'long',
    day: 'numeric'
  },
  customButtons: {
    custom1: {
      text: 'custom 1',
      click: function() {
        alert('clicked custom button 1!');
      }
    },
    custom2: {
      text: 'custom 2',
      click: function() {
        alert('clicked custom button 2!');
      }
    }
  },
  dateClick: handleDateClick,
  events: [
    { title: "My first event", date: "2024-2-1" },
    { title: "Lunar day", date: "2024-2-10" },
    { title: "My birthday", date: "2024-2-18" },
  ],
};
