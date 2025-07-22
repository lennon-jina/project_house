package com.house.team.intro.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IntroController {
	
	 @GetMapping("/sub1")
	 public String introPage1() {
		 return "intro/sub1";
	 }
	 
	 @GetMapping("/sub2")
	 public String introPage2() {
		 return "intro/sub2";
	 }
}
