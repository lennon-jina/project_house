package com.house.team.user.vo;

import java.util.Date;

public class MemberVO {
	private String cmpxCd;
	private Long memNo;
	private String memEmail;
	private String memNick;
	private Date createDt;
	private Date updateDt;
	private String useYn;
	//Type 추가
	private String userType;
	private String aptName;
	private int dongNo;
	private int roomNo;
	private String profileImg;
	
	public String getProfileImg() {
		return profileImg;
	}
	public void setProfileImg(String profileImg) {
		this.profileImg = profileImg;
	}
	public String getAptName() {
		return aptName;
	}
	public void setAptName(String aptName) {
		this.aptName = aptName;
	}
	public String getCmpxCd() {
        return cmpxCd;
	}

	public void setCmpxCd(String cmpxCd) {
        this.cmpxCd = cmpxCd;
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
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
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
	public String getMemNick() {
		return memNick;
	}
	public void setMemNick(String memNick) {
		this.memNick = memNick;
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
	
	
}
