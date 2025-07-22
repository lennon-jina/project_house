package com.house.team.user.vo;

public class RegisterRequest {
	private String username;
	private String email;
	private String nickname;
	private String password;
	
	public String getId() {
		return username;
	}
	public void setId(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
