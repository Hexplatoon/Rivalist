package com.hexplatoon.rivalist_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// TODO : Streamline the coding style in the whole project
// TODO : Add comments everywhere
// TODO : Add swagger api doc
// TODO : Create CurrentUserService to get currently authenticated user
// TODO : Create a user service for finding users
@SpringBootApplication
@EnableScheduling
public class RivalistBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RivalistBackendApplication.class, args);
	}

}
