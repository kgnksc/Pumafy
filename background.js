
chrome.runtime.onMessage.addListener((data, sender, sendResponse) =>
{
    const { prefs } = data
    switch (data.event)
    {
        case 'onTogglePuma':
            handleOnTogglePuma(prefs);
            break;
        case 'onSwitchOpacity':
            handleOnSwitchOpacity(prefs);
            break;
        default:
            break;
    }

    sendResponse({status: 'success'});
});

const handleOnTogglePuma = (prefs) =>
{
    console.log("Toggle puma in background", prefs)
    chrome.storage.local.set(prefs, () =>
    {
        console.log("Toggle puma saved in local storage");
    });
}

const handleOnSwitchOpacity = (prefs) =>
{
    console.log("prefs for opacity received: ", prefs)
    chrome.storage.local.set(prefs, () =>
    {
        console.log("Opacity saved in local storage");
    });
}
