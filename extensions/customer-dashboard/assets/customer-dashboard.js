
// var hostname = "https://customer-dashboard-letest.fly.dev";
var hostname = "https://de4b-2401-4900-1ca3-53b1-14ca-6bd2-797b-36b1.in.ngrok.io";
Shop_name=window.location.hostname;

// document.addEventListener("DOMContentLoaded", function() {

// });

Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
}, false;
let maincontainer = document.getElementById("shopify-section-header").nextElementSibling;
let beforecontainer = document.getElementById("shopify-section-footer").previousElementSibling;
maincontainer.classList.add('customerdb-parent');
 
beforecontainer.classList.add('customerdb-parent');
/*  Add NewElement BEFORE -OR- AFTER Using the Aforementioned Prototypes */
var NewElement = document.getElementById('customer_dashboard');
NewElement.appendBefore(document.getElementById('shopify-section-footer'));
document.getElementById('shopify-section-footer').style.display = 'initial';
document.getElementById('customer_dashboard').style.display = 'initial';
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
  var hidesection = document.getElementsByClassName("cd_address-section-main");
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
  if (this.classList.contains('cd_menu-child')) {
  var elems = document.querySelectorAll(".cd_active");
  [].forEach.call(elems, function (el) {
    el.classList.remove("cd_active");
  });
  myFunction(this.getAttribute('id'));
  this.classList.add("cd_active");if(this.classList.contains('cd_link'))window.open(this.querySelector('.cd_sidebarlink').href, '_blank');
 }
};

for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', toactive, false);
}
function myFunction(a) {
  var divsToHide = document.getElementsByClassName("cd_main-section");
  var page = a;
  if(page)window.history.replaceState(null, null, '?a=' + page);
  else if(!page)page="cd_my-profile"
  for (var i = 0; i < divsToHide.length; i++) {
    if(divsToHide[i].getAttribute('id')===page)divsToHide[i].style.display = "block";
    else divsToHide[i].style.display = "none";
  }
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
    array[pair[0]] +=','+pair[1];
  }  
  fetch(`${hostname}/api/post-customer-data?shop=${Shop_name}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(array).replace(/undefined,/g, "")
  }).then(res => {
    if (res.status == 200) {
      success_message.classList.add('cd_show');
      location.replace("/account?a=my-profile");
    }
  });
});


function cd_logout(){
  window.location.href = "/account/logout";
  var REDIRECT_PATH = "/account/login";
  var logoutBtn = document.querySelector('a[href^="/account/logout"]');
  fetch(logoutBtn.href).then(() => window.location.href = REDIRECT_PATH);
}

document.querySelector(".cd_redirect_address").addEventListener("click", function () {
  window.location.href = "/account/addresses";
  var REDIRECT_PATH = "/account?a=cd_addresses";
  var addresses = document.querySelector('a[href^="/account/addresses"]');
  fetch(addresses.href).then(() => window.location.href = REDIRECT_PATH);
});


document.querySelector(".cd_backFunction").addEventListener("click", function (e) {
  myFunction('cd_my-profile');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});
document.querySelector(".cd_backContact").addEventListener("click", function (e) {
  myFunction('cd_orders');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});
document.querySelector(".cd_backAddress").addEventListener("click", function (e) {
  myFunction('cd_addresses');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
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
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}


document.querySelector("#cd_change_password_form").addEventListener("submit", function (e) {
  e.preventDefault();
  var cd_length_char = document.querySelector(".cd_length_char");
  var cd_not_same = document.querySelector(".cd_not_same");
  var success_message = document.getElementById('cd_success_message_password');
  var formData = new FormData(this);
  var array = {};
  for (var pair of formData.entries()) {
    array[pair[0]] = pair[1];
  }
  if (array.password === array.passwordConfirmation) {
    if(array.password.length > 7){
      fetch(`${hostname}/api/post-customer-password?shop=${Shop_name}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(array)
      }).then(res => {
        if (res.status == 200) {
          success_message.classList.add('cd_show');
          window.location.href="/account/login";
        }
      });
    }else{
      cd_length_char.style.color = 'red';
      cd_length_char.classList.remove('cd_length_char');
    }
  } else {
    cd_not_same.style.color="red";
    cd_not_same.classList.remove('cd_not_same');

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