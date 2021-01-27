var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
// var id = qs.get("id");
var current_id
var cuser  
if(queryString.split("=").length <= 1){
    // current_id = localStorage.getItem("cid")?localStorage.getItem("cid"):cuser.id;
    var cuser = JSON.parse(localStorage.getItem("user"));
    current_id = cuser.id;
}
else 
    current_id = queryString.split("=")[1];

console.log(current_id);

async function getOtherUser(){
    let users = await getApi(`user/${current_id}`,"GET",null);
    renderProfile(users);
    console.log(users);
}
async function getPosts(){
    let posts = await getApi(`user/${current_id}/post`,"GET",null);
    renderPost(posts.content);
    console.log(posts);
}
function editProfile(){
    $("#animatedModal").animatedModal();
}
function renderProfile(rs){
    row=` 
    <div class="background-image-profile-item background-image-profile-item-image">
        <div class="div-img-image-profile col-lg-6">
        </div>
        <div class="div-img-image-profile col-lg-6">
            <h1 id="username">${rs.user.fullname}</h1>
            <p id="email">@${rs.user.username}</p>
        </div>
    </div>

    <div class="background-image-profile-item">
        <ul class="follow-list">
            <li class="col-lg-3 follow-item">
                <span id="numofposts">..</span>
                <p>Post</p>
            </li>
            <li style="cursor:pointer;" onclick="viewListOfUser('followers/${rs.user.id}')" class="col-lg-3 follow-item">
                <span >${rs.user.numOfFollowers}</span>
                <p>Followers</p>
            </li>
            <li style="cursor:pointer;" onclick="viewListOfUser('followings/${rs.user.id}')" class="col-lg-3 follow-item">
                <span >${rs.user.numOfFollowings}</span>
                <p>Following</p>
            </li>
            <li class="col-lg-3 follow-item">
                <span> ${(rs.followStatus == 0)?'<button class="follow-btn">Follow</button>':(rs.followStatus == -1)?'<button class="follow-btn" onclick=editProfile()>Edit profile</button>':'<button class="follow-btn">Unfollow</button>'}</span>
            </li>
        </ul>
    </div>`;
    $(".background-image-profile").html(row);
    $(".background-image-cover").html(
        ` <img class="img-cover" src="${retriveAvatar(rs.user.cover)}"/>
        <div class="div-img-avatar">
            <img src="${retriveAvatar(rs.user.avatar)}" /> 
        </div>`
    );
}
function renderPost(posts){
    row="";
    $("#numofposts").html(posts.length)
    col = ['<div class="column-profile column">','<div class="column-profile column">','<div class="column-profile column">'];
    posts.map((post,key)=>{
        console.log(key);
        col[(key%3)]+=`<img style="cursor:pointer" data-izimodal-open="#modal_${post.id}" src="${retriveAvatar(post.medias[0].media_url)}" style="width:100%">`;
        // row+=`${key%3 == 0?'<div class="column-profile column">':""}
        //         <img src="./images/about.jpg" style="width:100%">
        //     ${(key%3 == 1 && key!=0)?'</div>':""}`
        col[(key%3)]+= `<div id="modal_${post.id}" data-izimodal-title=" " class="modais"  data-izimodal-transitionin="fadeInDown" data-izimodal-iframeURL="/details.html?id=${post.id}" tabindex="-1" role="dialog" aria-labelledby="detailModalLabel" aria-hidden="true"></div>`
    });
    col.map((c)=>{
        row+=c+"</div>";
    })
    console.log(row);
$('.grid-image-gallery-profile').append(row);
$(".modais").iziModal({
    history: false,
    iframe : true,
    fullscreen: true,
    headerColor: '#4F4F4F',
    closeButton: true, 
    group: 'group1',
    // loop: true,
    // iframeHeight: '100%',
    openFullscreen:true,
});
}
async function editProfile(){
    const steps = ['','', '']
    const swalQueueStep = Swal.mixin({
    confirmButtonText: 'Forward',
    cancelButtonText: 'Back',
    progressSteps: steps,
    input: 'file',
    inputAttributes: {
        required: true
    },
    reverseButtons: true,
    validationMessage: 'This field is required'
    })
    const swalQueueSteps = [
        Swal.mixin({
            confirmButtonText: 'Forward',
            cancelButtonText: 'Back',
            progressSteps: steps,
            input: 'text',
            inputAttributes: {
                // required: true
            },
            reverseButtons: true,
            validationMessage: 'This field is required'
            }),
        Swal.mixin({
            confirmButtonText: 'Forward',
            cancelButtonText: 'Back',
            progressSteps: steps,
            input: 'file',
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            validationMessage: 'This field is required'
            }),
        Swal.mixin({
            confirmButtonText: 'Forward',
            cancelButtonText: 'Back',
            progressSteps: steps,
            input: 'file',
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            validationMessage: 'This field is required'
            })
    ];
    const swalContent = [
        {
            title: `Edit Username`,
            // html:`You can use <b>bold text</b><a href="//sweetalert2.github.io">links</a> and other HTML tags',`,
        },
        {
            title: `Update Avatar`,
            // html:`You can use <b>bold text</b><a href="//sweetalert2.github.io">links</a> and other HTML tags',`,       
        },
        {
            title: `Update Cover`,
            // html:`You can use <b>bold text</b><a href="//sweetalert2.github.io">links</a> and other HTML tags',`,
        },
    ];
    const values = []
    let currentStep
    for (currentStep = 0; currentStep < steps.length;) {
    const result = await swalQueueSteps[currentStep].fire({
        title:swalContent[currentStep].title,
        html:swalContent[currentStep].html,
        inputVaule:"",
        showCancelButton: currentStep > 0,
        currentProgressStep: currentStep
    })

    if (result.value) {
        values[currentStep] = result.value
        currentStep++
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        currentStep--
    } else {
        break
    }
    }

    if (currentStep === steps.length) {
    Swal.fire(JSON.stringify(values))
    console.log(values);
    var file = values[1];
    var reader = new FileReader();
    reader.onloadend = function() {
      console.log('RESULT', reader.result)
      var el = document.getElementById('cropava');
      var resize = new Croppie(el, {
          viewport: { width: 400, height: 400, type:'circle' },
          boundary: { width: 400, height: 400 },
          showZoomer: true,
          enableResize: true,
          enableOrientation: true,
          mouseWheelZoom: 'ctrl'
      });
      resize.bind({
          url: reader.result,
      });
      //on button click
      resize.result('blob').then(function(blob) {
          // do something with cropped blob
      });
        $('.modal').modal('show')
    }
    reader.readAsDataURL(file);
    }
}