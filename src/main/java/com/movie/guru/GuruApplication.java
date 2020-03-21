package com.movie.guru;

import com.movie.guru.model.Bookmark;
import com.movie.guru.model.User;
import com.movie.guru.repository.BookmarkRepository;
import com.movie.guru.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class GuruApplication extends SpringBootServletInitializer implements CommandLineRunner {


    private final Logger LOGGER = LoggerFactory.getLogger(GuruApplication.class);
    private BookmarkRepository bookmarkRepository;
    private UserRepository userRepository;

    public GuruApplication(BookmarkRepository bookmarkRepository, UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
    }
    public static void main(String[] args) {
        SpringApplication.run(GuruApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(GuruApplication.class);
    }

    @Override
    public void run(String... args) throws Exception {
        User user = new User();
        user.setName("xlapatsas");
        user.setEmail("kakalos@haf.com");
        user.setPassword("1234");

        Bookmark bookmark = new Bookmark();
        bookmark.setImdbId("tt0120737");
        bookmark.setTitle("The Lord of the Rings: The Fellowship of the Ring");
        bookmark.addUser(user);
        userRepository.save(user);
        LOGGER.info("Application Started !!");
    }

}
