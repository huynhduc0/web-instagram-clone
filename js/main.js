var url = "http://congchuabuoito.southeastasia.cloudapp.azure.com/";
// var url = "http://localhost:8080/";
var token = localStorage.getItem("token");
var cuser = localStorage.getItem("user");
if (!token) window.location.href = "/login";
console.log(token);
var header = new Headers();
header.append("Content-Type", "application/json");
header.append("Authorization", token);
header.append("Access-Control-Allow-Origin", "*");
console.log(header);
renderHeader();
openNotification = false;
var notifications_list = [];

async function getApi(route, method, body) {
  let res = await fetch(url + route, {
    method: method,
    crossDomain: true,
    headers: {
      "content-type": "application/json",
      Authorization: token,
      "Access-Control-Allow-Origin": "*",
    },
    // withCredentials: true,
    // credentials: 'include',
    body: body ? JSON.stringify(body) : null,
  });
  if (res.status == 401) window.location.href = "/login";
  let data = await res.json();
  return data;
}
async function fetchApi(route, method, body) {
  let res = await fetch(url + route, {
    method: method,
    crossDomain: true,
    headers: {
      "content-type": "application/json",
      Authorization: token,
      "Access-Control-Allow-Origin": "*",
    },
    // withCredentials: true,
    // credentials: 'include',
    body: body ? JSON.stringify(body) : null,
  });
  if (res.status == 401) window.location.href = "/login";
  let data = await res.json();
  return { status: res.status, data: data };
}
async function getStoriesList() {
  var stories = await getApi("story/", "GET", null);
  console.log(stories);
  renderStoriesList(stories.content);
}
async function getFeed() {
  var feed = await getApi("feed?sortBy=created", "GET", null);
  console.log(feed.content[0]);
  renderHome(feed.content);
}
async function addLike(id) {
  const like = await getApi("likes", "GET", { post: { id: id } });
}
async function isLike(id) {
  const isLike = await getApi(`likes/islike/${id}`, "GET", null);
  return isLike;
}

async function getOtherUser() {
  var users = await getApi("user?page=0", "GET", null);
  renderOtherUser(users);
}
function retriveAvatar(avatar) {
  return !avatar
    ? "/images/cat.png"
    : avatar.startsWith("http")
    ? avatar
    : `${url}img/${avatar}`;
}

