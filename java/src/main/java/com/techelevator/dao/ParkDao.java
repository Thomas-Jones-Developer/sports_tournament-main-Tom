package com.techelevator.dao;

import com.techelevator.model.Park;
import java.util.List;

public interface ParkDao {
    List<String> getStates();
    List<String> getCitiesByState(String state);
    List<Park> getParksByCityAndState(String city, String state);
}