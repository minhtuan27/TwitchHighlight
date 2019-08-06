'use strict';

function resetConfig(){
    window.localStorage.setItem("n", const_n.toString());
    window.localStorage.setItem("l", const_l.toString());
    window.localStorage.setItem("offset", const_offset.toString());
    window.localStorage.setItem("from", const_from.toString());
    window.localStorage.setItem("to", const_to.toString());
    window.localStorage.setItem("isBasic", const_isBasic.toString());
    
    n = parseInt(window.localStorage.getItem("n"));
    l = parseInt(window.localStorage.getItem("l"));
    offset = parseInt(window.localStorage.getItem("offset"));
    from = parseInt(window.localStorage.getItem("from"));
    to = parseInt(window.localStorage.getItem("to"));
    isBasic = parseInt(window.localStorage.getItem("isBasic"));
    
    const textboxN = document.getElementsByName("n")[0];
    const textboxL = document.getElementsByName("l")[0];
    const textboxOffset = document.getElementsByName("offset")[0];
    const textboxFrom = document.getElementsByName("from")[0];
    const textboxTo = document.getElementsByName("to")[0];

    textboxN.value = n;
    textboxL.value = l;
    textboxOffset.value = offset;
    textboxFrom.value = from;
    textboxTo.value = to;

    settingBasicButtonClicked();
}

function settingAdvanceButtonClicked(){
    const settingBasicPage = document.getElementById("setting-basic");
    const settingAdvancePage = document.getElementById("setting-advance");
    settingBasicPage.style.display = "none";
    settingAdvancePage.style.display = "inline-block";
    isBasic = 0;
    window.localStorage.setItem("isBasic", "0");
}

function settingBasicButtonClicked(){
    const settingBasicPage = document.getElementById("setting-basic");
    const settingAdvancePage = document.getElementById("setting-advance");
    settingBasicPage.style.display = "inline-block";
    settingAdvancePage.style.display = "none";
    isBasic = 1;
    window.localStorage.setItem("isBasic", "1");
}

function reportButtonClicked(){
    const main = document.getElementById("main");
    const report = document.getElementById("report");
    if (main.style.display == "none"){
        main.style.display = "block";
        report.style.display = "none";
    } else {
        main.style.display = "none";
        report.style.display = "block";
    }
}

function config(tab){
    if (document.getElementsByName("n").length == 0){
        setTimeout(() => config(tab), 100);
        return;
    }
    const reportButton = document.getElementById("report-icon");
    const sendReportButton = document.getElementById("send-button");
    const settingButton = document.getElementById("setting-icon");
    const settingBasicButton = document.getElementById("choice-basic");
    const settingAdvanceButton = document.getElementById("choice-advance");
    const subscribeButton = document.getElementById("subscribe-button");
    const textboxN = document.getElementsByName("n")[0];
    const textboxL = document.getElementsByName("l")[0];
    const textboxOffset = document.getElementsByName("offset")[0];
    const textboxFrom = document.getElementsByName("from")[0];
    const textboxTo = document.getElementsByName("to")[0];

    textboxN.value = n;
    textboxL.value = l;
    textboxOffset.value = offset;
    textboxFrom.value = from;
    textboxTo.value = to;

    subscribeButton.addEventListener("click", function(){
        try{
            buyProduct("premium");
        }catch(err){
        }
    });

    reportButton.addEventListener("click", function(){
        reportButtonClicked();
    });

    sendReportButton.addEventListener("click", function(){
        reportButtonClicked();

        changeMessage("Sent!", "green", "white");

        setTimeout(() => changeMessage(recentMessage[0], recentMessage[1], recentMessage[2]), 2000);
        
        const email = document.getElementsByName("email")[0].value;
        const url = document.getElementsByName("url")[0].value;
        const message = document.getElementsByName("message")[0].value;
        sendReport(email, url, message);
    });

    settingBasicButton.addEventListener("click", function(){
        settingBasicButtonClicked();
        process(tab);
    });

    settingAdvanceButton.addEventListener("click", function(){
        settingAdvanceButtonClicked();
        process(tab);
    });

    settingButton.addEventListener("click", function(){
        const settingPage = document.getElementById("setting");
        const footer = document.getElementById("footer");
        const message = document.getElementById("message");
        const subscribe = document.getElementById("subscribe-container");
        if (settingPage.style.display == "none"){
            settingPage.style.display = "block";
            textboxN.value = n;
            textboxL.value = l;
            textboxOffset.value = offset;

            footer.style.display = "block";

            message.style.display = "block";

            subscribe.style.display = "block";
        } else {
            settingPage.style.display = "none";

            footer.style.display = "none";

            message.style.display = "none";

            subscribe.style.display = "none";
        }
    });

    textboxN.addEventListener("change", function(){
        n = textboxN.value;
        window.localStorage.setItem("n", n.toString());
        process(tab);
    });

    textboxL.addEventListener("change", function(){
        l = textboxL.value;
        window.localStorage.setItem("l", l.toString());
        process(tab);
    });

    textboxOffset.addEventListener("change", function(){
        offset = textboxOffset.value;
        window.localStorage.setItem("offset", offset.toString());    
        process(tab);
    });

    textboxFrom.addEventListener("change", function(){
        from = textboxFrom.value;
        window.localStorage.setItem("from", from.toString()); 
        process(tab);
    });

    textboxTo.addEventListener("change", function(){
        to = textboxTo.value;
        window.localStorage.setItem("to", to.toString());   
        process(tab);
    });

    if (isBasic == 0){
        settingAdvanceButtonClicked();
    } else {
        settingBasicButtonClicked();
    }
}

chrome.tabs.getSelected(null, config);
