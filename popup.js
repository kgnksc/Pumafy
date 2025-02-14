
//Elements:
const opacityDropdown = document.getElementById("opacity");
const togglePumaDropdown = document.getElementById("togglePuma");

opacityDropdown.onchange = SwitchPumaOpacity;
togglePumaDropdown.onchange = TogglePuma;

function TogglePuma()
{
    const prefs =
        {
            toggledPuma : togglePumaDropdown.value
        }
    console.log(togglePumaDropdown.value);
    chrome.runtime.sendMessage({event: 'onTogglePuma', prefs})
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
