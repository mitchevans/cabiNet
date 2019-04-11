var words = ["Create.", "View.", "Update.", "Remove.", "All it takes is a click!"];
var counter = 0;

setTimeout(display_word, 3500);

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

  var items;


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
      items = data;
      console.log(items);
      logContainer.empty();

      displayAll();
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

  function displayAll() {
    //logContainer.empty();
    var note, expirationDate, dateObtained, block1;
    var today = moment().format('MM/DD/YY');
    for (let i = 0; i < items.length; i++) {
      if (items[i].perishable) {
        if (items[i].expiration) {
          expirationDate = items[i].expiration_date;
          dateObtained = items[i].when_obtained;
          if (expirationDate == today) {
            note = "Expires today!";
            block1 = "<td class='animated pulse infinite text-danger font-weight-bold'>" + note + "</td>";
          }
          else if (moment().diff(expirationDate) < 1) {
            note = "Expires " + moment(expirationDate).startOf('day').fromNow();
            block1 = "<td>" + note + "</td>";
          }
          else if (moment().diff(expirationDate) > 0) {
            note = "Expired " + moment(expirationDate).endOf('day').fromNow();
            block1 = "<td class='animated pulse infinite text-danger font-weight-bold'>" + note + "</td>";
          }
        } else {
          expirationDate = "";
          dateObtained = items[i].when_obtained;
          note = "Obtained " + moment(dateObtained).endOf('day').fromNow();
          if (moment(dateObtained).endOf('day').fromNow() > 30) {
            block1 = "<td class='animated pulse infinite text-danger font-weight-bold'>" + note + "</td>";
          } else if (moment(dateObtained).endOf('day').fromNow() > 14 && moment(dateObtained).endOf('day').fromNow() <= 30) {
            block1 = "<td class='text-white bg-warning'>" + note + "</td>";
          } else
            block1 = "<td>" + note + "</td>";
        }
      }
      else {
        expirationDate = "";
        dateObtained = "";
        block1 = "<td></td>";
      }

      logContainer.append("<tr>"
        + "<td>" + items[i].name + "</td>"
        + "<td>" + expirationDate + "</td>"
        + "<td>" + dateObtained + "</td>"
        + "<td>" + items[i].quantity + " " + items[i].unit_type + "</td>"
        + block1
        + "<td><a class='update' href='javascript:void(0)' data-id1='" + items[i].id + "'><i class='fas fa-pencil-alt'></i></a>  <a class='delete' href='javascript:void(0)' data-id2='" + items[i].id + "'><i class='fa fa-trash'></i></a></td>" +
        "</tr>");
    }
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
    var newItemLocation = $(this).val();
    getItems(newItemLocation, itemFilterSelect.val());
  }

  function handleFilterChange() {
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
  setTimeout(display_word, 1500);
}