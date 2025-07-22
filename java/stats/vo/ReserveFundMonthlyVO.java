package com.house.team.stats.vo;

public class ReserveFundMonthlyVO {
    
    private String ageGroup;                    // 노후도구분 (노후, 중견, 신축)
    private int monthNum;                       // 월 (1~12)
    private double avgChargePerUnit;            // 2024년 해당 월 세대수당 평균 월부과액
    private double avgUsagePerUnit;             // 2024년 해당 월 세대수당 평균 월사용액
    private int apartmentCount;                 // 분석대상아파트수
    
    // 기본 생성자
    public ReserveFundMonthlyVO() {
    }

    // 전체 생성자
    public ReserveFundMonthlyVO(String ageGroup, int monthNum, double avgChargePerUnit, 
                               double avgUsagePerUnit, int apartmentCount) {
        this.ageGroup = ageGroup;
        this.monthNum = monthNum;
        this.avgChargePerUnit = avgChargePerUnit;
        this.avgUsagePerUnit = avgUsagePerUnit;
        this.apartmentCount = apartmentCount;
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

    public double getAvgChargePerUnit() {
        return avgChargePerUnit;
    }

    public void setAvgChargePerUnit(double avgChargePerUnit) {
        this.avgChargePerUnit = avgChargePerUnit;
    }

    public double getAvgUsagePerUnit() {
        return avgUsagePerUnit;
    }

    public void setAvgUsagePerUnit(double avgUsagePerUnit) {
        this.avgUsagePerUnit = avgUsagePerUnit;
    }

    public int getApartmentCount() {
        return apartmentCount;
    }

    public void setApartmentCount(int apartmentCount) {
        this.apartmentCount = apartmentCount;
    }

    @Override
    public String toString() {
        return "ReserveFundMonthlyVO [ageGroup=" + ageGroup + ", monthNum=" + monthNum + 
               ", avgChargePerUnit=" + avgChargePerUnit + ", avgUsagePerUnit=" + avgUsagePerUnit + 
               ", apartmentCount=" + apartmentCount + "]";
    }
}