function retriveImage(img) {
  return img == null ? "/images/cat.png" : `${url}img/${img}`;
}
function onclickDetail(id) {
  console.log( `/details.html?id=${id}`);
  $("#detailModal").iziModal({
    // iframe : true,
    openFullscreen:true,
    headerColor: '#4F4F4F',
    width: '98%',
    height: '99%',
    // iframeHeight: '100%',
    // fullscreen: true,
    iframe: true,
//     iframeHeight: 800,
  // closeButton: true, 
    iframeURL: "/details.html?id="+id
  });
  $('#detailModal').iziModal('open')
  // $("#ja").load( "http://instafake.quack/details.html?id=11");
  // window.location.href = `/details.html?id=${id}`;
}
function onclickProfile(id) {
  window.location.href = `/profile.html?id=${id}`;
}
function displayDate(date, preposition) {
  preposition = preposition || "at";
  moment.lang("en", {
    calendar: {
      lastDay: "[Yesterday] [\n][ " + preposition + " ] h:mm a",
      sameDay: "[Today] [\n][ " + preposition + " ] h:mm a",
      nextDay: "[Tomorrow] [\n][ " + preposition + " ] h:mm a",
      lastWeek: "M/D/YY [\n][" + preposition + "] h:mm a",
      nextWeek: "M/D/YY [\n][" + preposition + "] h:mm a",
      sameElse: "M/D/YY [\n][" + preposition + "] h:mm a",
    },
  });
  return moment(date).calendar();
}
async function renderNoti() {
  openNotification = !openNotification;

  if (!openNotification) {
    $(".div-notification").hide();
    return;
  }
  $(".div-notification").show();
  notifications_list = await getApi("notification");
  console.log(notifications_list.content);
  noti_r = ""
  notifications_list.content.map((e) => {
    noti_r += `  <div class="notification-item">
                            <div class="notification-item-div-img">
                                 <img src="${retriveAvatar(e.from.avatar)}" />
                                 <div class="reaction" ${e.notifcationType=="LIKE"?"":((e.notifcationType=="COMMENT")?"style='background-color: green'":"style='background-color: blue'")}"">
                                 <i class="fa fa-${e.notifcationType=="LIKE"?"heart":((e.notifcationType=="COMMENT")?"comment":"bell-o")}" aria-hidden="true"></i>
                                 </div>
                            </div>
                           
                            <div class="notification-item-name">
                                <p><b>${e.from.fullname}:</b> ${e.message} </p>
                                <p>${displayDate(e.created)} </p>
                            </div>
                            <div class="notification-item-image-overview">
                                <img src="${retriveAvatar(e.from.avatar)}" />
                            </div>
                        </div>`;
  });
  $(".notification").html(noti_r);
}
function renderStoriesList(stories) {
  row = stories.length > 0 ? "" : "NO STORY TO SHOW NOW";
  stories.map((e) => {
    row += `
        <li class="home-story-list-item${
          !e.numSeen == e.numStories ? " stories_viewed" : ""
        }">
            <img src="${retriveAvatar(e.avatar)}">
        </li>
        `;
  });
  // console.log(row)
  $(".home-story-list").html(row);
}
function renderOtherUser(content) {
  row = "";
  content.map((user) => {
    row = `
       <ul class="relative-friend-list">
            <li class="relative-friend-list-item">
                <div class="relative-friend-list-item-div-img">
                    <img onclick="onclickProfile(${
                      user.id
                      })" src="${retriveAvatar(user.avatar)}">
                </div>
                
                <div class="relative-friend-list-item-name">
                    <p><b>${user.username}</b><br> on instafake</p>
                </div>
                <div class="relative-friend-list-item-follow-btn-div">
                    ${
                      !user.following
                        ? '<div id="_f_' +
                          user.id +
                          '"><button onclick="follow(' +
                          user.id +
                          "," +
                          user.following +
                          ')" class="follow-btn">Follow</button>'
                        : '<div id="_f_' +
                          user.id +
                          '"><button class="follow-btn" onclick="follow(' +
                          user.id +
                          "," +
                          user.following +
                          ')"  style="background-color:gray">Unfollow</button>'
                    }
                </div>
            </li>
        </ul>`;
    $(".relative-friend").append(row);
  });
}
async function follow(id, ed) {
  $("#_f_" + id).html(
    ed
      ? '<button id="_f_' +
          id +
          '" onclick="follow(' +
          id +
          "," +
          !ed +
          ')" class="follow-btn">Follow</button>'
      : '<button class="follow-btn" onclick="follow(' +
          id +
          "," +
          !ed +
          ')" style="background-color:gray">Unfollow</button>'
  );
  await getApi("follow", "POST", { id: id });
}
async function like(id, isLike,des){
  const res  = await getApi("likes/","POST",{
    "post":{
      "id":id
    }
  });
  $("#l_"+id).html(res.numOfLikes)
  isLike = !isLike
    $("#btn_l_"+id).html(`
    <div class="${isLike?"newsfeed-item-div-caption-btn-like":"newsfeed-item-div-caption-btn-not-like"}"  onclick="like(${
      id
      },${isLike},'${des}')">
        <button>
        <i class="fa fa-heart" aria-hidden="true"></i>
            <span id="l_${id}">${res.numOfLikes}</span>
        </button>
    </div>
    <div class="newsfeed-item-div-caption-text">
        <h2 class="caption">${des}</h2>
    </div>
  </div>`);
  
}
async function renderHome(content) {
  row = "";
  var cuser = localStorage.getItem("user");
  await content.map(async (post) => {
    let liked = await isLike(post.id);
    row = `<div class="home-content-newsfeed-div-item" >
                <div class="home-content-newsfeed-item-div-img" >
                    <img src="${retriveAvatar(post.medias[0].media_url)}"  onclick="onclickProfile(${
                      post.id
                      })">
                </div>
                <div class="home-content-newsfeed-div-item-background">
                    <div class="home-content-newsfeed-item-background-container" 
                        <div class="home-content-newsfeed-item-div-info" onclick="onclickDetail(${
                          post.id
                          })">
                        <div class="newsfeed-item-div-img" onclick="onclickProfile(${
                          post.user.id
                          })">
                            <img src="${retriveAvatar(post.medias[0].url)}"> 
                        </div>
                        <div class="newsfeed-item-div-text"  onclick="onclickDetail(${
                          post.id
                          })">
                        <h1 class="home-content-newsfeed-item-div-info-name">${
                          post.user.username
                        }</h1>
                        <h3 class="home-content-newsfeed-item-div-info-pos">${displayDate(
                          post.created
                        )}</h3></div>
                    </div>
                    <div class="home-content-newsfeed-item-div-tag">
                        <p class="three-dots">
                            ...
                        </p>
                    </div>
                    <div id="btn_l_${post.id}" class="home-content-newsfeed-item-div-caption">
                        <div class="${post.like?"newsfeed-item-div-caption-btn-like":"newsfeed-item-div-caption-btn-not-like"}"  onclick="like(${
                          post.id
                          },${post.numOfLikes},'${post.description}')">
                            <button>
                            <i class="fa fa-heart" aria-hidden="true"></i>
                                <span id="l_${post.id}">${post.numOfLikes}</span>
                            </button>
                        </div>
                        <div class="newsfeed-item-div-caption-text">
                            <h2 class="caption">${post.description}</h2>
                        </div>
                      </div>
                    </div>
                </div>
            </div>`;
    await $(".home-content-newsfeed").append(row);
  });
}
async function renderHeader() {
  var user = await JSON.parse(localStorage.getItem("user"));

  // console.log(user);

  content = `<div class="home-header-container">
    <div class="home-header-div-logo col-lg-3">
        <h1>APPLONE</h1>
            
    </div>
    <div class="home-header-search col-lg-5" >
        <input type="text" placeholder="search">

    </div>
    <div class="home-header-navbar col-lg-4">
        <ul class="home-header-navbar-list">
            <li class="home-header-navbar-item col-lg-3">
                <i class="fa fa-home" aria-hidden="true"></i>
            </li>
            <li class="home-header-navbar-item col-lg-3">
                <i class="fa fa-compass" aria-hidden="true"></i>
            </li>
            <li class="home-header-navbar-item home-header-navbar-item-notification col-lg-3" onclick="renderNoti()">
                <i class="fa fa-heart-o" aria-hidden="true"></i>
                
            </li>
            
            <li class="home-header-navbar-item home-header-navbar-item-avatar col-lg-3">
            <a href="/profile.html"><img id="avatar" src="${retriveAvatar(
              user.avatar
            )}"></a>
            </li>
        </ul>
        <div class="div-notification" style="display: none" >
            <div class="notification">
                    <h3 style="padding: 15px 0;color: #fff;">Notification </h3>
            </div>
            <div class="recommend">

            </div>
        </div>
    </div>
</div>`;
  $("#header").html(content);
  $("#avatar_modal").attr("src", retriveAvatar(user.avatar));
}

