// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {

  // Display the current date in the header of the page
  var currentDayEl = $("#currentDay");
  var currentDay = dayjs().format("dddd, MMMM D");

  // Handle ordinal based on the day of the month
  var dayOfMonth = dayjs().format("D");

  if (["1","21","31"].includes(dayOfMonth)) {
    currentDay += "st"; // Add 'st' to the end of the string on the 1st, 21st, or 31st of the month
  } else if (["2","22"].includes(dayOfMonth)) {
    currentDay += "nd"; // Add 'nd' to the end of the string on the 2nd, 22nd of the month
  } else if (["3","23"].includes(dayOfMonth)) {
    currentDay += "rd"; // Add 'rd' to the end of the string on the 3rd, 23rd of the month
  } else {
    currentDay += "th"; // Add 'th' to the end of the string on all other days
  }

  // Set text property
  currentDayEl.text(currentDay);

  // Generate time slots as HTML elements
  // This will also apply the correct class to each time slot (past/present/future)
  createHTML();

  // Grab main container
  var containerEl = $(".container-lg");

  // Add on click listener
  containerEl.on("click", ".saveBtn", saveScheduleItems);

  // Retrive data from localStorage and print to page
  printData();

});

// This function will create the HTML structure for each of the time slots from 9AM to 5PM
/*
  EXAMPLE
  <div id="hour-13" class="row time-block">
    <div class="col-2 col-md-1 hour text-center py-3">1PM</div>
    <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
    <button class="btn saveBtn col-2 col-md-1" aria-label="save">
      <i class="fas fa-save" aria-hidden="true"></i>
    </button>
  </div>
*/
function createHTML() {

  // Grab main container
  var containerEl = $(".container-lg");

  // Create time slot DIVs - start at 9 (aka 9AM) and end with 17 (aka 5PM)
  for (var i = 9; i <= 17; i++) {

    // Create <div id="hour-12" class="row time-block"></div>
    var divTimeSlot = $("<div>");
    divTimeSlot.attr("id", "hour-" + i);
    divTimeSlot.addClass("row time-block");

    // Add past/present/future class to time slot DIV
    var backgroundColorClass = getBackgroundColorClass(divTimeSlot.attr("id"));
    divTimeSlot.addClass(backgroundColorClass);

    // Create <div class="col-2 col-md-1 hour text-center py-3">
    var divHour = $("<div>");
    divHour.addClass("col-2 col-md-1 hour text-center py-3");
    var txtHour = (i % 12 === 0) ? 12 : i % 12; // If i % 12 is 0 then set text to 12, otherwise set it to i % 12
    txtHour = (i < 12) ? txtHour + "AM" : txtHour + "PM"; // Add AM or PM to text depending on i counter
    divHour.text(txtHour);
    divTimeSlot.append(divHour); // Append hour DIV element to parent (time slot DIV)

    // Create <textarea class="col-8 col-md-10 description" rows="3">
    var textAreaDescription = $("<textarea>");
    textAreaDescription.attr("rows", "3");
    textAreaDescription.addClass("col-8 col-md-10 description");
    divTimeSlot.append(textAreaDescription); // Append description textarea element to parent (time slot DIV)

    // Create <button class="btn saveBtn col-2 col-md-1" aria-label="save">
    var btnSave = $("<button>");
    btnSave.attr("aria-label","save");
    btnSave.addClass("btn saveBtn col-2 col-md-1");

    // Create <i class="fas fa-save" aria-hidden="true">
    var iSave = $("<i>");
    iSave.attr("aria-hidden","true");
    iSave.addClass("fas fa-save"); 

    btnSave.append(iSave); // Append save i element to parent (save button)
    divTimeSlot.append(btnSave); // Append save button element to parent (time slot DIV)

    containerEl.append(divTimeSlot); // Append time slot DIV element to parent (main container)
  }
}

// This function returns the past/present/future class name based on the time slot id
function getBackgroundColorClass(timeSlotId) {

  // Grab the hour value from the id which is in the following format: hour-x
  // Split the id string at the hyphen and return the second element of the resulting array (the hour value)
  var timeSlotHour = timeSlotId.split("-")[1];
  timeSlotHour = parseInt(timeSlotHour); // Convert variable to a number

  // Grab the current time hour value in 24-hour format
  var nowHour = dayjs().format("H");
  nowHour = parseInt(nowHour); // Convert variable to a number

  // If the time slot hour is the same as the hour now then return the class name "present"
  // If the time slot hour is less than the hour now then return the class name "past"
  // Else return the class name "future"
  if(timeSlotHour === nowHour) {
    return "present";
  } else if (timeSlotHour < nowHour) {
    return "past";
  } else {
    return "future"
  }

}

// This function handles on click events for Save button for each time slot
// Data is saved to localStorage
function saveScheduleItems(event) {

  // Grab the Save button instance
  var saveBtn = $(this);

  // Grab the button's parent (time slot DIV)
  var saveBtnParent = saveBtn.parent(".row");
  
  // Grab the time slot id attribute value (hour-x)
  var timeSlotId = saveBtnParent.attr("id");

  // Grab the Description textarea instance
  var textAreaDescription = $(saveBtnParent.children(".description")[0]);
  var descriptionText = textAreaDescription.val().trim();

  // Save data to localStorage
  // Use the time slot id (hour-x) value as the key
  // Use the Description textarea value as the value (trimmed)
  localStorage.setItem(timeSlotId, descriptionText);
  
  // Reload textarea value to use trimmed value
  textAreaDescription.val(descriptionText);

}

// This function will load the data from the localStorage
function printData() {

  // Grab main container
  var containerEl = $(".container-lg");

  // Grab array of time slot DIV elements
  var timeSlots = containerEl.children(".row");

  // For each time slot DIV, capture its 'id' value
  // Then, grab an instance of the child textarea element based on the 'description' class (use array element at 0)
  // Set the textarea element value to the value stored in localStorage whose key is the time slot element ID
  for (var i = 0; i < timeSlots.length; i++) {

    var timeSlotId = timeSlots[i].id;

    var textAreaDescription = $(timeSlots[i]).children(".description")[0];
    // Added line below to convert to jQuery element
    textAreaDescription = $(textAreaDescription);
    
    textAreaDescription.val(localStorage.getItem(timeSlotId));
  }

}