package com.examly.springapp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.examly.springapp.config.PasswordUtil;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        user.setPasswordHash(PasswordUtil.encodePassword(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> PasswordUtil.checkPassword(password, user.getPasswordHash())).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public void deleteUser(Long id) throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
    
    public User updateUserRole(Long id, String role) throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(role);
        return userRepository.save(user);
    }
     public void changePassword(Long id, String currentPassword, String newPassword) throws ResourceNotFoundException {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    
    // Verify current password
    if (!PasswordUtil.checkPassword(currentPassword, user.getPasswordHash())) {
      throw new RuntimeException("Current password is incorrect");
    }
    
    // Update password
    user.setPasswordHash(PasswordUtil.encodePassword(newPassword));
    userRepository.save(user);
  }
  

//     public User getUserByUsername(String username) {
//     return userRepository.findByUsername(username).orElse(null);
// }
}
