package com.movie.guru.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue
    @Column(name="user_id")
    @Getter @Setter private Long id; //1

    @Getter @Setter private String name; //xlapatsas

    @Getter @Setter private String email; //kakkalos@haf.com

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter private String password; //1234

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Getter @Setter private List<Bookmark> bookmarks;

    public void addBookmark(Bookmark bookmark) {
        bookmark.setUser(this);
        if (this.getBookmarks() == null) {
            List<Bookmark> bookmarks = new ArrayList<>();
            bookmarks.add(bookmark);
            this.setBookmarks(bookmarks);
        } else {
            this.getBookmarks().add(bookmark);
        }
    }
}
