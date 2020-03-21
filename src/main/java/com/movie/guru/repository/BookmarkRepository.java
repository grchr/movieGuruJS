package com.movie.guru.repository;

import com.movie.guru.model.Bookmark;
import com.movie.guru.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long>{
    @Query("SELECT b FROM Bookmark b WHERE b.user = :userId")
    List<Bookmark> findBookmarksByUser(@Param("userId") User userId);

    Bookmark findBookmarkByImdbId(String imdbId);
}
