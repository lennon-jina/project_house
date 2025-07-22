package com.house.team.stats.vo;

public class ReserveFundStatusVO {
    
    private String ageGroup;                    // 노후도구분 (노후, 중견, 신축)
    private int apartmentCount;                 // 분석대상아파트수
    private double avgChargePerUnit;            // 10년간 연평균 세대수당 월부과액
    private double avgUsagePerUnit;             // 10년간 연평균 세대수당 월사용액
    private double avgTotalPerUnit;             // 10년간 연평균 세대수당 총적립금액
    
    // 기본 생성자
    public ReserveFundStatusVO() {
    }

    // 전체 생성자
    public ReserveFundStatusVO(String ageGroup, int apartmentCount, double avgChargePerUnit, 
                              double avgUsagePerUnit, double avgTotalPerUnit) {
        this.ageGroup = ageGroup;
        this.apartmentCount = apartmentCount;
        this.avgChargePerUnit = avgChargePerUnit;
        this.avgUsagePerUnit = avgUsagePerUnit;
        this.avgTotalPerUnit = avgTotalPerUnit;
    }

    // Getter & Setter
    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public int getApartmentCount() {
        return apartmentCount;
    }

    public void setApartmentCount(int apartmentCount) {
        this.apartmentCount = apartmentCount;
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

    public double getAvgTotalPerUnit() {
        return avgTotalPerUnit;
    }

    public void setAvgTotalPerUnit(double avgTotalPerUnit) {
        this.avgTotalPerUnit = avgTotalPerUnit;
    }

    @Override
    public String toString() {
        return "ReserveFundStatusVO [ageGroup=" + ageGroup + ", apartmentCount=" + apartmentCount + 
               ", avgChargePerUnit=" + avgChargePerUnit + ", avgUsagePerUnit=" + avgUsagePerUnit + 
               ", avgTotalPerUnit=" + avgTotalPerUnit + "]";
    }
}