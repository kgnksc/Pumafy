(() =>
    {
        const imageFilePath = "assets/images/";
        const numImages = 52;
        const flipExcludedCutoff = 39; //NOTE: this number represents the cutoff for where the non flippable images start
        const flipRandomPercent = 2; //NOTE: the number represents how many numbers to randomly choose. bigger = less likely, smaller = more likely.

        //Variables exposed to the popup:
        let isPumaEnabled = true;
        let opacityPercentage = 100;

        //NOTE: The purpose of this function is to get all YouTube thumbnails on the page
        function getThumbnails()
        {
            if(isPumaEnabled)
            {
                const thumbnailQuery = "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])";

                const thumbnail = document.querySelectorAll(thumbnailQuery);

                thumbnail.forEach((image) =>
                    {
                        let counter = Math.random() > 0.001 ? 1 : 20;
                        let i = 0;
                        for(i = 0; i < counter; i++)
                        {
                            const index = getRandomImage();

                            let flip = getImageState(index);

                            let url = getImageURL(index);
                            applyThumbnails(image, url, flip);
                        }
                    }
                )
            }
        }


        chrome.storage.local.get(["opacity", "toggledPuma"], (result) =>
        {
            if(result.opacity)
            {
                opacityPercentage = result.opacity;
            }
            if(result.toggledPuma !== undefined)
            {

                const { toggledPuma } = result;

                if(typeof toggledPuma === "string")
                {
                    switch (toggledPuma)
                    {
                        case 'On':
                        {
                            isPumaEnabled = true;
                            break;
                        }
                        case 'Off':
                        {
                            isPumaEnabled = false;
                            break;
                        }
                    }
                }
            }
            setInterval(getThumbnails, 100);
        });

        //Ensures that it updates whenever the user changes it
        chrome.storage.onChanged.addListener((changes, areaName) =>
        {
            if(areaName === 'local')
            {
                if(changes.opacity)
                {
                    if(typeof changes.opacity === "number")
                    {
                        opacityPercentage = changes.opacity.newValue;
                    }
                }

                if(changes.toggledPuma !== undefined)
                {
                    if(typeof changes.toggledPuma === "string")
                    {
                        switch(changes.toggledPuma.newValue)
                        {
                            case 'On':
                            {
                                isPumaEnabled = true;
                                break;
                            }
                            case 'Off':
                            {
                                isPumaEnabled = false;
                                break;
                            }
                        }
                    }
                }
                setInterval(getThumbnails, 100);
            }
        });

        //NOTE: The purpose of this function is to return the url of an image
        function getImageURL(index)
        {
            return chrome.runtime.getURL(`${imageFilePath}${index}.png`);
        }

        //NOTE: The purpose of this function is to apply the thumbnail images to the thumbnails on YouTube.com
        function applyThumbnails(image, imageUrl, flip = false)
        {
            if (image.nodeName == "IMG")
            {``
                const overlay = document.createElement("img");
                overlay.src = imageUrl;
                overlay.style.position = "absolute";
                overlay.style.top = "0";
                overlay.style.left = "0";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.zIndex = "0";
                overlay.style.opacity = opacityPercentage / 100.0;

                if(flip)
                {
                    overlay.style.transform = "scaleX(-1)"; //flips the image
                }
                image.style.position = "relative";
                image.parentElement.appendChild(overlay);
            }
            else if (image.nodeName == "DIV")
            {
                image.style.backgroundImage = `url("${imageUrl}"), ` + image.style.backgroundImage;
            }
        }

        //NOTE: The purpose of this function is to take in a max number, and return a random number from 0 to that max number
        function getRandomInt(max)
        {
            return Math.floor(Math.random() * max);
        }

        //NOTE: The purpose of this function is to get a random image to display
        function getRandomImage()
        {
            //NOTE: percent is even across the board for any given image to be chosen

            let random = 0;
            random = getRandomInt(numImages + 1); //NOTE: +1 is because max is not inclusive
            return random;
        }

        //NOTE: The purpose of this function is to randomly determine whether or not to flip the image or not
        function getImageState(num)
        {
            //NOTE: percent to flip is default 50% when flipRandomPercent = 2

            //Prevents flipping non-flippable images
            if(num >= flipExcludedCutoff)
            {
                return false;
            }


            let random = 0;
            random = getRandomInt(flipRandomPercent); //returns a random number from 0 to flipRandomPercent

            if(random === 1)
            {
                return true; //STATE: flip image
            }
            else
            {
                return false; //STATE: do not flip image
            }

        }

        //NOTE: The purpose of this function is to check if an image exists
        async function doesImageExist(index)
        {
            const url = getImageURL(index);

            return fetch(url).then(() =>
            {
                return true
            }).catch(error =>
            {
                return false
            })
        }
    }
)();
