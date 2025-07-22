package com.house.team.agent.service;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class FlaskApiClient {
	private final RestTemplate restTemplate = new RestTemplate();
	private final String flaskUrl = "http://localhost:5000/query";
	
	public Map<String, Object> sendQuery(String question) {
		Map<String, String> body = Map.of("question", question);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
		
		ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);
		if (response.getStatusCode() == HttpStatus.OK) {
			return response.getBody();
		} else {
			throw new RuntimeException("Flask API 호출 실패: " + response.getStatusCode());
		}
		
	}
}
