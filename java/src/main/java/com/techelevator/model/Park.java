package com.techelevator.model;

public class Park {
    private int parkId;
    private String parkName;
    private String address;
    private String city;
    private String state;

    public int getParkId() { return parkId; }
    public void setParkId(int parkId) { this.parkId = parkId; }
    public String getParkName() { return parkName; }
    public void setParkName(String parkName) { this.parkName = parkName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}