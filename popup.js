document.getElementById("analyzeBtn").addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    action: "getJobDescription"
  }, (response) => {

    document.getElementById("jobText").value =
      response.jobText;

  });

});
