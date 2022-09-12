module.exports.RegisterValidation = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username name cannot be an empty field'
    }
    if (email.trim() === '') {
        errors.email = 'Email address cannot be an empty string'
    } else {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email.match(regex)) {
          errors.email = 'Email must be a valid email address'  
        }
    }
    if (password === '') {
        errors.password = 'Password cannot be an empty field'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Both Passwords must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.LoginValidation = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username name cannot be an empty field'
    }
    if (password === '') {
        errors.password = 'Password cannot be an empty field'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}