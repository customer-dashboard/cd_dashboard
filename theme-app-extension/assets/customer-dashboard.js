
var hostname = "https://customer-dashboard-pro.fly.dev";
Shop_name = window.location.hostname;
var mainContentClass = document.getElementsByClassName("main-content")[0]
var mainClass = document.getElementsByClassName("main")[0]
var mainTag = document.getElementsByTagName("main")[0]
var cd_main = document.getElementsByClassName("cd_main")[0]
var mainId = document.querySelector("#main")
var MainContent = document.querySelector("#MainContent")
var nt_content = document.querySelector("#nt_content");
if (cd_main || mainContentClass || mainClass || mainTag || mainId || nt_content || MainContent) {
  var maincontainer = cd_main || mainContentClass || mainClass || mainTag || mainId || nt_content || MainContent;
  maincontainer.classList.add('customerdb-parent');
  var NewElement = document.getElementById('customer_dashboard');
  maincontainer.prepend(NewElement);
}
window.onload = function () {
  if (document.getElementsByClassName('nav-menu')[0]) document.getElementsByClassName('nav-menu')[0].scrollLeft = 0;
  var menus = document.getElementsByClassName('nav-menu__item');
  for (var i = 0; i < menus.length; i++) {
    if (menus[i].classList.contains('cd_active')) {
      document.getElementsByClassName('nav-menu')[0].scrollLeft = menus[i].offsetLeft;
    }
  }
}

fetch(`${hostname}/api/get-billing-frontend?shop=${Shop_name}`)
  .then((response) => response.json())
  .then((res) => {
    if (res.status == 200) {
      var billing = res.data?.billing;
      var customer_count = res.data?.customer_count;
      if (billing && billing.status != "active" && customer_count > 1500) {
        fetch(`${hostname}/api/get-setting?shop=${Shop_name}`)
          .then((response) => response.json())
          .then((content) => {
            var data = JSON.parse(content.data[0].value);
            data.app_access_toggle = false;
            InstallMetafields(`${hostname}/api/set-setting?shop=${Shop_name}`, data);
          })
      }
    }
  });


function InstallMetafields(path, data) {
  fetch(path, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    console.log(res);
  })
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
    var param = this.getAttribute('id');
    if (param !== "link") myFunction(param);
    if (!param)
      myFunction("cd_my-profile");
    this.classList.add("cd_active"); if (this.classList.contains('cd_link')) window.open(this.querySelector('.cd_sidebarlink').href, '_blank');
  }
};

