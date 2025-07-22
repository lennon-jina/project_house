package com.house.team.agent.web;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.house.team.agent.service.FlaskApiClient;

@RestController
@RequestMapping("/agent/agent")
public class ApiAgentController {
	
	private final FlaskApiClient flaskApiClient = new FlaskApiClient();
	
	@PostMapping("/query")
	public ResponseEntity<?> handleQuery(@RequestBody Map<String, String> request) {
		String question = request.get("question");
		if (question == null || question.trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error","질문이 없습니다."));
		}
		try {
			Map<String, Object> flaskResponse = flaskApiClient.sendQuery(question);
			
			return ResponseEntity.ok(flaskResponse);
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error","서버 오류: " + e.getMessage()));
		}
	}
}
