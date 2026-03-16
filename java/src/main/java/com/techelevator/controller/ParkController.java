package com.techelevator.controller;

import com.techelevator.dao.ParkDao;
import com.techelevator.model.Park;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parks")
@CrossOrigin
public class ParkController {

    private final ParkDao parkDao;

    public ParkController(ParkDao parkDao) {
        this.parkDao = parkDao;
    }

    @GetMapping("/states")
    public List<String> getStates() {
        return parkDao.getStates();
    }

    @GetMapping("/cities")
    public List<String> getCities(@RequestParam String state) {
        return parkDao.getCitiesByState(state);
    }

    @GetMapping
    public List<Park> getParks(@RequestParam String city, @RequestParam String state) {
        return parkDao.getParksByCityAndState(city, state);
    }
}
