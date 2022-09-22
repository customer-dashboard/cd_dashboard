let maincontainer = document.getElementById("shopify-section-header").nextElementSibling;
let beforecontainer = document.getElementById("shopify-section-footer").previousElementSibling;

var fragment = document.createDocumentFragment();
fragment.appendChild(document.getElementById('customer_dashboard'));
maincontainer.appendChild(fragment);
maincontainer.classList.add('customerdb-parent');

fragment.appendChild(document.getElementById('customer_dashboard'));
beforecontainer.appendChild(fragment);
beforecontainer.classList.add('customerdb-parent');

document.getElementById('customer_dashboard').removeAttribute("style");

window.onload = function () {
  if (document.getElementsByClassName('nav-menu')[0]) document.getElementsByClassName('nav-menu')[0].scrollLeft = 0;
  var menus = document.getElementsByClassName('nav-menu__item');
  for (var i = 0; i < menus.length; i++) {
    if (menus[i].classList.contains('cd_active')) {
      document.getElementsByClassName('nav-menu')[0].scrollLeft = menus[i].offsetLeft;
    }
  }
}


 




function editToggle(id) {
  var divsToHide = document.getElementsByClassName("cd_address_edit");
  var heading1 = document.getElementById("cd_address_heading_1");
  var hidesection = document.getElementsByClassName("cd_address-section-main");
  var address_heading_2 = document.getElementsByClassName("cd_address_heading_2");
  for (var i = 0; i < divsToHide.length; i++) {
    if (divsToHide[i].id == id) {
      divsToHide[i].classList.toggle("cd_hide");
      hidesection[0].classList.add("cd_hide");
    }
    else {
      divsToHide[i].classList.add("cd_hide");
    }
  }
}



function accordion(id, btnId) {
  var btn = document.getElementById(btnId);
  var panel = document.getElementById(id);
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
    btn.innerHTML = `<span>View Details</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="10" viewBox="0 0 20 12" fill="none">
      <path d="M1 1.57916L9.80141 10.3806L18.5478 1.63417" stroke="#202020" stroke-width="2"/>
      </svg>`;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    btn.innerHTML = `<span>Hide Details</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="10" viewBox="0 0 20 12" fill="none">
      <path d="M18.5479 10.8014L9.74644 1.99998L1.00005 10.7464" stroke="#202020" stroke-width="2"/>
      </svg>`;
  }
}


var elements = document.getElementsByClassName("cd_menu-child");
var toactive = function () {
  var elems = document.querySelectorAll(".cd_active");
  [].forEach.call(elems, function (el) {
    el.classList.remove("cd_active");
  });
  this.className = "cd_active";
};

for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', toactive, false);
}


function myFunction(a) {
  let value_return;
  var profile_page = document.getElementById("cd_profile_page");
  var edit_profile_page = document.getElementById("cd_edit_profile_page");
  var contact = document.getElementById("cd_contact_page");
  var orders_page = document.getElementById("cd_orders_page");
  var addresses_page = document.getElementById("cd_addresses_page");
  var add_address_page = document.getElementById("cd_add_address_page");
  var privacy_policy_page = document.getElementById("cd_privacy_policy_page");
  var change_password_page = document.getElementById("cd_change_password_page");
  var return_policy_page = document.getElementById("cd_return_policy_page");
  var logout = document.getElementById("cd_logout_page");
  switch (a) {
    case "edit-profile":
      value_return = edit_profile_page;
      break;
    case "my-profile":
      value_return = profile_page;
      break;
    case "orders":
      value_return = orders_page;
      break;
    case "address":
      value_return = addresses_page;
      break;
    case "change-password":
      value_return = change_password_page;
      break;
    case "privacy-policy":
      value_return = privacy_policy_page;
      break;
    case "logout":
      value_return = logout;
      break;
    case "add-address":
      value_return = add_address_page;
      break;
    case "contact":
      value_return = contact;
      break;
    case "return-policy":
      value_return = return_policy_page;
      break;
    default:
      value_return = profile_page;
  }
  var divsToHide = document.getElementsByClassName("cd_main-section"); //divsToHide is an array
  for (var i = 0; i < divsToHide.length; i++) {
    divsToHide[i].style.display = "none";
  }
  if(a){
    window.history.replaceState(null, null, '?a=' + a);
  }else{
    window.history.replaceState(null, null, '?a=my-profile');
  }
  var elems = document.querySelector("."+a).classList.add('cd_active');
  value_return.style.display = "block";
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams) {
  const a = urlParams.get('a')
  document.getElementsByClassName("cd_main-content").onload = myFunction(a);
}

