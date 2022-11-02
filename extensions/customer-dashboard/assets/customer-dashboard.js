
// var hostname = "https://customer-dashboard-pro.fly.dev";
var hostname = "https://0157-2401-4900-1ca3-c4ee-597e-bd87-4b66-3c3d.in.ngrok.io";
Shop_name=window.location.hostname;
Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
}, false;
let maincontainer = document.getElementById("shopify-section-header").nextElementSibling;
let beforecontainer = document.getElementById("shopify-section-footer").previousElementSibling;

// var fragment = document.createDocumentFragment();
// fragment.appendChild(document.getElementById('customer_dashboard'));
// maincontainer.appendChild(fragment);
maincontainer.classList.add('customerdb-parent');
 
// setTimeout( () => { // for demo

//   maincontainer.querySelectorAll( "body *:not( #customer_dashboard )" )
//     .forEach( ( v ) => {
//       if ( !v.querySelector( "#customer_dashboard" ) ) {
//         v.classList.add( "hidden" );
//       }
//     } );

// }, 1000 );

//fragment.appendChild(document.getElementById('customer_dashboard'));
//beforecontainer.appendChild(fragment);
beforecontainer.classList.add('customerdb-parent');
/*  Add NewElement BEFORE -OR- AFTER Using the Aforementioned Prototypes */
var NewElement = document.getElementById('customer_dashboard');
NewElement.appendBefore(document.getElementById('shopify-section-footer'));
document.getElementById('shopify-section-footer').style.display = 'initial';
document.getElementById('customer_dashboard').style.display = 'initial';
document.getElementById('customer_dashboard').removeAttribute("style");

