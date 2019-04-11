$(document).ready(function() {
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var url = window.location.search;
  var itemId;
  // Sets a flag for whether or not we're updating an item to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the item id from the url
  // In localhost:8080/cms?post_id=1, postId is 1
  if (url.indexOf("?item_id=") !== -1) {
    itemId = url.split("=")[1];
    getItemData(itemId);
  }

  // Getting jQuery references to the item selection form
  var cmsForm = $("#cms");
  var nameInput = $("#name");
  var categoryInput = $("#category");
  var itemLocationSelect = $("#location");
  var itemPerishableSelect = $("#perishable");
  var itemExpiresSelect = $("#expires");
  var expirationInput = $("#expiration");
  var dateObtainedInput = $("#date_obtained");
  var quantityInput = $("#quantity");
  var unitTypeInput = $("#unit_type");

  // Giving the itemCategorySelect a default value
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the item if we are missing a name and a location
    if (!nameInput.val().trim() || !itemLocationSelect.val()) {
      return;
    }
    // Constructing a newItem object to hand to the database
    var newItem = {
      name: nameInput.val().trim(),
      category: categoryInput.val().trim(),
      location: itemLocationSelect.val(),
      perishable: itemPerishableSelect.val(),
      expiration: itemExpiresSelect.val(),
      expiration_date: expirationInput.val().trim(),
      when_obtained: dateObtainedInput.val().trim(),
      quantity: parseInt(quantityInput.val().trim()),
      unit_type: unitTypeInput.val().trim()    
    };

    console.log(newItem);

    // If we're updating a item run updateItem to update an item
    // Otherwise run submitItem to create a new item
    if (updating) {
      newItem.id = itemId;
      updateItem(newItem);
    }
    else {
      submitItem(newItem);
    }
  });

  // Submits a new item and brings user to log page upon completion
  function submitItem(Item) {
    $.post("/api/items/", Item, function() {
      window.location.href = "/log";
    });
  }

  // Gets item data for an item if we're editing
  function getItemData(id) {
    $.get("/api/items/" + id, function(data) {
      if (data) {
        console.log(data);
        // If this item exists, prefill our cms forms with its data
        if(data.perishable) {
          $('input[name=perishable]').attr('checked', true);
          itemPerishableSelect.attr('value', true);
          itemExpiresSelect.attr('disabled', false);
        } 
        if(data.expiration) {
          $('input[name=expiration]').attr('checked', true);
          itemExpiresSelect.attr('value', true);
          expirationInput.attr('disabled', false);
        }            
        nameInput.val(data.name);
        categoryInput.val(data.category);
        itemLocationSelect.val(data.location); 
        dateObtainedInput.val(data.when_obtained); 
        expirationInput.val(data.expiration_date);      
        quantityInput.val(data.quantity);
        unitTypeInput.val(data.unit_type);
                
        // If we have a item with this id, set a flag for us to know to update the item
        // when we hit submit
        updating = true;
        console.log(updating);
      }
    });
  }

  // Update a given item, bring user to the log page when done
  function updateItem(item) {
    $.ajax({
      method: "PUT",
      url: "/api/items",
      data: item
    })
      .then(function() {
        window.location.href = "/log";
      });
  }
});


function toggle(checkboxID, toggleID2) {
  var checkbox = document.getElementById(checkboxID);
  updatecheckbox = checkbox.checked ? checkbox.value=true : checkbox.value=false;
  var toggle2 = document.getElementById(toggleID2);
  updateToggle2= checkbox.checked ? toggle2.disabled=false : toggle2.disabled=true;
}
