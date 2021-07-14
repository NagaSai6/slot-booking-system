import axios from "axios";
import toastr from "toastr";

$(function () {
  let starttimeOptions = {
    vibrate: true,
    donetext: "Done",
    placement: "bottom",
    default: "now",
    align: "right",
    autoclose: true,
  };
  let endtimeOptions = {
    vibrate: true,
    donetext: "Done",
    placement: "bottom",
    align: "left",
    autoclose: true,
  };
  let datepickerOptions = {
    dateFormat: "dd-mm-yy",
    minDate: new Date(),
    maxDate: "+1m",
  };

  $("#datepicker").datepicker(datepickerOptions);
  $("#endtime").clockpicker(endtimeOptions);
  $("#starttime").clockpicker(starttimeOptions);
});

$("#availabilityCheckForm").on("submit", (e) => {
  e.preventDefault();
  let element = document.getElementById("attach-available-items");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  collectDataFromForm();
});

function collectDataFromForm() {
  window.queryCategory = $("#searchInput").val();
  window.queryDate = $("#datepicker").val();
  window.queryStart = $("#starttime").val();
  window.queryEnd = $("#endtime").val();

  let queryObject = {
    queryCategory: queryCategory,
    queryDate: queryDate,
    queryStart: queryStart,
    queryEnd: queryEnd,
  };

  axios.post("/user/check-availability", queryObject).then((res) => {
    let data = JSON.parse(res.data.message);
    console.log(data);
  
    let parentDiv = document.getElementById("attach-available-items");
    for (let i = 0; i < data.length; i++) {
      let divElement = document.createElement("div");
      let anchorElement = document.createElement("button");
      //  anchorElement.setAttribute("onclick",initBook(this));
      anchorElement.setAttribute("data-instrument", JSON.stringify(data[i]));
      anchorElement.className = "btn btn-md btn-success bookingBuuton";
      anchorElement.id = data[i].instrumentName;
      anchorElement.href = "#";
      anchorElement.innerHTML = data[i].instrumentName;
      divElement.className = "col my-2 instrument-div";
      divElement.appendChild(anchorElement);
      parentDiv.appendChild(divElement);
    }
    let target = $("#attach-available-items");
    if (target.length) {
      $("html,body").animate(
        {
          scrollTop: target.offset().top,
        },
        1000
      );
      return false;
    }
  });
}

$("#attach-available-items").on("click", "button", function (e) {
 let dataOfInstrument = JSON.parse(this.dataset.instrument);
 initBook(dataOfInstrument,queryDate,queryStart,queryEnd);
});

function initBook(d,qd,qs,qe){
   d.queryDate = qd;
   d.queryStart = qs;
   d.queryEnd = qe ;

  //  console.log(d);
  axios.post("/user/book-instrument",d).then(res=>{
    let parsedResponse = res.data.message;
    console.log(parsedResponse);
    if(parsedResponse === "Successfully Booked"){
      toastr.options.closeButton=false;
      toastr.options.progressBar=true;
      toastr.options.positionClass="toast-top-right";
      toastr.options.showDuration=300;
      toastr.options.hideDuration=1000;
      toastr.options.timeOut=5000;
      toastr.options.extendedTimeOut=1000;
      toastr.options.hideEasing="linear";

      return toastr["success"]("Instrument Successfully booked ,Check your Inbox", "Success");
    }else{
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      } ;
     return toastr["error"]("You could have been faster , This item has booked just now", "Oops")
    }
  })
}