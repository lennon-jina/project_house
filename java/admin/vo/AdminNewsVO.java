package com.house.team.admin.vo;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class AdminNewsVO {
	private int newsNo;
	private String cat;
	private String newsTitle;
	private String newsText;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date uploadDt;
	private String newsImg;
	private String writer;
	private String newsUrl;
	private String delYn;
	
	//Getter,Setter
	public int getNewsNo() {
		return newsNo;
	}
	public void setNewsNo(int newsNo) {
		this.newsNo = newsNo;
	}
	public String getCat() {
		return cat;
	}
	public void setCat(String cat) {
		this.cat = cat;
	}
	public String getNewsTitle() {
		return newsTitle;
	}
	public void setNewsTitle(String newsTitle) {
		this.newsTitle = newsTitle;
	}
	public String getNewsText() {
		return newsText;
	}
	public void setNewsText(String newsText) {
		this.newsText = newsText;
	}
	public Date getUploadDt() {
		return uploadDt;
	}
	public void setUploadDt(Date uploadDt) {
		this.uploadDt = uploadDt;
	}
	public String getNewsImg() {
		return newsImg;
	}
	public void setNewsImg(String newsImg) {
		this.newsImg = newsImg;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public String getNewsUrl() {
		return newsUrl;
	}
	public void setNewsUrl(String newsUrl) {
		this.newsUrl = newsUrl;
	}
	public String getDelYn() {
		return delYn;
	}
	public void setDelYn(String delYn) {
		this.delYn = delYn;
	}
	
	
	

}
