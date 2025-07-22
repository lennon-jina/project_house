package com.house.team.admin.vo;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

public class AdminMemberVO {
	private Long memNo;
	private String memEmail;
	private String nickname;
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date createDt;
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date updateDt;
	private String useYn;
	private String memId;
	private String memPw;
	private String userType;
	private String aptName;
	private int dongNo;
	private int roomNo;
	private String cmpxCd;
	
	private List<MemberBookmarkVO> bmList;
	
	
	// Getter, Setter
	public Long getMemNo() {
		return memNo;
	}
	public void setMemNo(Long memNo) {
		this.memNo = memNo;
	}
	public String getMemEmail() {
		return memEmail;
	}
	public void setMemEmail(String memEmail) {
		this.memEmail = memEmail;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
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
	public String getUseYn() {
		return useYn;
	}
	public void setUseYn(String useYn) {
		this.useYn = useYn;
	}
	public String getMemId() {
		return memId;
	}
	public void setMemId(String memId) {
		this.memId = memId;
	}
	public String getMemPw() {
		return memPw;
	}
	public void setMemPw(String memPw) {
		this.memPw = memPw;
	}
	public List<MemberBookmarkVO> getBmList() {
		return bmList;
	}
	public void setBmList(List<MemberBookmarkVO> bmList) {
		this.bmList = bmList;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public String getAptName() {
		return aptName;
	}
	public void setAptName(String aptName) {
		this.aptName = aptName;
	}
	public int getDongNo() {
		return dongNo;
	}
	public void setDongNo(int dongNo) {
		this.dongNo = dongNo;
	}
	public int getRoomNo() {
		return roomNo;
	}
	public void setRoomNo(int roomNo) {
		this.roomNo = roomNo;
	}
	public String getCmpxCd() {
		return cmpxCd;
	}
	public void setCmpxCd(String cmpxCd) {
		this.cmpxCd = cmpxCd;
	}
	
	
}