document.addEventListener("DOMContentLoaded", function() {
  getSetting();
  getMenus();
  getAdditionalData();
  editProfileFields();
 });


 function getTranslation() {
  fetch(`${hostname}/api/get-json?shop=${Shop_name}&theme_id=${themeId}&locale=${defaultLanguage}`, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => response.json())
  .then(async (data) => {
    data.map((ele)=>{
      document.body.innerHTML = document.body.innerHTML.replaceAll(ele.heading,ele.value);
    })
  });
 }
 
 function getMenus() {
  var cd_active_ul =  document.querySelector('.cd_active_ul');
  const cd_logout = cd_active_ul.innerHTML;
   fetch(`${hostname}/api/get-menu_builder?shop=${Shop_name}`, {
     method: "GET",
     headers: { 'Content-Type': 'application/json' },
   }).then((response) => response.json())
   .then(async (data) => {
     let li_menu = "";
     var result = JSON.parse(data[0].fields);
     for (let i = 0; i < result.length; i++) {
      var link = `<a id="cd_sidebarlink">${result[i].label.charAt(0).toUpperCase() + result[i].label.slice(1)}</a>`;
      var newClass = "";
      var dataType = result[i].type;
      if(dataType==="link"){
        newClass="cd_link";
        link = `<a class="cd_sidebarlink" href=${result[i].value} target="_blank">${result[i].label.charAt(0).toUpperCase() + result[i].label.slice(1)}</a>`;
       }  
       if(dataType==="page"){
        newClass="cd_page";
        link = `<a class="cd_sidebarlink" href=${'https://'+Shop_name+"/pages/"+result[i].value} target="_blank">${result[i].label.charAt(0).toUpperCase() + result[i].label.slice(1)}</a>`;
       }  
       li_menu += `<li class="cd_menu-child ${newClass}" id=${dataType}>
       ${
         await fetch(`${hostname}/api/get-svg`)
           .then((response_svg) => response_svg.json())
           .then((res_svg)=>{
             for (let index = 0; index < res_svg.length; index++) {
               if(res_svg[index].id===parseInt(result[i].svg)&&dataType!=="link"){
                return res_svg[index].svg;
               }
               if(dataType==="link"){
                return res_svg[2].svg;
               }  
             }
           })
       }
       ${link}
     </li>`;
     }
     cd_active_ul.innerHTML= li_menu;
     cd_active_ul.innerHTML+= cd_logout;
     getTranslation();
   }
   );
 }


 function removeLineBreak(str){
  return str.replaceAll(/""/g,'"');
}

 
 function getSetting(){
  fetch(`${hostname}/api/get-setting?shop=${Shop_name}`, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => response.json())
  .then(async (data) => {
    var res = data[0].setting;
      if(res){
        res = JSON.parse(removeLineBreak(res));
        if(res.custom_css){
          var head = document.getElementsByTagName('HEAD')[0];
          var sheet = document.createElement('style')
          sheet.innerHTML=res.custom_css;
          head.appendChild(sheet);
        }
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        for (const prop in res) {
        rs.getPropertyValue('--'+prop)
        if(prop==='sidebar_heading_size'||prop==='sidebar_menu_size'||prop==='main_content_text_size'||prop==='main_content_heading_size'){
          r.style.setProperty('--'+prop,res[prop]+'px');
        }else{
          r.style.setProperty('--'+prop,res[prop]);
        }
        }
      }
    
  });
}

 async function getAdditionalData(){
  const urls = [`${hostname}/api/get-profile-fields?shop=${Shop_name}`,
  `${hostname}/api/get-profile-additional-metafields?id=${customerVarOnLoad}&shop=${Shop_name}`
];
  try{
    let res = await Promise.all(urls.map(e => fetch(e)))
    let resJson = await Promise.all(res.map(e => e.text()))
    var metafield_data = resJson[1]!==""?JSON.parse(JSON.parse(resJson[1]).value):[];
    var cd_all_fields = document.getElementsByClassName("cd_all_fields")[0];
      var all_fields = JSON.parse(JSON.parse(resJson[0])[0].fields)
    for (var i = 0; i < all_fields.length; i++) {
      const label_name = all_fields[i].name;
      var profile_value="";
      if(label_name==='email')profile_value=customerEmailOnload;
      else if(label_name==='first_name')profile_value=customerFirstNameOnload;
      else if(label_name==='last_name')profile_value=customerLastNameOnload;
      else if(label_name==='phone')profile_value=customerPhoneOnload;
        Object.entries(metafield_data).forEach((entry) => {
          const [key, value] = entry;
          if(key===label_name&&label_name!=='email'&&label_name!=='first_name'&&label_name!=='last_name'&&label_name!=='phone'){
            profile_value=value;
          }
        });
      cd_all_fields.innerHTML += `<div class="cd_row"><div class="cd_col-05"><label for="fname">${all_fields[i].label}:</label></div><div class="cd_col-26"><p>${profile_value}</p></div></div>`;
    }
  }catch(err) {
    console.log(err)
  }
}


