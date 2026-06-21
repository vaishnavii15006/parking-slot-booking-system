package com.examly.springapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class ParkingSlotBookingSystemApplication {


	public static void main(String[] args) {
		SpringApplication.run(ParkingSlotBookingSystemApplication.class, args);
		// System.out.println(new BCryptPasswordEncoder().encode("vaish1503"));
	}

}
