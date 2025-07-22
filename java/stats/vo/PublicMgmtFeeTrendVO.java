package com.house.team.stats.vo;

public class PublicMgmtFeeTrendVO {
    
    private String ageGroup;                    // 노후도 그룹 (신축/중견/노후)
    private int monthNum;                       // 월 (1, 2, 3, ...)
    private int avgPublicMgmtFeePerUnit;        // 세대당 평균 공용관리비
    
    // 기본 생성자
    public PublicMgmtFeeTrendVO() {
        
    }
    
    // 전체 생성자
    public PublicMgmtFeeTrendVO(String ageGroup, int monthNum, int avgPublicMgmtFeePerUnit) {
        this.ageGroup = ageGroup;
        this.monthNum = monthNum;
        this.avgPublicMgmtFeePerUnit = avgPublicMgmtFeePerUnit;
    }
    
    // Getter & Setter
    public String getAgeGroup() {
        return ageGroup;
    }
    
    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }
    
    public int getMonthNum() {
        return monthNum;
    }
    
    public void setMonthNum(int monthNum) {
        this.monthNum = monthNum;
    }
    
    public int getAvgPublicMgmtFeePerUnit() {
        return avgPublicMgmtFeePerUnit;
    }
    
    public void setAvgPublicMgmtFeePerUnit(int avgPublicMgmtFeePerUnit) {
        this.avgPublicMgmtFeePerUnit = avgPublicMgmtFeePerUnit;
    }
    
    @Override
    public String toString() {
        return "PublicMgmtFeeTrendVO [ageGroup=" + ageGroup + ", monthNum=" + monthNum 
                + ", avgPublicMgmtFeePerUnit=" + avgPublicMgmtFeePerUnit + "]";
    }
}