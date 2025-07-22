package com.house.team.admin.vo;

public class MemberBookmarkVO {
	private String cmpxCd;
	private String cmpxNm;
	private String delYn;
	
	// Getter, Setter
	public String getCmpxCd() {
		return cmpxCd;
	}
	public void setCmpxCd(String cmpxCd) {
		this.cmpxCd = cmpxCd;
	}
	public String getCmpxNm() {
		return cmpxNm;
	}
	public void setCmpxNm(String cmpxNm) {
		this.cmpxNm = cmpxNm;
	}
	public String getDelYn() {
		return delYn;
	}
	public void setDelYn(String delYn) {
		this.delYn = delYn;
	}
	
	public MemberBookmarkVO() {
		
	}
	public MemberBookmarkVO(String cmpxCd, String cmpxNm, String delYn) {
		this.cmpxCd = cmpxCd;
		this.cmpxNm = cmpxNm;
		this.delYn = delYn;
	}
	
}
