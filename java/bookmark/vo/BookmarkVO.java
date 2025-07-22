package com.house.team.bookmark.vo;

import java.sql.Date;

public class BookmarkVO {
    private Long markNo;
    private Long memNo;
    private String cmpxCd;
    private String cmpxNm;
    private Date apprDt;
    private int unitTot;

    public String getCmpxNm() {
		return cmpxNm;
	}

	public void setCmpxNm(String cmpxNm) {
		this.cmpxNm = cmpxNm;
	}

	public Date getApprDt() {
		return apprDt;
	}

	public void setApprDt(Date apprDt) {
		this.apprDt = apprDt;
	}

	public int getUnitTot() {
		return unitTot;
	}

	public void setUnitTot(int unitTot) {
		this.unitTot = unitTot;
	}

	// Getter / Setter
    public Long getMarkNo() {
        return markNo;
    }

    public void setMarkNo(Long markNo) {
        this.markNo = markNo;
    }

    public Long getMemNo() {
        return memNo;
    }

    public void setMemNo(Long memNo) {
        this.memNo = memNo;
    }

    public String getCmpxCd() {
        return cmpxCd;
    }

    public void setCmpxCd(String cmpxCd) {
        this.cmpxCd = cmpxCd;
    }
}
