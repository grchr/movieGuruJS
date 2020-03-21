package com.movie.guru.controller;


import com.movie.guru.model.Bookmark;
import com.movie.guru.model.User;
import com.movie.guru.repository.BookmarkRepository;
import com.movie.guru.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class BookmarkController {

    private final Logger LOGGER = LoggerFactory.getLogger(BookmarkController.class);
    private BookmarkRepository bookmarkRepository;
    private UserRepository userRepository;

    public BookmarkController(BookmarkRepository bookmarkRepository, UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/bookmarks")
    Collection<Bookmark> bookmarks(){
        return bookmarkRepository.findAll();
    }

    @GetMapping("/bookmarks/{userId}")
    ResponseEntity<?> bookmarksByUserId(@PathVariable Long userId){
        Optional<User> result = userRepository.findById(userId);
        User user = result.get();
        List<Bookmark> bookmarkList = bookmarkRepository.findBookmarksByUser(user);
        return ResponseEntity.ok().body(bookmarkList);
    }

    @GetMapping("/bookmark/{bookmarkId}")
    ResponseEntity<?> bookmarksByBookmarkId(@PathVariable Long bookmarkId){
        Optional<Bookmark> result = bookmarkRepository.findById(bookmarkId);
        Bookmark bookmark = result.get();
        return ResponseEntity.ok().body(bookmark);
    }

    @PostMapping("/bookmark")
    ResponseEntity<?> createBookmark(@Valid @RequestBody Bookmark bookmark) throws URISyntaxException {
        Bookmark result = bookmarkRepository.save(bookmark);
        bookmarkRepository.flush();
        return ResponseEntity.created(new URI("/bookmark/" + result.getId())).build();
    }

    @PutMapping("/{bookmarkId")
    ResponseEntity<?> updateBookmark(@Valid @RequestBody Bookmark bookmark) {
        Bookmark result = bookmarkRepository.save(bookmark);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("bookmark/{id}")
    public ResponseEntity<?> deleteBookmark(@PathVariable Long id) {
        bookmarkRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
