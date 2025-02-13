
//Elements:
const opacityDropdown = document.getElementById("opacity");
const togglePumaDropdown = document.getElementById("togglePuma");
const toggleTextDropdown = document.getElementById("toggleText")

opacityDropdown.onchange = SwitchPumaOpacity;
togglePumaDropdown.onchange = TogglePuma;
toggleTextDropdown.onchange = ToggleText;

function TogglePuma()
{
    const prefs =
        {
            toggledPuma : togglePumaDropdown.value
        }
    console.log(togglePumaDropdown.value);
    chrome.runtime.sendMessage({event: 'onToggleCats', prefs})
    console.log("Sending togglePuma event");
}

function SwitchPumaOpacity()
{
    const prefs =
        {
            opacity: opacityDropdown.value
        }
    console.log(opacityDropdown.value);
    chrome.runtime.sendMessage({event: 'onSwitchOpacity', prefs})
    console.log("Sending switchOpacity event");
}

function ToggleText()
{
    const prefs =
        {
            toggledText : toggleTextDropdown.value
        }
        console.log(toggleTextDropdown.value);
    chrome.runtime.sendMessage({event: 'onToggleText', prefs})
    console.log("Sending toggleText event");
}

//NOTE: Ensures that the opacity preferences will be saved
chrome.storage.local.get(["opacity"], (result) =>
{
    const { opacity } = result;

    if(opacity)
    {
        opacityDropdown.value = opacity;
    }
})

//NOTE: Ensures that the toggle puma preferences will be saved
chrome.storage.local.get(["toggledPuma"], (result ) =>
{
    const { toggledPuma } = result;

    if(toggledPuma)
    {
        togglePumaDropdown.value = toggledPuma;
    }
})

//NOTE: Ensures the the toggle text preferences will be saved
chrome.storage.local.get(["toggledText"], (result) =>
{
    const { toggledText } = result;

    if(toggledText)
    {
        toggleTextDropdown.value = toggledText;
    }
})