for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', toactive, false);
}
function myFunction(page) {
  var divsToHide = document.getElementsByClassName("cd_main-section");
  window.history.replaceState(null, null, '?a=' + page);
  for (var i = 0; i < divsToHide.length; i++) {
    if (divsToHide[i].getAttribute('id') === page) {
      divsToHide[i].style.display = "block";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    else divsToHide[i].style.display = "none";
  }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams) {
  var param = urlParams.get('a');
  if (!param) param = "cd_my-profile";
  var cd_active = document.querySelector("#" + param);
  if (param === "cd_contact") cd_active = document.querySelector("#cd_orders");
  else if (param === "cd_edit-profile") cd_active = document.querySelector("#cd_my-profile");
  else if (param === "cd_add-address") cd_active = document.querySelector("#cd_addresses");
  cd_active.classList.add("cd_active");
  document.getElementsByClassName("cd_main-content").onload = myFunction(param);
}


//post api
document.querySelector("#cd_form_customer").addEventListener("submit", function (e) {
  e.preventDefault();
  var cd_update_profile = document.querySelector(".cd_update_profile");
  var cd_submit_data = cd_update_profile.querySelector(".cd_submit_data");
  var cd_submit_loader = cd_update_profile.querySelector(".cd_submit_loader");
  var success_message = document.getElementById('cd_success_message');
  var validation_phone = document.querySelector(".validation_phone");
  var formData = new FormData(this);
  var array = {};
  for (var pair of formData.entries()) {
    array[pair[0]] += ',' + pair[1];
  }
  var phone_length = array.phone.replace(/undefined,/g, "");
  var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
if(phoneno.test(phone_length)||phone_length.length==0){
  function myGreeting() {
    location.replace("/account?a=cd_my-profile");
  }
  cd_submit_data.classList.add('cd_none');
  cd_submit_loader.classList.remove('cd_none');
  fetch(`${hostname}/api/post-customer-data?shop=${Shop_name}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(array).replace(/undefined,/g, "")
  }).then(res => {
    if (res.status == 200) {
      success_message.classList.add('cd_show');
      cd_submit_data.classList.remove('cd_none');
      cd_submit_loader.classList.add('cd_none');
      setTimeout(myGreeting, 1000);
    }
  });
}else{
  validation_phone.classList.add('cd_error');
}
});


function cd_logout() {
  window.location.href = "/account/logout";
  var REDIRECT_PATH = "/account/login";
  var logoutBtn = document.querySelector('a[href^="/account/logout"]');
  fetch(logoutBtn.href).then(() => window.location.href = REDIRECT_PATH);
}

document.querySelector(".cd_add_address").addEventListener("submit", function () {
  var REDIRECT_PATH = "/account?a=cd_addresses";
  var cd_create_address = document.querySelector(".cd_create_address");
  var cd_submit_data = cd_create_address.querySelector(".cd_submit_data");
  var success_message = document.getElementById('cd_success_message_address_create');
  var cd_submit_loader = cd_create_address.querySelector(".cd_submit_loader");
  var addresses = this.action;
  cd_submit_data.classList.add('cd_none');
  cd_submit_loader.classList.remove('cd_none');
  fetch(addresses.href).then(() =>{
    success_message.classList.add('cd_show');
    cd_submit_data.classList.remove('cd_none');
    cd_submit_loader.classList.add('cd_none');
    window.location.href = REDIRECT_PATH;
  });
});

var cd_address_edit = document.getElementsByClassName("cd_address_edit");
for (var i = 0; i < cd_address_edit.length; i++) {
  cd_address_edit[i].addEventListener('submit', function () {
  var REDIRECT_PATH = "/account?a=cd_addresses";
  var cd_update_address = document.querySelector(".cd_update_address");
  var cd_submit_data = cd_update_address.querySelector(".cd_submit_data");
  var success_message = document.getElementById('cd_success_message_address_update');
  var cd_submit_loader = cd_update_address.querySelector(".cd_submit_loader");
  var addresses = this.action;
  cd_submit_data.classList.add('cd_none');
  cd_submit_loader.classList.remove('cd_none');
  fetch(addresses).then(() =>{
    success_message.classList.add('cd_show');
    cd_submit_data.classList.remove('cd_none');
    cd_submit_loader.classList.add('cd_none');
    window.location.href = REDIRECT_PATH;
  });
  }, false);
}


document.querySelector(".cd_backFunction").addEventListener("click", function (e) {
  myFunction('cd_my-profile');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

document.querySelector(".cd_backContact").addEventListener("click", function (e) {
  myFunction('cd_orders');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

var cd_backFunction = document.getElementsByClassName("cd_backAddress")
for (var i = 0; i < cd_backFunction.length; i++) {
  cd_backFunction[i].addEventListener("click", function () {
    myFunction('cd_addresses');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
}



var cd_delete_button = document.getElementsByClassName("cd_delete_address");
for (var i = 0; i < cd_delete_button.length; i++) {
  cd_delete_button[i].addEventListener("submit", function () {
    var REDIRECT_PATH = "/account?a=cd_addresses";
    var cd_delete_address = this.querySelector(".cd_delete-button");
    var cd_submit_data = cd_delete_address.querySelector(".cd_submit_data");
    var cd_success_message_confirm_delete_address = document.getElementById('cd_success_message_confirm_delete_address');
    var success_message = document.getElementById('cd_success_message_delete_update');
    var cd_submit_loader = cd_delete_address.querySelector(".cd_delete_this_address");
    var addresses = this.action;
    cd_submit_data.classList.add('cd_none');
    cd_submit_loader.classList.remove('cd_none');
    if (confirm(cd_success_message_confirm_delete_address.innerHTML) == true) {
    fetch(addresses).then(() =>{
      success_message.classList.add('cd_show');
      cd_submit_data.classList.remove('cd_none');
      cd_submit_loader.classList.add('cd_none');
      window.location.href = REDIRECT_PATH;
    });
  }
  })
}

var cd_make_default_address = document.getElementsByClassName("cd_make_default_address");
for (var i = 0; i < cd_make_default_address.length; i++) {
  cd_make_default_address[i].addEventListener("submit", function () {
    var REDIRECT_PATH = "/account?a=cd_addresses";
    var success_message = document.getElementById('cd_success_message_make_default_address');
    var addresses = this.action;
    fetch(addresses).then(() =>{
      success_message.classList.add('cd_show');
      window.location.href = REDIRECT_PATH;
    });
  })
}

document.querySelector("#cd_change_password_form").addEventListener("submit", function (e) {
  e.preventDefault();
  var cd_length_char = document.querySelector(".cd_length_char");
  var cd_not_same = document.querySelector(".cd_not_same");
  var cd_change_password = document.querySelector(".cd_change_password");
  var cd_submit_data = cd_change_password.querySelector(".cd_submit_data");
  var cd_submit_loader = cd_change_password.querySelector(".cd_submit_loader");
  var success_message = document.getElementById('cd_success_message_password');
  var formData = new FormData(this);
  var array = {};
  for (var pair of formData.entries()) {
    array[pair[0]] = pair[1];
  }
  if (array.password === array.passwordConfirmation) {
    function myGreeting() {
      window.location.href = "/account/login";
    }
    if (array.password.length > 7) {
      cd_submit_data.classList.add('cd_none');
      cd_submit_loader.classList.remove('cd_none');
      fetch(`${hostname}/api/post-customer-password?shop=${Shop_name}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(array)
      }).then(res => {
        if (res.status == 200) {
          success_message.classList.add('cd_show');
          cd_submit_data.classList.remove('cd_none');
          cd_submit_loader.classList.add('cd_none');
          setTimeout(myGreeting, 2000);
        }
      });
    } else {
      cd_length_char.classList.add('cd_error'); cd_not_same.classList.remove('cd_error');
    }
  } else {
    cd_not_same.classList.add('cd_error'); cd_length_char.classList.remove('cd_error');

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
if (contact_posted == "yes") {
  var cd_success_message_contact = document.querySelector("#cd_success_message_contact");
  setTimeout(function () {
    cd_success_message_contact.classList.add('cd_show');
  }, 1000);

  setTimeout(function () {
    cd_success_message_contact.classList.remove('cd_show');
  }, 3000);
  localStorage.removeItem("contact_posted");
}