//post api
document.querySelector("#cd_form_customer").addEventListener("submit", function (e) {
  e.preventDefault();
  var loader = document.getElementById('cd_submit_loader');
  var success_message = document.getElementById('cd_success_message');
  loader.innerHTML = "<div class='cd_loader'></div>";
  var formData = new FormData(this);
  var array = {};
  for (var pair of formData.entries()) {
    array[pair[0]] = pair[1];
  }
  fetch("https://mandasa.herokuapp.com/api/post-customer-data?shop=electronicbiz.myshopify.com", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(array)
  }).then(res => {
    if (res.status == 200) {
      success_message.classList.add('cd_show');
      location.replace("/account?a=my-profile");
    }
  });
});


document.querySelector(".cd_logout").addEventListener('click', function () {
  window.location.href = "/account/logout";
  var REDIRECT_PATH = "/account/login";
  var logoutBtn = document.querySelector('a[href^="/account/logout"]');
  fetch(logoutBtn.href).then(() => window.location.href = REDIRECT_PATH);
});



document.querySelector(".cd_backFunction").addEventListener("click", function (e) {
  myFunction('my-profile');
});
document.querySelector(".cd_backContact").addEventListener("click", function (e) {
  myFunction('orders');
});
document.querySelector(".cd_backAddress").addEventListener("click", function (e) {
  myFunction('address');
});
function backFunction() {
  var hidesection = document.getElementsByClassName("cd_address-section-main");
  var divsToHide = document.getElementsByClassName("cd_address_edit");
  var heading1 = document.getElementById("cd_address_heading_1");
  var address_heading_2 = document.getElementsByClassName("cd_address_heading_2");

  heading1.style.display = "block";
  hidesection[0].classList.remove("cd_hide");

  for (var i = 0; i < divsToHide.length; i++) {
    divsToHide[i].classList.add("cd_hide");
  }
}


document.querySelector("#cd_change_password_form").addEventListener("submit", function (e) {
  e.preventDefault();
  var div = document.getElementById("cd_return_message");
  var loader = document.getElementById('cd_submit_loader');
  var success_message = document.getElementById('cd_success_message_password');
  loader.innerHTML = "<div class='cd_loader'></div>";
  var formData = new FormData(this);
  var array = {};
  for (var pair of formData.entries()) {
    array[pair[0]] = pair[1];
  }
  if (array.password === array.passwordConfirmation) {
    if(array.password.length > 7){
      fetch("https://mandasa.herokuapp.com/api/post-customer-password?shop=electronicbiz.myshopify.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(array)
      }).then(res => {
        if (res.status == 200) {
          // div.style.color = 'green';
          // div.innerHTML = 'Your password has been changed.';
          success_message.classList.add('cd_show');
          window.location.href="/account/login";
        }
      });
    }else{
      div.style.color = 'red';
      div.innerHTML = 'Your password must be at least 8 characters';
    }
  } else {
    div.style.color = 'red';
    div.innerHTML = 'password does not match !!';
  }
});


var elements = document.getElementsByClassName("cd_reorder");
var cd_order_variant = document.getElementsByClassName("cd_order_variant");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', function (event) {
    var reorder_id = event.target.getAttribute('reorder_id');
    const items = [];
    for (let index = 0; index < cd_order_variant.length; index++) {
      let element = cd_order_variant[index];
      let id = element.getAttribute("id");
      if (id === reorder_id) {
        let variant_id = element.getAttribute("variant_id");
        // const items = 
        var item = {
          quantity: 1,
          id: variant_id
        };
        items.push(item)
      }
    }
    fetch('/cart/add.js', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items }),
    }).then(res => {
      console.log("Request complete! response:", res);
    });
  }, false);
}

var contact_posted = localStorage.getItem("contact_posted");
if(contact_posted == "yes"){
  var cd_success_message_contact = document.querySelector("#cd_success_message_contact");
  setTimeout(function() {
    cd_success_message_contact.classList.add('cd_show');
  }, 1000);
  
  setTimeout(function() {
    cd_success_message_contact.classList.remove('cd_show');
  }, 3000);
  localStorage.removeItem("contact_posted");
}