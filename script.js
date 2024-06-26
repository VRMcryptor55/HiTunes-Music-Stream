console.log("lets write java script")

let currentsong= new Audio();
let songs;
let currfolder;

function convertSecondsToMinSec(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formatedMinutes=String(minutes).padStart(2, '0');
    const formatedSeconds=String(remainingSeconds).padStart(2, '0');
    return `${formatedMinutes}:${formatedSeconds}`;
}

async function getsongs(folder){
    currfolder=folder
    let a = await fetch(`/${folder}`)
    let response=await a.text()
    //console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
    }

    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML="";
    for (const song of songs) {
        let len=song.length-4;

        let index=song.lastIndexOf('/')
        let str=`${song.replaceAll("%20"," ").slice(index+1,len)}`
        //console.log(str)
        songUL.innerHTML=songUL.innerHTML+`<li><img class="musicli" height="50px" src="musicicon.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20"," ").slice(index+1)} </div>
            <div>song artist</div>
        </div>
        <img class="playli" src="playbutton.svg" height="50px" alt="">
    </li>`
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
             e.addEventListener("click",element=>{
                //console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()); 
             })  
    });
    return songs
}

const playMusic=(track)=>{
    currentsong.src = `/${currfolder}/`+track;
    play.src="pause.svg"
    currentsong.play();
    document.querySelector(".songinfo").innerHTML=track
}

async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response=await a.text()
    //console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a");
    let array=Array.from(anchors)
    for(let index=0;index<array.length;index++){
        const e=array[index];
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let folder=e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response=await a.json()
            document.querySelector(".cardscontainer").innerHTML=document.querySelector(".cardscontainer").innerHTML+`<div class="cards rounded" data-folder="${folder}">
                        <div class="image-container">
                            <img src="/songs/${folder}/cover.jpeg" alt="Image">
                            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#000" fill="#1fdf64">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
                                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor"></path>
                            </svg>
                        </div>

                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }

     //Load the playlist whenever card is clicked
     console.log(Array.from(document.getElementsByClassName("cards")))
     Array.from(document.getElementsByClassName("cards")).forEach(e=>{
        //console.log(Array.from(document.getElementsByClassName("cards")))
        e.addEventListener("click",async item=>{
            console.log("hi ",item.currentTarget.dataset.folder)
            songs= await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
     
}

async function main(){
    await getsongs("songs/OldHits")
    //console.log(songs);
    currentsong.src=songs[0];
    let initialsong=songs[0];
    let index=initialsong.lastIndexOf('/')
    document.querySelector(".songinfo").innerHTML=`${initialsong.replaceAll("%20"," ").slice(index+1)}`
    
    //display all the albums on the page
    displayAlbums();


    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="pause.svg"
        }
        else{
            currentsong.pause();
            play.src="play.svg"
        }
    })

    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        //console.log(currentsong.currentTime,currentsong.duration) ;
        document.querySelector(".time").innerHTML=`${convertSecondsToMinSec(currentsong.currentTime)} : ${convertSecondsToMinSec(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*98.9+"%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*98.9;
        //console.log((e.offsetX/e.target.getBoundingClientRect().width)*98.9)
        //console.log("currtime ",((currentsong.duration)*percent)/98.9)
        document.querySelector(".circle").style.left=percent+"%";
        //console.log("")
        console.log("before",currentsong.currentTime);
        currentsong.currentTime=Math.floor(((currentsong.duration)*percent)/98.9);
        //currentsong.currentTime=10;
        console.log("after",currentsong.currentTime);
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

   document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "-150%"
    })

    prev.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src);
        //console.log(index);
        if((index-1)>=0){
            let i=songs[index-1].lastIndexOf('/');
            let nowplay=`${songs[index-1].replaceAll("%20"," ").slice(i+1)}`
            playMusic(nowplay.trim());
        }
    })

    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src);
        //console.log(index);
        if((index+1)<=songs.length-1){
            let i=songs[index+1].lastIndexOf('/');
            let nowplay=`${songs[index+1].replaceAll("%20"," ").slice(i+1)}`
            playMusic(nowplay.trim());
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        //console.log(e.target.value);
        currentsong.volume = parseInt(e.target.value)/100;
    })

    //adding Event listener to mute and unmute
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}

main()