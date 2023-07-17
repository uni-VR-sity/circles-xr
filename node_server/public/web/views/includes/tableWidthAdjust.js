// Getting the table
let table = document.getElementsByClassName('uploads-table')[0];

// Getting the width of the table sections
let width = (table.getBoundingClientRect().width) / 3;

// Changing the table to have a max width of 100% 
// (For when there is only 1 for 2 files uploaded, to still be displayed with the correct proportions)
table.style.width = 'auto';
table.style.maxWidth = '100%';

// Getting all table sections
let sections = table.querySelectorAll('.file-table-section');

// Adjusting width of all table sections to be a third of the width of the table
for (let section of sections)
{
    section.style.width = width;
}