!(function (window) {
  var $q = function (query, result) {
    if (document.querySelectorAll) {
      res = document.querySelectorAll(query);
    } else {
      var styleSheet = document.styleSheets[0] || document.createStyleSheet();
      styleSheet.addRule(query, "f:b");
      for (var i = 0; i < document.all.length; i++) {
        document.all[i].currentStyle.f && result.push(document.all[i]);
      }
      styleSheet.removeRule(0);
    }
    return res;
  };

  var addEventListener = function (evt, fn) {
    var elementToAttach = window;
    if (elementToAttach.addEventListener) {
      elementToAttach.addEventListener(evt, fn, false);
    } else if (elementToAttach.attachEvent) {
      elementToAttach.attachEvent("on" + evt, fn);
    } else {
      elementToAttach["on" + evt] = fn;
    }
  };

  var _has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  function loadImage(el, fn) {
    var img = new Image();
    var src = el.getAttribute("data-src");
    img.onload = function () {
      if (!!el.parent) {
        el.parent.replaceChild(img, el);
      } else {
        el.src = src;
      }
      if (typeof fn === "function") {
        fn();
      }
    };
    img.src = src;
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  var images = new Array();
  var query = $q("img[data-src]");
  var processScroll = function () {
    for (var i = 0; i < images.length; i++) {
      if (elementInViewport(images[i])) {
        loadImage(images[i], function () {
          images.splice(i, i);
        });
      }
    }
  };
  // Array.prototype.slice.call is not callable under our lovely IE8
  for (var i = 0; i < query.length; i++) {
    images.push(query[i]);
  }

  processScroll();
  addEventListener("scroll", processScroll);
})(this);
