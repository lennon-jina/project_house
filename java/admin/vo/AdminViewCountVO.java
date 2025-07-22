package com.house.team.admin.vo;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class AdminViewCountVO {
	private long viewLogId;
	private String boardCategory;
	private int memNo;
	private long boardNo;
	@DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date viewDt;
	
	private String yearMonth; // 월별 집계 
    private String dayOfWeek; // 요일별 집계
    private int viewCount;    // 조회수
	
	//Getter, Setter
	public long getViewLogId() {
		return viewLogId;
	}
	public void setViewLogId(long viewLogId) {
		this.viewLogId = viewLogId;
	}
	public String getBoardCategory() {
		return boardCategory;
	}
	public void setBoardCategory(String boardCategory) {
		this.boardCategory = boardCategory;
	}
	public int getMemNo() {
		return memNo;
	}
	public void setMemNo(int memNo) {
		this.memNo = memNo;
	}
	public long getBoardNo() {
		return boardNo;
	}
	public void setBoardNo(long boardNo) {
		this.boardNo = boardNo;
	}
	public Date getViewDt() {
		return viewDt;
	}
	public void setViewDt(Date viewDt) {
		this.viewDt = viewDt;
	}
	
	public String getYearMonth() {
		return yearMonth;
	}
	public void setYearMonth(String yearMonth) {
		this.yearMonth = yearMonth;
	}
	public String getDayOfWeek() {
		return dayOfWeek;
	}
	public void setDayOfWeek(String dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	public int getViewCount() {
		return viewCount;
	}
	public void setViewCount(int viewCount) {
		this.viewCount = viewCount;
	}
	public AdminViewCountVO(String boardCategory, int memNo, long boardNo) {
        this.boardCategory = boardCategory;
        this.memNo = memNo;
        this.boardNo = boardNo;
    }
	public AdminViewCountVO() {
	}
	
}
