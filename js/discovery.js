// grid-image-gallery
var posts = []
async function loadPopular(){
    posts = await getApi("/popular?size=24");
    console.log(posts)
    renderMain(posts.content, "Popular")
    // posts.content.map()
    
}
async function refeed(tag){
    posts = await getApi(`/tags/${tag}`);
    console.log(posts)
    renderMain(posts.posts, tag)
    // posts.content.map()
    
}
function renderMain(posts, type){
    row="";
    col = [` <div class="column-discovery column"> <h1>${type}</h1>`,' <div class="column-discovery column">',' <div class="column-discovery column">',' <div class="column-discovery column">'];
    posts.map((post,key)=>{
        console.log(key);
        col[(key%4)]+=`<img style="cursor:pointer"  onclick="onclickDetail(${post.id})" src="${retriveAvatar(post.medias[0].media_url)}" style="width:100%">`;
        // col[(key%4)]+= `<div id="modal_${post.id}" onclickDetail({post.id})></div>`
    });
    col.map((c)=>{
        row+=c+"</div>";
    })
    console.log(row);
$('.maincontainer').html(row);row="";
}