async function editProfileFields() {
  const urls = [`${hostname}/api/get-profile-fields?shop=${Shop_name}`,
  `${hostname}/api/get-profile-additional-metafields?id=${customerVarOnLoad}&shop=${Shop_name}`
];
  try {
    let res = await Promise.all(urls.map(e => fetch(e)))
    let resJson = await Promise.all(res.map(e => e.text()))
  var all_edit_fields = document.getElementsByClassName("all_edit_fields")[0];
  var metafield_data = resJson[1]!==""?JSON.parse(JSON.parse(resJson[1]).value):[];
    var all_fields = JSON.parse(JSON.parse(resJson[0])[0].fields)
    for (var i = 0; i < all_fields.length; i++) {
      const label_name = all_fields[i].name;
      var profile_value="";
      if(label_name==='email')profile_value=customerEmailOnload;
      else if(label_name==='first_name')profile_value=customerFirstNameOnload;
      else if(label_name==='last_name')profile_value=customerLastNameOnload;
      else if(label_name==='phone')profile_value=customerPhoneOnload;
      Object.entries(metafield_data).forEach((entry) => {
        const [key, value] = entry;
        if(key===label_name&&label_name!=='email'&&label_name!=='first_name'&&label_name!=='last_name'&&label_name!=='phone'){
          profile_value=value;
        }
      });
      if(all_fields[i].value==="radio"||all_fields[i].value==="checkbox"){
        var multipleFields = all_fields[i].multipleValue;
        var readiocheckbox="";
          for (let index = 0; index < multipleFields.length; index++) {
            const element = multipleFields[index];
            var checked_value = "";
            Object.entries(metafield_data).forEach((entry) => {
              const [key, value] = entry;
              var str_array = value.split(',');
              for(var ckeck_index = 0; ckeck_index < str_array.length; ckeck_index++) {
              str_array[ckeck_index] = str_array[ckeck_index].replace(/^\s*/, "").replace(/\s*$/, "");
              if(str_array[ckeck_index]===element.value&&key===all_fields[i].name){
                checked_value='checked';
              }
              }
            });
            readiocheckbox+=`
            <div class="form-check form-check-inline">
            <input class="form-check-input" ${checked_value}  type=${all_fields[i].value} id=${'cd_'+all_fields[i].id+'_'+index} name=${label_name}  value=${element.value}>
            <label class="form-check-label" for=${'cd_'+all_fields[i].id+'_'+index}>${element.value}</label>
            </div>`;
          }
          all_edit_fields.innerHTML +=`<div class="cd_row"><div><label>${all_fields[i].label}</label></div><div style="width:fit-content;">${readiocheckbox}</div></div>`;
      }
      else if(all_fields[i].value==="email"||all_fields[i].value==="text"||all_fields[i].value==="date"){
        all_edit_fields.innerHTML +=`<div class="cd_row"><div class="cd_col-25"><label for=${'cd_'+all_fields[i].id}>${all_fields[i].label}</label></div><div class="cd_col-75"><input type=${all_fields[i].value} id=${'cd_'+all_fields[i].id} name=${label_name} value=${profile_value}></div></div>`;
      }
     else if(all_fields[i].value==="textarea"&&all_fields[i].value==="textarea"){
        all_edit_fields.innerHTML +=`<div class="cd_row"><div class="cd_col-25"><label for=${'cd_'+all_fields[i].id}>${all_fields[i].label}</label></div><textarea class="form-control" id=${'cd_'+all_fields[i].id} rows="2" name=${label_name}>${profile_value}</textarea></div>`;
     }
    } 
  } catch (error) {
    console.log(err)
  }
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


var elements = document.getElementsByClassName("cd_active_ul");
var toactive = function (e) {
  if (e.target.classList.contains('cd_menu-child')) {
  var elems = document.querySelectorAll(".cd_active");
  [].forEach.call(elems, function (el) {
    el.classList.remove("cd_active");
  });
  myFunction(e.target.getAttribute('id'));e.target.classList.add("cd_active");if(e.target.classList.contains('cd_link')||e.target.classList.contains('cd_page'))window.open(e.target.querySelector('.cd_sidebarlink').href, '_blank');
 }
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
  var change_password_page = document.getElementById("cd_change_password_page");

  switch (a) {
    case "cd_edit-profile":
      value_return = edit_profile_page;
      break;
    case "cd_my-profile":
      value_return = profile_page;
      break;
    case "cd_orders":
      value_return = orders_page;
      break;
    case "cd_addresses":
      value_return = addresses_page;
      break;
    case "cd_change-password":
      value_return = change_password_page;
      break;
    case "cd_add-address":
      value_return = add_address_page;
      break;
    case "cd_contact":
      value_return = contact;
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
    window.history.replaceState(null, null, '?a=cd_my-profile');
  }

  value_return.style.display = "block";
  // document.getElementById(a).classList.add('cd_active');
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
      fetch(`${hostname}/api/post-customer-password?shop=${Shop_name}`, {
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