
package com.examly.springapp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
  "https://8081-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "https://8080-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "http://localhost:8081",
  "http://localhost:3000"
})

public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public Object registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping
    public User loginUser(@RequestParam String username, @RequestParam String password) {
        return userService.loginUser(username, password);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) throws ResourceNotFoundException {
        userService.deleteUser(id);
    }
    
    @PutMapping("/{id}/role")
    public User updateUserRole(@PathVariable Long id, @RequestParam String role) throws Exception {
        return userService.updateUserRole(id, role);
    }
     @PutMapping("/{id}/password")
  public ResponseEntity<Map<String, String>> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
    try {
      String currentPassword = passwordData.get("currentPassword");
      String newPassword = passwordData.get("newPassword");
      
      if (currentPassword == null || newPassword == null) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Current password and new password are required");
        return ResponseEntity.badRequest().body(error);
      }
      
      userService.changePassword(id, currentPassword, newPassword);
      Map<String, String> success = new HashMap<>();
      success.put("message", "Password changed successfully");
      return ResponseEntity.ok(success);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(error);
    }
  }

    
//     @GetMapping("/me")
// public User getCurrentUser() {
//     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//     String username = authentication.getName();
//     return userService.getUserByUsername(username);
// }
}
