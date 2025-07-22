package com.house.team.user.vo;

import java.util.Date;

public class LoginVO {
	private Long loginNo;
	private Long memNo;
	private String memPw;
	private String provider;
	private String provToken;
	private Date createDt;
	private Date updateDt;
	private String memId;
	
	public String getMemId() {
		return memId;
	}
	public void setMemId(String memId) {
		this.memId = memId;
	}
	public Long getLoginNo() {
		return loginNo;
	}
	public void setLoginNo(Long loginNo) {
		this.loginNo = loginNo;
	}
	public Long getMemNo() {
		return memNo;
	}
	public void setMemNo(Long memNo) {
		this.memNo = memNo;
	}
	public String getMemPw() {
		return memPw;
	}
	public void setMemPw(String memPw) {
		this.memPw = memPw;
	}
	public String getProvider() {
		return provider;
	}
	public void setProvider(String provider) {
		this.provider = provider;
	}
	public String getProvToken() {
		return provToken;
	}
	public void setProvToken(String provToken) {
		this.provToken = provToken;
	}
	public Date getCreateDt() {
		return createDt;
	}
	public void setCreateDt(Date createDt) {
		this.createDt = createDt;
	}
	public Date getUpdateDt() {
		return updateDt;
	}
	public void setUpdateDt(Date updateDt) {
		this.updateDt = updateDt;
	}
	
	
}
