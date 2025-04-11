package com.hexplatoon.rivalist_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// TODO : Streamline the coding style in the whole project
// TODO : Add comments everywhere
// TODO : Add swagger api doc
// TODO : Create CurrentUserService to get currently authenticated user
// TODO : Create a user service for finding users
// TODO : Add forfeit and submit
// TODO : Use a map for storing battle details and save them
// TODO : Make all the battlehandlerservices Lazy
// TODO : Fix bug where a person can send challenge to his friend in the battle waiting state
@SpringBootApplication
@EnableScheduling
public class RivalistBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RivalistBackendApplication.class, args);
	}

}
