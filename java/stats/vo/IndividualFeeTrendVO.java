package com.house.team.stats.vo;

public class IndividualFeeTrendVO {
    
    private String ageGroup;                    // 노후도 그룹 (신축/중견/노후)
    private String occYm;                       // 발생년월 (YYYYMM)
    private String monthOnly;                   // 월만 추출 (01, 02, ...)
    private int avgIndividualFeePerUnit;        // 세대당 평균 개별사용료
    
    // 기본 생성자
    public IndividualFeeTrendVO() {
        
    }
    
    // 전체 생성자
    public IndividualFeeTrendVO(String ageGroup, String occYm, String monthOnly, 
                               int avgIndividualFeePerUnit) {
        this.ageGroup = ageGroup;
        this.occYm = occYm;
        this.monthOnly = monthOnly;
        this.avgIndividualFeePerUnit = avgIndividualFeePerUnit;
    }
    
    // Getter & Setter
    public String getAgeGroup() {
        return ageGroup;
    }
    
    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }
    
    public String getOccYm() {
        return occYm;
    }
    
    public void setOccYm(String occYm) {
        this.occYm = occYm;
    }
    
    public String getMonthOnly() {
        return monthOnly;
    }
    
    public void setMonthOnly(String monthOnly) {
        this.monthOnly = monthOnly;
    }
    
    public int getAvgIndividualFeePerUnit() {
        return avgIndividualFeePerUnit;
    }
    
    public void setAvgIndividualFeePerUnit(int avgIndividualFeePerUnit) {
        this.avgIndividualFeePerUnit = avgIndividualFeePerUnit;
    }
    
    @Override
    public String toString() {
        return "IndividualFeeTrendVO [ageGroup=" + ageGroup + ", occYm=" + occYm 
                + ", monthOnly=" + monthOnly + ", avgIndividualFeePerUnit=" + avgIndividualFeePerUnit + "]";
    }
}