package com.house.team.admin.vo;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class AdminNoticeVO {
	private int noticeNo;
	private Long memNo;
	private String noticeTitle;
	private String noticeText;
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date createDt;
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date updateDt;
	private int viewCnt;
	private String delYn;
	
	// Getter, Setter
	public int getNoticeNo() {
		return noticeNo;
	}
	public void setNoticeNo(int noticeNo) {
		this.noticeNo = noticeNo;
	}
	public Long getMemNo() {
		return memNo;
	}
	public void setMemNo(Long memNo) {
		this.memNo = memNo;
	}
	public String getNoticeTitle() {
		return noticeTitle;
	}
	public void setNoticeTitle(String noticeTitle) {
		this.noticeTitle = noticeTitle;
	}
	public String getNoticeText() {
		return noticeText;
	}
	public void setNoticeText(String noticeText) {
		this.noticeText = noticeText;
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
	public int getViewCnt() {
		return viewCnt;
	}
	public void setViewCnt(int viewCnt) {
		this.viewCnt = viewCnt;
	}
	public String getDelYn() {
		return delYn;
	}
	public void setDelYn(String delYn) {
		this.delYn = delYn;
	}
	

}
