package com.movie.guru.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Bookmark {

    @Id
    @GeneratedValue
    @Column(name="bookmark_id")
    @Getter @Setter private Long id; //1

    @Column(name="imdb_id")
    @Getter @Setter private String imdbId; //tt0120737

    @Getter @Setter private String title; //

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user", referencedColumnName = "user_id", nullable = false)
    @Getter @Setter private User user; //1

    public void addUser(User user) {
        this.user = user;
        if (user.getBookmarks() == null) {
            List<Bookmark> bookmarks = new ArrayList<>();
            bookmarks.add(this);
            user.setBookmarks(bookmarks);
        } else {
            user.getBookmarks().add(this);
        }
    }
}
