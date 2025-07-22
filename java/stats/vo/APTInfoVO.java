package com.house.team.stats.vo;

import java.util.Date;

public class APTInfoVO {
	
	private String cmpxCd;          // 단지코드
    private String cmpxNm;          // 단지명
    private String cmpxTp;          // 단지분류
    private String lglAddr;         // 법정동주소
    private String rdAddr;          // 도로명주소
    private Date apprDt;            // 사용승인일
    private int bldgCnt;            // 동수
    private int unitTot;            // 세대수
    private String mgmtMtd;         // 관리방식
    private String heatTp;          // 난방방식
    private String corrTp;          // 복도유형
    private int parkTot;            // 총주차대수
    private int cctvCnt;            // CCTV대수
    private String offcTel;         // 관리사무소 연락처
    private String offcFax;         // 관리사무소 팩스
    private int flrMax;             // 최고층수
    private int bsmntFlr;           // 지하층수
    private int vhclTot;            // 차량보유대수(전체)
    private int evTot;              // 차량보유대수(전기차)
    private int evcGrd;             // 전기차 충전시설 설치대수(지상)
    private int evcUndg;            // 전기차 충전시설 설치대수(지하)
    private Date crtDt;             // 테이블 생성일시
    private Date updDt;             // 테이블 업데이트일시
    
    
    private double differenceScore;  
    private double mainAreaUnit;
    private int mainAreaUnitCnt;
    
    // 기본 생성자
    public APTInfoVO() {
    	
    }
    
 // Getter & Setter
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
    
    public String getCmpxTp() {
        return cmpxTp;
    }
    
    public void setCmpxTp(String cmpxTp) {
        this.cmpxTp = cmpxTp;
    }
    
    public String getLglAddr() {
        return lglAddr;
    }
    
    public void setLglAddr(String lglAddr) {
        this.lglAddr = lglAddr;
    }
    
    public String getRdAddr() {
        return rdAddr;
    }
    
    public void setRdAddr(String rdAddr) {
        this.rdAddr = rdAddr;
    }
    
    public Date getApprDt() {
        return apprDt;
    }
    
    public void setApprDt(Date apprDt) {
        this.apprDt = apprDt;
    }
    
    public int getBldgCnt() {
        return bldgCnt;
    }
    
    public void setBldgCnt(int bldgCnt) {
        this.bldgCnt = bldgCnt;
    }
    
    public int getUnitTot() {
        return unitTot;
    }
    
    public void setUnitTot(int unitTot) {
        this.unitTot = unitTot;
    }
    
    public String getMgmtMtd() {
        return mgmtMtd;
    }
    
    public void setMgmtMtd(String mgmtMtd) {
        this.mgmtMtd = mgmtMtd;
    }
    
    public String getHeatTp() {
        return heatTp;
    }
    
    public void setHeatTp(String heatTp) {
        this.heatTp = heatTp;
    }
    
    public String getCorrTp() {
        return corrTp;
    }
    
    public void setCorrTp(String corrTp) {
        this.corrTp = corrTp;
    }
    
    public int getParkTot() {
        return parkTot;
    }
    
    public void setParkTot(int parkTot) {
        this.parkTot = parkTot;
    }
    
    public int getCctvCnt() {
        return cctvCnt;
    }
    
    public void setCctvCnt(int cctvCnt) {
        this.cctvCnt = cctvCnt;
    }
    
    public String getOffcTel() {
        return offcTel;
    }
    
    public void setOffcTel(String offcTel) {
        this.offcTel = offcTel;
    }
    
    public String getOffcFax() {
        return offcFax;
    }
    
    public void setOffcFax(String offcFax) {
        this.offcFax = offcFax;
    }
    
    public int getFlrMax() {
        return flrMax;
    }
    
    public void setFlrMax(int flrMax) {
        this.flrMax = flrMax;
    }
    
    public int getBsmntFlr() {
        return bsmntFlr;
    }
    
    public void setBsmntFlr(int bsmntFlr) {
        this.bsmntFlr = bsmntFlr;
    }
    
    public int getVhclTot() {
        return vhclTot;
    }
    
    public void setVhclTot(int vhclTot) {
        this.vhclTot = vhclTot;
    }
    
    public int getEvTot() {
        return evTot;
    }
    
    public void setEvTot(int evTot) {
        this.evTot = evTot;
    }
    
    public int getEvcGrd() {
        return evcGrd;
    }
    
    public void setEvcGrd(int evcGrd) {
        this.evcGrd = evcGrd;
    }
    
    public int getEvcUndg() {
        return evcUndg;
    }
    
    public void setEvcUndg(int evcUndg) {
        this.evcUndg = evcUndg;
    }
    
    public Date getCrtDt() {
        return crtDt;
    }
    
    public void setCrtDt(Date crtDt) {
        this.crtDt = crtDt;
    }
    
    public Date getUpdDt() {
        return updDt;
    }
    
    public void setUpdDt(Date updDt) {
        this.updDt = updDt;
    }
    
    public double getDifferenceScore() {
        return differenceScore;
    }

    public void setDifferenceScore(double differenceScore) {
        this.differenceScore = differenceScore;
    }

	public double getMainAreaUnit() {
		return mainAreaUnit;
	}

	public void setMainAreaUnit(double mainAreaUnit) {
		this.mainAreaUnit = mainAreaUnit;
	}

	public int getMainAreaUnitCnt() {
		return mainAreaUnitCnt;
	}

	public void setMainAreaUnitCnt(int mainAreaUnitCnt) {
		this.mainAreaUnitCnt = mainAreaUnitCnt;
	}

	
	@Override
	public String toString() {
		return "APTInfoVO [cmpxCd=" + cmpxCd + ", cmpxNm=" + cmpxNm + ", cmpxTp=" + cmpxTp + ", lglAddr=" + lglAddr
				+ ", rdAddr=" + rdAddr + ", apprDt=" + apprDt + ", bldgCnt=" + bldgCnt + ", unitTot=" + unitTot
				+ ", mgmtMtd=" + mgmtMtd + ", heatTp=" + heatTp + ", corrTp=" + corrTp + ", parkTot=" + parkTot
				+ ", cctvCnt=" + cctvCnt + ", offcTel=" + offcTel + ", offcFax=" + offcFax + ", flrMax=" + flrMax
				+ ", bsmntFlr=" + bsmntFlr + ", vhclTot=" + vhclTot + ", evTot=" + evTot + ", evcGrd=" + evcGrd
				+ ", evcUndg=" + evcUndg + ", crtDt=" + crtDt + ", updDt=" + updDt + "]";
	}
    
}
