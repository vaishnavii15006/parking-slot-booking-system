package com.examly.springapp.controller;

import com.examly.springapp.model.Vehicle;
import com.examly.springapp.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = {
  "https://8081-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "https://8080-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "http://localhost:8081",
  "http://localhost:3000"
})

public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/user/{userId}")
    public List<Vehicle> getVehiclesByUserId(@PathVariable Long userId) {
        return vehicleService.getVehiclesByUserId(userId);
    }

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return vehicleService.updateVehicle(id, vehicleDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }

    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }
}