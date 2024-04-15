console.log("Let's write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {

        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songlist").getElementsByTagName
        ("ul")[0];

        songUL.innerHTML = "";

    for (const song of songs) {


        songUL.innerHTML = songUL.innerHTML + `<li class=" flex songInfo">
    <div><img src="img/lib.svg" class="invert" alt=""></div>
    <div class=" divtitle">${song.replaceAll("%20", " ")}</div>
    <div class="imgside cursor"><img src="img/play.svg" class=" invert" alt=""></div>
</li>`;


    }

    // Attaching an event listener for each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            playSong(e.querySelector(".divtitle").innerHTML.trim());

        })
    })


    return songs;
}

const playSong = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {

        currentSong.play();
        play.src = "img/pause.svg"
    }
    title.innerHTML = decodeURI(track);
    duration.innerHTML = "00:00"
}

async function displayAlbums(){
    let a = await fetch(`/Song/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer = document.querySelector(".playlist");
    let allas = div.getElementsByTagName("a")
    console.log(allas);
    let array = Array.from(allas)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("/Song")){
            let folder = e.href.split("/").slice(-2)[0];

            let a = await fetch(`/Song/${folder}/info.json`);
            let response = await a.json(); 
            console.log(response.title) 

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="playlistcard">

            <img src="/Song/${folder}/img.jpg" alt="">

            <h3>${response.title}</h3>
            <div>For You</div>
        </div>`
        }
    }
    Array.from(document.getElementsByClassName("playlistcard")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {

            console.log(item.currentTarget.dataset);
            songs = await getSongs(`Song/${item.currentTarget.dataset.folder}`);

            playSong(songs[0]);


        })
    })


}


async function main() {

    

    // Get the list of all the songs
    songs = await getSongs("Song/es");

    playSong(songs[0], true)
    displayAlbums();



    // attach an event listener to play 


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/narutoPlay.png"
        }
    })

    function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    currentSong.addEventListener("timeupdate", () => {




        duration.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".seekball").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })


    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".seekball").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration) * percent / 100;

    })

    hamburger.addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-600%";
    })

    previous.addEventListener("click", () => {
        console.log("previous clicked");
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if (index > 0) {
            playSong(songs[index - 1]);
        }

    })

    next.addEventListener("click", () => {
        console.log("next clicked");
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playSong(songs[index + 1]);
        }

    })

    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    volIcon.addEventListener("click", () => {

        console.log("Icon clicked");

        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            volIcon.src = "img/volume on.svg"
        } else {
            currentSong.volume = 0.5;
            volIcon.src = "img/volume off.svg"
        }

    })


}


main();