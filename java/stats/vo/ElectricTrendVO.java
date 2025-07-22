package com.house.team.stats.vo;

import java.util.Date;

public class ElectricTrendVO {
    
    private String year;                        // 연도
    private String aptGroup;                    // 아파트구분 (노후/중견/신축)
    private int complexCnt;                     // 해당 그룹 단지수
    private int totalHouseCnt;                  // 해당 그룹 총 세대수
    private int dataMonths;                     // 데이터가 있는 월수
    
    // 세대당 연간 평균 전기료 (원 단위)
    private int avgElectricPubPerHouse;         // 세대당 연간 평균 공용 전기료
    private int avgElectricPrivPerHouse;        // 세대당 연간 평균 전용 전기료
    private int avgElectricTotalPerHouse;       // 세대당 연간 평균 전체 전기료
    
    // 참고용 총액 데이터
    private long totalElectricPub;              // 연간 총 공용 전기료
    private long totalElectricPriv;             // 연간 총 전용 전기료
    
    // 관리용 컬럼
    private Date crtDt;                         // 생성일시
    private Date updDt;                         // 수정일시
    
    // 기본 생성자
    public ElectricTrendVO() {
        
    }
    
    // 전체 생성자
    public ElectricTrendVO(String year, String aptGroup, int complexCnt, int totalHouseCnt, 
                          int dataMonths, int avgElectricPubPerHouse, int avgElectricPrivPerHouse, 
                          int avgElectricTotalPerHouse, long totalElectricPub, long totalElectricPriv) {
        this.year = year;
        this.aptGroup = aptGroup;
        this.complexCnt = complexCnt;
        this.totalHouseCnt = totalHouseCnt;
        this.dataMonths = dataMonths;
        this.avgElectricPubPerHouse = avgElectricPubPerHouse;
        this.avgElectricPrivPerHouse = avgElectricPrivPerHouse;
        this.avgElectricTotalPerHouse = avgElectricTotalPerHouse;
        this.totalElectricPub = totalElectricPub;
        this.totalElectricPriv = totalElectricPriv;
    }
    
    // Getter & Setter
    public String getYear() {
        return year;
    }
    
    public void setYear(String year) {
        this.year = year;
    }
    
    public String getAptGroup() {
        return aptGroup;
    }
    
    public void setAptGroup(String aptGroup) {
        this.aptGroup = aptGroup;
    }
    
    public int getComplexCnt() {
        return complexCnt;
    }
    
    public void setComplexCnt(int complexCnt) {
        this.complexCnt = complexCnt;
    }
    
    public int getTotalHouseCnt() {
        return totalHouseCnt;
    }
    
    public void setTotalHouseCnt(int totalHouseCnt) {
        this.totalHouseCnt = totalHouseCnt;
    }
    
    public int getDataMonths() {
        return dataMonths;
    }
    
    public void setDataMonths(int dataMonths) {
        this.dataMonths = dataMonths;
    }
    
    public int getAvgElectricPubPerHouse() {
        return avgElectricPubPerHouse;
    }
    
    public void setAvgElectricPubPerHouse(int avgElectricPubPerHouse) {
        this.avgElectricPubPerHouse = avgElectricPubPerHouse;
    }
    
    public int getAvgElectricPrivPerHouse() {
        return avgElectricPrivPerHouse;
    }
    
    public void setAvgElectricPrivPerHouse(int avgElectricPrivPerHouse) {
        this.avgElectricPrivPerHouse = avgElectricPrivPerHouse;
    }
    
    public int getAvgElectricTotalPerHouse() {
        return avgElectricTotalPerHouse;
    }
    
    public void setAvgElectricTotalPerHouse(int avgElectricTotalPerHouse) {
        this.avgElectricTotalPerHouse = avgElectricTotalPerHouse;
    }
    
    public long getTotalElectricPub() {
        return totalElectricPub;
    }
    
    public void setTotalElectricPub(long totalElectricPub) {
        this.totalElectricPub = totalElectricPub;
    }
    
    public long getTotalElectricPriv() {
        return totalElectricPriv;
    }
    
    public void setTotalElectricPriv(long totalElectricPriv) {
        this.totalElectricPriv = totalElectricPriv;
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
    
    @Override
    public String toString() {
        return "ElectricTrendVO [year=" + year + ", aptGroup=" + aptGroup + ", complexCnt=" + complexCnt 
                + ", totalHouseCnt=" + totalHouseCnt + ", dataMonths=" + dataMonths 
                + ", avgElectricPubPerHouse=" + avgElectricPubPerHouse 
                + ", avgElectricPrivPerHouse=" + avgElectricPrivPerHouse 
                + ", avgElectricTotalPerHouse=" + avgElectricTotalPerHouse 
                + ", totalElectricPub=" + totalElectricPub + ", totalElectricPriv=" + totalElectricPriv 
                + ", crtDt=" + crtDt + ", updDt=" + updDt + "]";
    }
}