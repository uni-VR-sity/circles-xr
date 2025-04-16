// Shortens file names to display to user

// Getting the width of file elements
var sectionWidth = document.getElementsByClassName('file')[0].getBoundingClientRect().width;

// Taking 60px off of the width for padding
sectionWidth -= 60;

// Going through each file element and checking if the length of the file name is greater then the width of the section
// If it is, shorten it
var fileSections = document.getElementsByClassName('file');

for (var section of fileSections)
{
    var nameElement = section.querySelector('.file-name');
    var fileName = nameElement.innerHTML;
    var nameLength = section.querySelector('.file-name').getBoundingClientRect().width;

    if (nameLength > sectionWidth)
    {
        // The condensed name with be, for example, filena...txt (preserving the file type at the end of the name)
        
        // Getting the file type
        var splitName = fileName.split('.');
        var type = splitName[splitName.length - 1];

        var condensedName = fileName;
        
        // Taking a character off the file name until the length of the name is less then the section width
        while (nameLength > sectionWidth)
        {
            // Getting the file name without the type
            condensedName = condensedName.replace('...' + type, '');

            // Removing the last character of the name
            condensedName = condensedName.substring(0, condensedName.length - 1);
            condensedName += '...' + type;

            // Checking the length of the name
            nameElement.innerHTML = condensedName;
            nameLength = nameElement.getBoundingClientRect().width;
        }

        // Changing all instances of the file name to the condensed version
        var allFileNameElements = section.querySelectorAll('.file-name');

        for (var nameElement of allFileNameElements)
        {
            var currentName = nameElement.innerHTML;

            nameElement.innerHTML = currentName.replace(fileName, condensedName);
        }
    }
}