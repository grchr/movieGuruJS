package com.movie.guru.utils.helpers.model;


import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credential {

    @NonNull
    @Getter
    @Setter
    private String name;

    @NotNull
    @Getter
    @Setter
    private String password;
}
