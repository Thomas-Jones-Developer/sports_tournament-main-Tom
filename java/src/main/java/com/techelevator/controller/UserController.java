package com.techelevator.controller;

import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.RegisterUserDto;
import com.techelevator.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * The UserController is a class for handling HTTP Requests related to getting User information.
 *
 * It depends on an instance of a UserDAO for retrieving and storing data. This is provided
 * through dependency injection.
 *
 * Note: This class does not handle authentication (registration/login) of Users. That is
 * handled separately in the AuthenticationController.
 */
@RestController
@CrossOrigin
@PreAuthorize("isAuthenticated()")
@RequestMapping( path = "/users")
public class UserController {

    private UserDao userDao;

    public UserController(UserDao userDao) {
        this.userDao = userDao;
    }

    @PreAuthorize("permitAll()")
    @RequestMapping(method = RequestMethod.GET)
    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();

        try {
            users = userDao.getUsers();
        }
        catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return users;
    }






    @RequestMapping(path = "/{userId}", method = RequestMethod.GET)
    public User getById(@PathVariable int userId, Principal principal) {
        User user = null;

        try {
            user = userDao.getUserById(userId);
        }
        catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return user;
    }

    //Add DELETE user function here
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.NO_CONTENT)  // 204 No Content on successful delete
    @RequestMapping(path = "/{userId}", method = RequestMethod.DELETE)
    public void deleteUser(@PathVariable int userId, Principal principal) {
        try {
            User existingUser = userDao.getUserById(userId);
            if (existingUser == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
            }

            userDao.deleteUser(userId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete user.");
        }
    }


//PUT function right here (updates user information
@ResponseStatus(HttpStatus.OK)
@RequestMapping(path = "/{userId}", method = RequestMethod.PUT)
public User updateUser(@PathVariable int userId, @Valid @RequestBody User updatedUser, Principal principal) {
    try {
        User existingUser = userDao.getUserById(userId);
        if (existingUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }

        // Sync ID to path
        updatedUser.setId(userId);

        // DAO now reads updatedUser.getRole(), which updates authorities automatically
        return userDao.updateUser(userId, updatedUser);

    } catch (DaoException e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User update failed.");
    }
}

    // Example of a helper method for admin check (could be in a service)
    private boolean isAdmin(Principal principal) {
        User currentUser = userDao.getUserByUsername(principal.getName());
        if (currentUser == null) {
            return false;
        }
        // Check if authorities contain ROLE_ADMIN
        return currentUser.getAuthorities().stream()
                .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getName()));
    }
}
