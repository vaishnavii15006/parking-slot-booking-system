// package com.examly.springapp.config;

// import com.examly.springapp.model.User;
// import com.examly.springapp.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import java.util.Optional;

// @Component
// public class DataInitializer implements CommandLineRunner {

//     @Autowired
//     private UserRepository userRepository;

//     @Override
//     public void run(String... args) throws Exception {
//         // Create admin user if it doesn't exist
//         Optional<User> adminUser = userRepository.findByUsername("vaishnavi");
//         if (adminUser.isEmpty()) {
//             User admin = new User();
//             admin.setUsername("vaishnavi");
//             admin.setPasswordHash(PasswordUtil.encodePassword("vaish1503"));
//             admin.setRole("ADMIN");
//             userRepository.save(admin);
//             System.out.println("Admin user 'vaishnavi' created successfully!");
//         } else {
//             System.out.println("Admin user 'vaishnavi' already exists!");
//         }
//     }
// }