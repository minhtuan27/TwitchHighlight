function sendRequest(tabId, tabUrl) {
    //Log to analytics
    ga('send', 'event', "Request", "Send", isBasic.toString());
    //Send a POST request to the server to analyse the video
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://highlights.vercel.app/api", true);
    xhr.setRequestHeader('Content-type', 'application/json');
    //console.log(JSON.stringify({url: tabUrl}));
    xhr.send(JSON.stringify({
        type: "Request",
        clientID: clientID,
        url: tabUrl,
        isBasic: isBasic,
        n: n,
        l: (isBasic == 1) ? l : "-1",
        offset: offset,
        from: from,
        to: to,
        category: category
    }));
    xhr.onreadystatechange = function () {
        //console.log(xhr.readyState);
        //console.log(xhr.status);
        if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log(xhr.responseText);
            let response = JSON.parse(xhr.responseText);
             
            //update clientID
            clientID = response["clientID"];
            window.localStorage.setItem("watermelon", clientID);
            //console.log("Your clientID is " + clientID);

            // Check response message
            let responseMessage = response["message"];
            let responsePremium = response["premium"];
            let responseActivated = response["activated"];
            let responseIsBasic = response["isBasic"];
            let responseDone = response["done"];
            if (responseMessage == "OK") {
                // Update client's status
                if (responsePremium && isPremium === 0) upgradeAccount();

                // Remove error message
                const highlightContainerError = document.getElementById("highlight-container-error");
                highlightContainerError.textContent = "";

                let advice = response["advice"];
                if (advice !== null && advice !== undefined){
                    // Set advice
                    const highlightContainerAdvice = document.getElementById("highlight-container-advice");
                    highlightContainerAdvice.textContent = response["advice"];
                }

                let results = response["results"];
                // Parse highlights
                let highlights = results[0];
                // Parse durations
                let durations = results[1];
                //console.log(durations);
                //console.log(xhr.responseText);

                // Update category
                const autoChoice = document.getElementById("select-title-auto");
                if (results[2] !== null && results[2] !== undefined && results[2] !== ""){
                    autoChoice.textContent = "Detected: " + results[2];
                } else {
                    autoChoice.textContent = "Automatic";
                }

                // Remove old buttons
                removeOldButtons();

                // Add new buttons
                for (let i = 0; i < highlights.length; i++) {
                    setButton(tabId, tabUrl, i, highlights[i], responseDone);
                }

                //Rewire autoplay button
                setAutoplayButton(tabId, tabUrl, highlights, durations);

                if (responseIsBasic) {
                    //Send a request to get update every 30 seconds
                    //alert("I am still running!");
                    if (!responseDone) {
                        setTimeout(() => sendRequest(tabId, tabUrl), 30000);
                    } else {
                        changeMessage("Done!", "white", "forestgreen");
                        recentMessage = ["Done!", "white", "forestgreen"];
                    }
                } else {
                    //Send a request to get update every 30 seconds
                    //alert("I am still running!");
                    if (!responseDone) {
                        setTimeout(() => sendRequest(tabId, tabUrl), 30000);
                    } else {
                        changeMessage("Done!", "white", "forestgreen");
                        recentMessage = ["Done!", "white", "forestgreen"];
                    }
                }

            } else {
                // Check if client is authorized to use advance setting or request multiple times
                const highlightContainerError = document.getElementById("highlight-container-error");
                highlightContainerError.textContent = responseMessage;
                if (!responsePremium && responseActivated) {
                    const subscribe = document.getElementById("subscribe-container");
                    subscribe.style.display = "block";
                }

                // Remove old buttons
                removeOldButtons();

                // Reset autoplay buttons
                document.getElementById("autoplay-container").style.display = "none";
                document.getElementById("autoplay-warning").style.display = "none";
                document.getElementById("autoplay-button").textContent = "Play all highlights";
                document.getElementById("quit-button").style.display = "none";
            }

        }
    }
}

function sendReport(email, url, message) {
    ga('send', 'event', "Report", "Send");
    //Send a POST request with the report message
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://highlights.vercel.app/api", true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.send(JSON.stringify({
        type: "Report",
        clientID: clientID,
        email: email,
        url: url,
        message: message
    }));
}

function sendPurchaseID(jwt, cartId, orderId) {
    ga('send', 'event', "Purchase", "Send");
    //Send a POST request with the purchaseID
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://highlights.vercel.app/api", true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.send(JSON.stringify({
        type: "PurchaseID",
        clientID: clientID,
        jwt: jwt,
        cartId: cartId,
        orderId: orderId
    }));
}

function sendUpdatedStatus(license) {
    ga('send', 'event', "Status", "Send");
    //Send a POST request with the client status
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://highlights.vercel.app/api", true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.send(JSON.stringify({
        type: "UpdatedStatus",
        clientID: clientID,
        license: license
    }));
}

