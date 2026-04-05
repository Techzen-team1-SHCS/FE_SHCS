/**
 * Validates a staff object and returns an object containing any validation errors.
 * @param {Object} formData 
 * @returns {Object} errors
 */
export const validateStaffForm = (formData) => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters long.";
    }

    if (!formData.age || isNaN(formData.age) || formData.age < 18) {
        errors.age = "Staff must be at least 18 years old.";
    }

    if (!formData.address || formData.address.trim().length < 5) {
        errors.address = "Address is required and must be at least 5 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^[\d\s()+-]{8,15}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.phone = "Please enter a valid contact number.";
    }

    if (!formData.avatar) {
        errors.avatar = "Please upload an avatar.";
    }

    return errors;
};

/**
 * Formats a raw phone number string into a more readable format.
 * Returns the original string if it already contains formatting symbols.
 * @param {string} number 
 */
export const formatPhoneNumber = (number) => {
    if (!number) return '';
    
    // If it already has formatting (e.g. mock data +(63) 955 ...), return as is
    if (number.includes('+') || number.includes('(')) {
        return number;
    }

    // Strip non-numeric characters
    const cleaned = ('' + number).replace(/\D/g, '');
    
    // Default format for 10 digits e.g. 0901234567 -> (090) 123-4567
    if (cleaned.length === 10) {
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
    }
    
    return number;
};
