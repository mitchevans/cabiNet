var words = ["Create.", "View.", "Update.", "Remove.", "All it takes is a click!"];
var counter = 0;

setTimeout(display_word, 3000);

$(document).ready(function () {

  // logContainer holds all of our items
  var logContainer = $("#log-container");
  var itemLocationSelect = $("#location");
  var itemFilterSelect = $("#filter");

  // Click events for the edit and delete buttons
  $(document).on("click", ".delete", handleItemDelete);
  $(document).on("click", ".update", handleItemEdit);

  itemLocationSelect.on("change", handleLocationChange);
  itemFilterSelect.on("change", handleFilterChange);


  // This function grabs items from the database and updates the view
  function getItems(location, filter) {
    var locationString = location;
    console.log(locationString);
    var filterString = filter;
    console.log(filterString);
    if (locationString === "" && filterString === "")
      var newURLString = "/api/items/";
    else if (locationString === "" && filterString != "")
      var newURLString = "/api/items/perishables/" + filterString;
    else if (locationString != "" && filterString === "")
      var newURLString = "/api/items/location/all/" + locationString;
    else
      var newURLString = "/api/items/" + locationString + "/" + filterString;
    console.log(newURLString);
    $.get(newURLString, function (data) {
  
      console.log(data);

      displayAll(data);
    });
  }

  // This function does an API call to delete items
  function deleteItem(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/items/" + id
    })
      .then(function () {
        getItems(itemLocationSelect.val());
      });
  }

  getItems(itemLocationSelect.val(), itemFilterSelect.val());

  function displayAll(items) {
    logContainer.empty();
    var note, expirationDate, dateObtained, block1;
    var today = moment().format('YYYY/MM/DD');

    for (let i = 0; i < items.length; i++) {
      if (items[i].perishable) {
        if (items[i].expiration) {
          expirationDate = moment(items[i].expiration_date).format('YYYY/MM/DD');
          dateObtained = "N/A";
          if (expirationDate === today) {
            note = "<td class ='animated pulse infinite'>Expires today!</td>";
            block1 = "<tr class='text-danger font-weight-bold table-danger'>";
          }
          else if (moment().diff(expirationDate) < 1) {
            note = "<td>Expires " + moment(expirationDate).startOf('day').fromNow() + "</td>";
            block1 = "<tr>";
          }
          else if (moment().diff(expirationDate) > 0) {
            note = "<td class ='animated pulse infinite'>Expired " + moment(expirationDate).endOf('day').fromNow() + "</td>";
            block1 = "<tr class='text-danger font-weight-bold table-danger'>";
          }
        } else {
          expirationDate = "N/A";
          dateObtained = moment(items[i].when_obtained).format('YYYY/MM/DD');

          if (dateObtained === today) {
            note = "<td>Obtained today</td>";
            block1 = "<tr>";
          }
          else {
            note = "<td>Obtained " + moment(dateObtained).startOf('day').fromNow() + "</td>";
            if (moment().diff(dateObtained, 'days') > 30)
              block1 = "<tr class='text-danger ont-weight-bold table-danger'>";
            else if (moment().diff(dateObtained, 'days') > 14 && moment().diff(dateObtained, 'days') <= 30) 
              block1 = "<tr class='text-danger  table-warning'>";
            else 
              block1 = "<tr>";
          }
        }
      }
      else {
        expirationDate = "N/A";
        dateObtained = "N/A";
        block1 = "<tr>";
        note = "<td></td>";
      }

      logContainer.append(block1
        + "<td>" + items[i].name + "</td>"
        + "<td>" + expirationDate + "</td>"
        + "<td>" + dateObtained + "</td>"
        + "<td>" + items[i].quantity + " " + items[i].unit_type + "</td>"
        + note
        + "<td><a class='update' href='javascript:void(0)' data-id1='" + items[i].id + "'><i class='fas fa-pencil-alt'></i></a>  <a class='delete' href='javascript:void(0)' data-id2='" + items[i].id + "'><i class='fa fa-trash' style='color: red'></i></a></td>" +
        "</tr>");
    }

    //if ($.fn.DataTable.isDataTable("#table")) {
      //$('#table').DataTable().destroy();
    //}

    $('#table').DataTable({
      scrollY: 400,
      "columnDefs": [
        { "orderable": false, "targets": 3 },
        { "orderable": false, "targets": 4 },
        { "orderable": false, "targets": 5 }
      ]
    });

  }

  // This function figures out which item we want to delete and then calls
  // deleteItem
  function handleItemDelete() {
    var currentItem = $(this).data("id2");
    deleteItem(currentItem);
  }

  // This function figures out which item we want to edit and takes it to the
  // Appropriate url
  function handleItemEdit() {
    var currentItem = $(this).data("id1");
    window.location.href = "/cms?item_id=" + currentItem;
  }

  // This function handles reloading new items when the category changes
  function handleLocationChange() {
    if ($.fn.DataTable.isDataTable("#table")) 
      $('#table').DataTable().clear().destroy();
    var newItemLocation = $(this).val();
    getItems(newItemLocation, itemFilterSelect.val());
  }

  function handleFilterChange() {
    if ($.fn.DataTable.isDataTable("#table")) 
      $('#table').DataTable().clear().destroy();
    var newItemFilter = $(this).val();
    getItems(itemLocationSelect.val(), newItemFilter);
  }


});

function display_word() {
  $("#lead1").text('');
  $("#lead1").text(words[counter]);
  counter++;
  if(counter === words.length)
    counter = 0;
  setTimeout(display_word, 1000);
}
