// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  createHTML();
  var containerEl = $("#schedule");

  var timeSlots = containerEl.children();

  for (var i = 0; i < timeSlots.length; i++) {
    var timeSlot = $(timeSlots[i]); // Get the individual tie slot - it's an array with a single element
    var timeSlotId = timeSlot[0].id; // Get the id attribute for the DIV time slot element
    var hourNow = dayjs().format("H");

    if(timeSlotId === "hour-" + hourNow) {
      timeSlot.addClass("present");
    } else if (parseInt(timeSlotId.split("-")[1]) < parseInt(hourNow)) {
      timeSlot.addClass("past");
      console.log(timeSlotId.split("-")[1]);
    } else {
      timeSlot.addClass("future");
    }
  }

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.

  var currentDayEl = $("#currentDay");
  var currentDay = dayjs().format("dddd, MMMM D");
  currentDayEl.text(currentDay);
});


function createHTML() {
  var containerEl = $("#schedule");

  for (var i = 9; i < 18; i++) {

    // <div id="hour-12" class="row time-block"></div>
    var divTimeSlot = $("<div>");
    divTimeSlot.attr("id", "hour-" + i);
    divTimeSlot.addClass("row time-block");

    // <div class="col-2 col-md-1 hour text-center py-3">
    var divHour = $("<div>");
    divHour.addClass("col-2 col-md-1 hour text-center py-3");
    var txtHour = (i % 12 === 0) ? 12 : i % 12; // if i % 12 is 0 then set text to 12, otherwise set it to i % 12
    txtHour = (i < 12) ? txtHour + "AM" : txtHour + "PM";
    divHour.text(txtHour);
    divTimeSlot.append(divHour);

    // <textarea class="col-8 col-md-10 description" rows="3">
    var textAreaDescription = $("<textarea>");
    textAreaDescription.attr("rows", "3");
    textAreaDescription.addClass("col-8 col-md-10 description");
    divTimeSlot.append(textAreaDescription);

    // <button class="btn saveBtn col-2 col-md-1" aria-label="save">
    var btnSave = $("<button>");
    btnSave.attr("aria-label","save");
    btnSave.addClass("btn saveBtn col-2 col-md-1");

    // <i class="fas fa-save" aria-hidden="true">
    var iSave = $("<i>");
    iSave.attr("aria-hidden","true");
    iSave.addClass("fas fa-save");

    btnSave.append(iSave);
    divTimeSlot.append(btnSave);

    containerEl.append(divTimeSlot);
  }
}
/* <div id="hour-12" class="row time-block future">
  <div class="col-2 col-md-1 hour text-center py-3">11AM</div>
  <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
  <button class="btn saveBtn col-2 col-md-1" aria-label="save">
    <i class="fas fa-save" aria-hidden="true"></i>
  </button>
</div> */