package com.movie.guru.model;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ModelTests {

    @Test
    public void addUserToBookmarkTest() {
        User user = new User();
        user.setName("xlapatsas");
        user.setEmail("kakalos@haf.com");
        user.setPassword("1234");

        Bookmark bookmark = new Bookmark();
        bookmark.setImdbId("tt0120737");
        bookmark.setTitle("The Lord of the Rings: The Fellowship of the Ring");
        bookmark.addUser(user);

        assertEquals(bookmark.getUser().getEmail(), "kakalos@haf.com");
    }
}
