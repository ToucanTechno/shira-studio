
const isEmailValidUI = (email: string) => {
    return (email === '' || email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null);
};

const isPhoneValidUI = (phone: string) => {
    return (phone === '' || phone.replace(/-/g, '').match(/^(\+|00)?[0-9]{8,15}$/) !== null)
};

const isPostCodeValidUI = (postCode: string) => {
    return (postCode === '' || postCode.match(/^[0-9]{5}([0-9]{2})?$/) !== null);
}

const getPasswordErrorUI = (password: string): string => {
    // Define regular expressions for different password criteria
    const minLengthRegex = /^.{8,}$/; // at least 8 characters
    const lowercaseRegex = /[a-z]/;  // at least one lowercase letter
    const uppercaseRegex = /[A-Z]/;  // at least one uppercase letter
    const digitRegex = /\d/;         // at least one digit
    // const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // at least one special character

    // Check if the password meets all criteria
    if (!minLengthRegex.test(password)) {
        return 'Password must be at least 8 characters long.';
    }

    if (!lowercaseRegex.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }

    if (!uppercaseRegex.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }

    if (!digitRegex.test(password)) {
        return 'Password must contain at least one digit.';
    }

    // if (!specialCharRegex.test(password)) {
    //     return 'Password must contain at least one special character.';
    // }

    // If all checks pass, the password is considered strong
    return '';
}

export { isEmailValidUI, isPhoneValidUI, isPostCodeValidUI, getPasswordErrorUI}