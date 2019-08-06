let autoplayID = 0;

function autoPlay(apID, id, url, i, highlights, isBasic, durations){
    if (apID != autoplayID) return;
    let autoplayButton = document.getElementById("autoplay-button");
    if (i >= highlights.length){
        let autoplayWarning = document.getElementById("autoplay-warning");
        autoplayWarning.style.display = "none";
        autoplayButton.textContent = "Autoplay"
        autoplayButton.onclick = function(){
            let autoplayWarning = document.getElementById("autoplay-warning");
            autoplayWarning.style.display = "block";
            autoplayID += 1;
            autoPlay(autoplayID, id, url, 0, highlights, isBasic, durations);
        }
    } else {
        chrome.tabs.update(id, {url: "https://www.twitch.tv/videos/" + getVideoCode(url) + "?t=" + highlights[i]});
        autoplayButton.textContent = "Next";
        autoplayButton.onclick = function(){
            autoplayID += 1;
            autoPlay(autoplayID, id, url, i + 1, highlights, isBasic, durations);
        }
        if (isBasic){
            setTimeout(() => {autoPlay(apID, id, url, i + 1, highlights, isBasic, durations)}, l * 60 * 1000);
        } else {
            setTimeout(() => {autoPlay(apID, id, url, i + 1, highlights, isBasic, durations)}, parseInt(durations[i]) * 1000);
        }
    }
}