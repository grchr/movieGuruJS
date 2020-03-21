package com.movie.guru.utils;

import com.movie.guru.model.User;

public class ValidationUtils {

    private static final String EMAIL_REGEX = "^[\\w-\\+]+(\\.[\\w]+)*@[\\w-]+(\\.[\\w]+)*(\\.[a-z]{2,})$";

    /**
     * Is valid email format boolean.
     *
     * @param email the email
     * @return the boolean
     */
    public static boolean isValidEmailFormat(final String email) {

        if (email != null) {
            return email.matches(EMAIL_REGEX);
        }

        return false;
    }

    /**
     * Validates if sign up user object has empty values
     * @param user
     * @return
     */
    public static boolean signUpContainsEmptyValues(User user) {
        if (user.getName() == null || user.getName().isEmpty()) {
            return true;
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return true;
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return true;
        }
        return false;
    }
}
