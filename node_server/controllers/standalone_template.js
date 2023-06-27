// Standalone code for Circles World
// standalone.js will fill in on server start

// Adding Circles code parts when html body is done loading
// -------------------------------------------------------------------------------------------------------------------------------------------------------
window.addEventListener('load', function() 
{
    console.log('start standalone');
    
    // Getting user scripts to be reloaded
    const userScripts = document.getElementsByTagName('script');

    let userScriptsFiltered = [];
    let length = userScripts.length;
    
    for (let i = 0; i < length; i++)
    {
        if (userScripts[i].src !== 'central-domain' + '/standalone-circles')        // central-domain is replaced
        {
            let splitSRC = userScripts[i].src.split('/');
            userScriptsFiltered.push('scripts/' + splitSRC[splitSRC.length - 1]);

            // Removing user script
            userScripts[i].remove();

            // Setting the index and length back as an element was removed
            i -= 1;
            length -= 1;
        }
    }

    // Adding code to the head of the HTML document
    document.getElementsByTagName('head')[0].innerHTML += 'start-scripts-part';     // start-scripts-part is replaced

    // Reloading user scripts
    for (const script of userScriptsFiltered)
    {
        let newScriptElement = document.createElement('script');
        newScriptElement.setAttribute('src', script);

        document.getElementsByTagName('head')[0].appendChild(newScriptElement);
    }
    
    // Adding code to the body of the HTML document
    let bodyHTML = document.getElementsByTagName('body')[0].innerHTML;

    bodyHTML = bodyHTML.replace(/<circles-start-ui(\s+)?>(\s+)?<\/circles-start-ui>/i, 'start-ui-part');                // start-ui-part is replaced
    bodyHTML = bodyHTML.replace(/circles_scene_properties/i, 'scene-part');                                             // scene-part is replaced
    bodyHTML = bodyHTML.replace(/<circles-assets(\s+)?>(\s+)?<\/circles-assets>/i, 'assets-part');                      // assets-part is replaced
    bodyHTML = bodyHTML.replace(/<circles-manager-avatar(\s+)?>(\s+)?<\/circles-manager-avatar>/i, 'avatar-part');      // avatar-part is replaced
    bodyHTML = bodyHTML.replace(/<circles-end-scripts(\s+)?>(\s+)?<\/circles-end-scripts>/i, 'end-part');               // end-part is replaced

    document.getElementsByTagName('body')[0].innerHTML = bodyHTML;
});

//
// -------------------------------------------------------------------------------------------------------------------------------------------------------

