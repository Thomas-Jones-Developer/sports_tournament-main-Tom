package com.techelevator.dao;

import java.util.ArrayList;
import java.util.List;

import com.techelevator.exception.DaoException;
import com.techelevator.model.RegisterUserDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.techelevator.model.User;

@Component
public class JdbcUserDao implements UserDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcUserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public User getUserById(int userId) {
        User user = null;
        String sql = "SELECT user_id, username, password_hash, role, first_name, last_name, email FROM users WHERE user_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, userId);
            if (results.next()) {
                user = mapRowToUser(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return user;
    }

    @Override
    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT user_id, username, password_hash, role, first_name, last_name, email FROM users";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                User user = mapRowToUser(results);
                users.add(user);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return users;
    }

    @Override
    public User getUserByUsername(String username) {
        if (username == null) throw new IllegalArgumentException("Username cannot be null");
        User user = null;
        String sql = "SELECT user_id, username, password_hash, role, first_name, last_name, email FROM users WHERE LOWER(username) = LOWER(TRIM(?))";
        try {
            SqlRowSet rowSet = jdbcTemplate.queryForRowSet(sql, username);
            if (rowSet.next()) {
                user = mapRowToUser(rowSet);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return user;
    }

    @Override
    public User createUser(RegisterUserDto user) {
        User newUser = null;
        String insertUserSql = """
            INSERT INTO users (username, password_hash, role, first_name, last_name, email) 
            VALUES (LOWER(TRIM(?)), ?, ?, ?, ?, ?) RETURNING user_id
            """;
        String password_hash = new BCryptPasswordEncoder().encode(user.getPassword());
        String ssRole = user.getRole().toUpperCase().startsWith("ROLE_") ? user.getRole().toUpperCase() : "ROLE_" + user.getRole().toUpperCase();
        try {
            int newUserId = jdbcTemplate.queryForObject(
                    insertUserSql,
                    int.class,
                    user.getUsername(),
                    password_hash,
                    ssRole,
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail()
            );
            newUser = getUserById(newUserId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return newUser;
    }

    //
    @Override
    public User updateUser(int id, User user) throws DaoException {
        String sql = "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ? WHERE user_id = ?";
        try {
            jdbcTemplate.update(sql,
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    id
            );
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return user;
    }

    @Override
    public int deleteUser(int userId) {
        try {
//            // First, delete user authorities if you have a separate table
//            jdbcTemplate.update("DELETE FROM user_authorities WHERE user_id = ?", userId);

            // Then delete the user
            jdbcTemplate.update("DELETE FROM users WHERE user_id = ?", userId);
        } catch (CannotGetJdbcConnectionException | DataIntegrityViolationException e) {
            throw new DaoException("Failed to delete user", e);
        }
        return userId;
    }

    private User mapRowToUser(SqlRowSet rs) {
        User user = new User();
        user.setId(rs.getInt("user_id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password_hash"));
        String role = rs.getString("role");
        if (role == null) {
            role = "ROLE_USER"; // default role
        }
        // at this point you don't really need to do the if statements
        user.setAuthorities(role);
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setEmail(rs.getString("email"));
        user.setActivated(true);
        return user;
    }
}
