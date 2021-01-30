var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
// var id = qs.get("id");
var id = queryString.split("=")[1];
console.log(window.location);
var details;
async function addComment() {
  let cmt = $("#comment_content").val();
  let cmtO = {
    post: {
      id: id,
    },
    content: cmt,
  };
  result = await getApi("comments/add", "POST", cmtO);
  renderCmt(id);
  $("#comment_content").val("");
}
async function nlike(id, isLike){
  const res  = await getApi("likes/","POST",{
    "post":{
      "id":id
    }
  });
  console.log(res);
  if(!isLike){
    $("#like_stats").addClass('div-details-div-like-btn')
    $("#like_stats").removeClass('div-details-div-not-like-btn')
  }else{
    $("#like_stats").removeClass('div-details-div-like-btn')
    $("#like_stats").addClass('div-details-div-not-like-btn')
  }
  $("#like_stats").html(`
    <button>
      <i class="fa fa-heart" aria-hidden="true"></i>
      <span>${res.numOfLikes}</span>
    </button>
  `)
}
async function renderDetail(id) {
  details = await fetchApi(`post/${id}`, "GET", null);
  if(details.status !=200) window.location.href = '/403.html';
  details = details.data
  // console.log(details);
  // $('#main_img').attr("src",retriveImage(details.medias[0].media_url));
  // 3src="${retriveImage(details.medias[0].media_url)}
  $(".div-details-div-img-main").html(`
    <img id="main_img" />
    <div onclick="nlike(${details.id},${details.like})" id="like_stats" class=" ${
      details.like ? "div-details-div-like-btn" : "div-details-div-not-like-btn"
    }">
        <button>
            <i class="fa fa-heart" aria-hidden="true"></i>
            <span>${details.numOfLikes}</span>
        </button>
    </div>
    `);
  $(".details-header-div-avatar").html(`
    <div class="details-header-div-avatar-div-1 wrapper ">
        <div class="details-item-div-img ">
            <img src="${retriveAvatar(details.user.avatar)}"/>
        </div>
        <div class="details-item-div-text animate">
            <h2
                class="home-content-details-item-div-info-name">${
                  details.user.fullname
                }</h2>
            <h4
                class="home-content-details-item-div-info-name">@${
                  details.user.username
                }</h4>
            <p
                class="home-content-details-item-div-info-pos">
                ${displayDate(details.created)}</p>
        </div>
        <div class="home-content-details-item-div-tag">
            <p class="three-dots-details">...</p>
        </div>
    </div>
    
    <div class="details-header-div-caption-div-2">
    <h4 style="cursor: pointer;" onclick="viewListOfUser('likes/${details.id}')"> ${details.numOfLikes} people like this </h4>
    <br>
                                    <h3>${details.description} </h3>
                                </div>
                                <br>
    `);
    $("#main_img").attr("src", retriveImage(details.medias[0].media_url));
  // const img = new Image();
  // img.src = `${retriveImage(details.medias[0].media_url)}`;
  // img.onload = function () {
  //   $("#main_img").attr("src", retriveImage(details.medias[0].media_url));
  //   img_h = this.height;
  //   img_w = this.width;
  //   let h =
  //     ($("#main_img").width() / img_w) *
  //     img_h *
  //     ($(window).width() > 800 ? 0.65 : 0.65);
  //   console.log(h);

  //   // $(".details-content-small").height(h);
  // };
}
async function renderCmt(id) {
  const cmts = await getApi(`comments/${id}?sortBy=created`, "GET", null);
  $(".details-content-small").html("");
  cmts.content.map((cmt) => {
    console.log(cmt);
    $(".details-content-small").append(
      `
            <div class="details-content-item">
            <div class="details-content-item-div-img">
                <img src="${retriveAvatar(cmt.author.avatar)}"  />
            </div>
            <div class="details-content-item-div-text">
                <p><strong>@${cmt.author.username}</strong> : ${
        cmt.content
      }</p></span>
            </div>
        </div>
            `
    );
  });
}
renderDetail(id);
renderCmt(id);

// window.addEventListener("resize", function () {
//   const img = new Image();
//   img.src = `${retriveImage(details.medias[0].media_url)}`;
//   img.onload = function () {
//     img_h = this.height;
//     img_w = this.width;
//     let h =
//       ($("#main_img").width() / img_w) *
//       img_h *
//       ($(window).height() > 800 ? 0.9 : 0.55);
//     console.log(h);
//     // $(".details-content-small").height(h);
//   };
// });
