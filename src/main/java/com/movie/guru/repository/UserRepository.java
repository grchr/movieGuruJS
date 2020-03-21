package com.movie.guru.repository;

import com.movie.guru.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByName(String name);

    User findByEmail(String name);

    User findByNameAndAndPassword(String name, String password);
}
