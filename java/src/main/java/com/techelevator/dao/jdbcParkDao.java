package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Park;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcParkDao implements ParkDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcParkDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<String> getStates() {
        List<String> states = new ArrayList<>();
        String sql = "SELECT DISTINCT state FROM parks ORDER BY state";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql);
        while (rs.next()) {
            states.add(rs.getString("state"));
        }
        return states;
    }

    @Override
    public List<String> getCitiesByState(String state) {
        List<String> cities = new ArrayList<>();
        String sql = "SELECT DISTINCT city FROM parks WHERE state = ? ORDER BY city";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, state);
        while (rs.next()) {
            cities.add(rs.getString("city"));
        }
        return cities;
    }

    @Override
    public List<Park> getParksByCityAndState(String city, String state) {
        List<Park> parks = new ArrayList<>();
        String sql = "SELECT park_id, park_name, address, city, state " +
                "FROM parks WHERE city = ? AND state = ? ORDER BY park_name";
        try {
            SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, city, state);
            while (rs.next()) {
                Park park = new Park();
                park.setParkId(rs.getInt("park_id"));
                park.setParkName(rs.getString("park_name"));
                park.setAddress(rs.getString("address"));
                park.setCity(rs.getString("city"));
                park.setState(rs.getString("state"));
                parks.add(park);
            }
        } catch (DataAccessException e) {
            throw new DaoException("Error retrieving parks", e);
        }
        return parks;
    }
}
