var selectedAvatarId = 1;


function nextAvatar(avatarId) {
    // This function changes the selected avatar to the one with the avatarID + 1
    selectedAvatarId = avatarId + 1;

}


function selectAvatar(avatarId) {
    // This function selects an avatar based on the provided avatarId
    

    console.log(`Avatar with ID ${avatarId} has been selected.`);
}