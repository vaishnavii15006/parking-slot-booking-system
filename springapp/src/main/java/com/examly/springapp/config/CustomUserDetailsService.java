// package com.examly.springapp.config;

// import com.examly.springapp.model.User;
// import com.examly.springapp.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import java.util.ArrayList;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     @Autowired
//     private UserRepository userRepository;

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         Optional<User> userOptional = userRepository.findByUsername(username);
        
//         if (userOptional.isEmpty()) {
//             throw new UsernameNotFoundException("User not found: " + username);
//         }
        
//         User user = userOptional.get();
        
//         // Create authorities based on user role
//         List<GrantedAuthority> authorities = new ArrayList<>();
//         authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        
//         return org.springframework.security.core.userdetails.User.builder()
//                 .username(user.getUsername())
//                 .password(user.getPasswordHash())
//                 .authorities(authorities)
//                 .build();
//     }
// }