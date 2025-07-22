package com.house.team.stats.vo;

import java.util.Date;

public class ElectricComparisonVO {
    
    private String cmpxCd;              // 단지코드
    private String cmpxNm;              // 단지명
    private String occYm;               // 최신 데이터 발생년월
    private int unitTot;                // 총 세대수
    private double mainAreaUnit;        // 주요 면적
    private int buildingAge;            // 건물 연식
    private String ageCategory;         // 연식 카테고리
    
    // 전기료 관련 필드
    private double electricPubTot;      // 공용전기료 총액
    private double electricPrivTot;     // 전용전기료 총액
    private double electricTotalTot;    // 전체전기료 총액
    
    // 계산된 필드
    private double electricPubPerUnit;  // 세대당 공용전기료
    private double electricPrivPerUnit; // 세대당 전용전기료
    private double electricTotalPerUnit;// 세대당 전체전기료
    private double electricPubPerArea;  // 평당 공용전기료
    private double electricPrivPerArea; // 평당 전용전기료
    private double electricTotalPerArea;// 평당 전체전기료
    
    // 기본 생성자
    public ElectricComparisonVO() {
        
    }
    
    // 전체 생성자
    public ElectricComparisonVO(String cmpxCd, String cmpxNm, String occYm, 
                               int unitTot, double mainAreaUnit, int buildingAge, 
                               String ageCategory, double electricPubTot, 
                               double electricPrivTot, double electricTotalTot) {
        this.cmpxCd = cmpxCd;
        this.cmpxNm = cmpxNm;
        this.occYm = occYm;
        this.unitTot = unitTot;
        this.mainAreaUnit = mainAreaUnit;
        this.buildingAge = buildingAge;
        this.ageCategory = ageCategory;
        this.electricPubTot = electricPubTot;
        this.electricPrivTot = electricPrivTot;
        this.electricTotalTot = electricTotalTot;
        
        // 계산된 값들 자동 설정
        calculateDerivedValues();
    }
    
    // 계산된 값들을 자동으로 설정하는 메서드
    public void calculateDerivedValues() {
        if (unitTot > 0) {
            this.electricPubPerUnit = electricPubTot / unitTot;
            this.electricPrivPerUnit = electricPrivTot / unitTot;
            this.electricTotalPerUnit = electricTotalTot / unitTot;
            
            if (mainAreaUnit > 0) {
                this.electricPubPerArea = electricPubPerUnit / mainAreaUnit;
                this.electricPrivPerArea = electricPrivPerUnit / mainAreaUnit;
                this.electricTotalPerArea = electricTotalPerUnit / mainAreaUnit;
            }
        }
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
    
    public String getOccYm() {
        return occYm;
    }
    
    public void setOccYm(String occYm) {
        this.occYm = occYm;
    }
    
    public int getUnitTot() {
        return unitTot;
    }
    
    public void setUnitTot(int unitTot) {
        this.unitTot = unitTot;
        calculateDerivedValues(); // 세대수 변경 시 재계산
    }
    
    public double getMainAreaUnit() {
        return mainAreaUnit;
    }
    
    public void setMainAreaUnit(double mainAreaUnit) {
        this.mainAreaUnit = mainAreaUnit;
        calculateDerivedValues(); // 면적 변경 시 재계산
    }
    
    public int getBuildingAge() {
        return buildingAge;
    }
    
    public void setBuildingAge(int buildingAge) {
        this.buildingAge = buildingAge;
    }
    
    public String getAgeCategory() {
        return ageCategory;
    }
    
    public void setAgeCategory(String ageCategory) {
        this.ageCategory = ageCategory;
    }
    
    public double getElectricPubTot() {
        return electricPubTot;
    }
    
    public void setElectricPubTot(double electricPubTot) {
        this.electricPubTot = electricPubTot;
        calculateDerivedValues(); // 전기료 변경 시 재계산
    }
    
    public double getElectricPrivTot() {
        return electricPrivTot;
    }
    
    public void setElectricPrivTot(double electricPrivTot) {
        this.electricPrivTot = electricPrivTot;
        calculateDerivedValues(); // 전기료 변경 시 재계산
    }
    
    public double getElectricTotalTot() {
        return electricTotalTot;
    }
    
    public void setElectricTotalTot(double electricTotalTot) {
        this.electricTotalTot = electricTotalTot;
        calculateDerivedValues(); // 전기료 변경 시 재계산
    }
    
    public double getElectricPubPerUnit() {
        return electricPubPerUnit;
    }
    
    public void setElectricPubPerUnit(double electricPubPerUnit) {
        this.electricPubPerUnit = electricPubPerUnit;
    }
    
    public double getElectricPrivPerUnit() {
        return electricPrivPerUnit;
    }
    
    public void setElectricPrivPerUnit(double electricPrivPerUnit) {
        this.electricPrivPerUnit = electricPrivPerUnit;
    }
    
    public double getElectricTotalPerUnit() {
        return electricTotalPerUnit;
    }
    
    public void setElectricTotalPerUnit(double electricTotalPerUnit) {
        this.electricTotalPerUnit = electricTotalPerUnit;
    }
    
    public double getElectricPubPerArea() {
        return electricPubPerArea;
    }
    
    public void setElectricPubPerArea(double electricPubPerArea) {
        this.electricPubPerArea = electricPubPerArea;
    }
    
    public double getElectricPrivPerArea() {
        return electricPrivPerArea;
    }
    
    public void setElectricPrivPerArea(double electricPrivPerArea) {
        this.electricPrivPerArea = electricPrivPerArea;
    }
    
    public double getElectricTotalPerArea() {
        return electricTotalPerArea;
    }
    
    public void setElectricTotalPerArea(double electricTotalPerArea) {
        this.electricTotalPerArea = electricTotalPerArea;
    }
    
    @Override
    public String toString() {
        return "ElectricComparisonVO [cmpxCd=" + cmpxCd + ", cmpxNm=" + cmpxNm 
                + ", occYm=" + occYm + ", unitTot=" + unitTot + ", mainAreaUnit=" + mainAreaUnit 
                + ", buildingAge=" + buildingAge + ", ageCategory=" + ageCategory 
                + ", electricPubTot=" + electricPubTot + ", electricPrivTot=" + electricPrivTot 
                + ", electricTotalTot=" + electricTotalTot + ", electricPubPerUnit=" + electricPubPerUnit 
                + ", electricPrivPerUnit=" + electricPrivPerUnit + ", electricTotalPerUnit=" + electricTotalPerUnit 
                + ", electricPubPerArea=" + electricPubPerArea + ", electricPrivPerArea=" + electricPrivPerArea 
                + ", electricTotalPerArea=" + electricTotalPerArea + "]";
    }
}