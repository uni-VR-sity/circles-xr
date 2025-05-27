'use strict'

// Helps populate phone animation list
// To use, add the following to index.html <script src="/worlds/Allosaurus-Test/phones/populatePhoneAnimations.js"></script>
// Remove line after population

// ------------------------------------------------------------------------------------------

// Populate from given list 
async function populateFromList(list)
{
    for (var i = 0; i < phoneAnimationList.length; i++)
    {
        phoneAnimationList[i].animation = list[i];
    }

    console.log(phoneAnimationList);
}

//var list = [];
//populateFromList(list);