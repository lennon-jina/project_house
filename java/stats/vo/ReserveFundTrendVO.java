package com.house.team.stats.vo;

public class ReserveFundTrendVO {
    
    private String ageGroup;                    // 노후도구분 (노후, 중견, 신축)
    private int year;                           // 연도 (2015~2024)
    private double avgTotalPerUnit;             // 해당 연도 세대수당 연평균 총적립금액
    private int apartmentCount;                 // 해당 연도 분석대상아파트수
    
    // 기본 생성자
    public ReserveFundTrendVO() {
    }

    // 전체 생성자
    public ReserveFundTrendVO(String ageGroup, int year, double avgTotalPerUnit, int apartmentCount) {
        this.ageGroup = ageGroup;
        this.year = year;
        this.avgTotalPerUnit = avgTotalPerUnit;
        this.apartmentCount = apartmentCount;
    }

    // Getter & Setter
    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public double getAvgTotalPerUnit() {
        return avgTotalPerUnit;
    }

    public void setAvgTotalPerUnit(double avgTotalPerUnit) {
        this.avgTotalPerUnit = avgTotalPerUnit;
    }

    public int getApartmentCount() {
        return apartmentCount;
    }

    public void setApartmentCount(int apartmentCount) {
        this.apartmentCount = apartmentCount;
    }

    @Override
    public String toString() {
        return "ReserveFundTrendVO [ageGroup=" + ageGroup + ", year=" + year + 
               ", avgTotalPerUnit=" + avgTotalPerUnit + ", apartmentCount=" + apartmentCount + "]";
    }
}