// Standalone code for Circles World

// Adding Circles code when html body is done loading
window.addEventListener('load', function() 
{
    // Getting user scripts to be reloaded
    let userScripts = document.getElementsByTagName('script');

    let userScriptsFiltered = [];

    for (const script of userScripts)
    {
        if (script.src !== 'https://3f2c-190-113-101-35.ngrok-free.app/standalone-circles')
        {
            let splitSRC = script.src.split('/');
            userScriptsFiltered.push('scripts/' + splitSRC[splitSRC.length - 1]);
            
            // Removing the script
            script.remove();
        }
    }

    // Adding code to the head of the HTML document
    document.getElementsByTagName('head')[0].innerHTML += 'start-scripts-part';

    // Reloading user scripts
    for (const script of userScripts)
    {
        let newScriptElement = document.createElement('script');
        newScriptElement.setAttribute('src', script);

        document.getElementsByTagName('head')[0].appendChild(newScriptElement);
    }

    // Adding code to the body of the HTML document
    let bodyHTML = document.getElementsByTagName('body')[0].innerHTML;

    bodyHTML = bodyHTML.replace(/<circles-start-ui(\s+)?>(\s+)?<\/circles-start-ui>/i, 'start-ui-part');
    bodyHTML = bodyHTML.replace(/circles_scene_properties/i, 'scene-part');
    bodyHTML = bodyHTML.replace(/<circles-assets(\s+)?>(\s+)?<\/circles-assets>/i, 'assets-part');
    bodyHTML = bodyHTML.replace(/<circles-manager-avatar(\s+)?>(\s+)?<\/circles-manager-avatar>/i, 'avatar-part');
    bodyHTML = bodyHTML.replace(/<circles-end-scripts(\s+)?>(\s+)?<\/circles-end-scripts>/i, 'end-part');

    document.getElementsByTagName('body')[0].innerHTML = bodyHTML;
});