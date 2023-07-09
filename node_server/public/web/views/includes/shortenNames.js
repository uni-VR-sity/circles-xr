// Shortens file names to display to user

// Table section margins and padding sizes
let sectionMargin = 24 * 3;
let sectionPadding = 300;

// Getting the width of the table sections
let sectionWidth = (document.getElementsByClassName('uploads-table')[0].getBoundingClientRect().width - sectionMargin - sectionPadding) / 3;

// Going through each table section and checking if the length of the file name is greater then the width of the section
// If it is, shorten it
let tableSections = document.getElementsByClassName('file-container');

for (let section of tableSections)
{
    let firstNameElement = section.querySelector('.fileName');
    let name = firstNameElement.innerHTML;
    let nameLength = section.querySelector('.fileName').getBoundingClientRect().width;

    if (nameLength > sectionWidth)
    {
        // The condensed name with be, for example, filena...txt (preserving the file type at the end of the name)
        
        // Getting the file type
        let splitName = name.split('.');
        let type = splitName[splitName.length - 1];

        let condensedName = name;
        
        // Taking a character off the file name until the length of the name is less then the section width
        while (nameLength > sectionWidth)
        {
            // Getting the file name without the type
            condensedName = condensedName.replace('...' + type, '');

            // Removing the last character of the name
            condensedName = condensedName.substring(0, condensedName.length - 1);
            condensedName += '...' + type;

            // Checking the length of the name
            firstNameElement.innerHTML = condensedName;
            nameLength = firstNameElement.getBoundingClientRect().width;
        }

        // Changing all instances of the file name to the condensed version
        let allFileNameElements = section.querySelectorAll('.fileName');

        for (let nameElement of allFileNameElements)
        {
            let currentName = nameElement.innerHTML;

            nameElement.innerHTML = currentName.replace(name, condensedName);
        }
    }
}