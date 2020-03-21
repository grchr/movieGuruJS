package com.movie.guru.controller;

import com.movie.guru.model.Bookmark;
import com.movie.guru.model.User;
import com.movie.guru.repository.BookmarkRepository;
import com.movie.guru.repository.UserRepository;
import com.movie.guru.utils.ValidationUtils;
import com.movie.guru.utils.helpers.model.Credential;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final Logger LOGGER = LoggerFactory.getLogger(BookmarkController.class);
    private UserRepository userRepository;
    private BookmarkRepository bookmarkRepository;

    public UserController(UserRepository userRepository, BookmarkRepository bookmarkRepository) {
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    @GetMapping("/{username}")
    ResponseEntity<?> getUserByName(@PathVariable String username) {
        User result = userRepository.findByName(username);
        result.setPassword(null);
        return ResponseEntity.ok().body(result);
    }

    //Post mapping preferred over get. Get requests have empty payloads and would need to pass credentials as query params in url
    @PostMapping("/signin")
    ResponseEntity<?> signIn(@Valid @RequestBody Credential credential) {
        User user = userRepository.findByNameAndAndPassword(credential.getName(), credential.getPassword());
        if (user != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Username or password wrong");
        }
    }

    //TODO: replace error builder with json response
    @PostMapping("/signup")
    ResponseEntity<?> signUp(@Valid @RequestBody User user) throws URISyntaxException {
        StringBuilder errorBuilder = new StringBuilder();
        if (ValidationUtils.signUpContainsEmptyValues(user)) {
            errorBuilder.append("* Please fill all input fields.\n");
        }
        if (!ValidationUtils.isValidEmailFormat(user.getEmail())) {
            errorBuilder.append("* Please provide a valid email.\n");
        }
        User sameUsername = userRepository.findByName(user.getName());
        User sameEmail = userRepository.findByEmail(user.getEmail());
        if (sameUsername != null) {
            errorBuilder.append("* Username already exists.\n");
        }
        if (sameEmail != null) {
            errorBuilder.append("* Email already exists.\n");
        }
        if (!errorBuilder.toString().isEmpty()) {
            return ResponseEntity.badRequest().body(errorBuilder.toString());
        }
        User result = userRepository.save(user);
        userRepository.flush();
        return ResponseEntity.created(new URI("/users/" + result.getName())).build();
    }

    @PutMapping("/update")
    ResponseEntity<?> updateUserInfo(@Valid @RequestBody User user) {
        if (user.getPassword() == null) {
            //username cannot change
            Optional<User> storedUser = userRepository.findById(user.getId());
            user.setPassword(storedUser.get().getPassword());
        }
        List<Bookmark> bookmarkList = bookmarkRepository.findBookmarksByUser(user);
        user.setBookmarks(bookmarkList);
        User result = userRepository.save(user);
        userRepository.flush();
        return ResponseEntity.ok(result);
    }

}
