chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getJobDescription") {

    const text = document.body.innerText;

    sendResponse({
      jobText: text.substring(0, 5000)
    });

  }

});
