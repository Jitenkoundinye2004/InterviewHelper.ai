export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};



export const getInitials = (title) => {
    if (!title) return ""; // Changed from if (title) to if (!title)

    const words = title.split(" ");
    let initials = ""; // Changed from Initials to initials (lowercase)

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0]; // Changed from Initials to initials
    }

    return initials.toUpperCase(); // Changed from Initials to initials
};