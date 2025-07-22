package com.house.team.main.web;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Controller
public class MainController {

	@GetMapping("/")
    public String mainPage() {
        return "main/index";
    }
	
    @GetMapping("/login")
    public String loginPage() {
        return "main/login";
    }
}
