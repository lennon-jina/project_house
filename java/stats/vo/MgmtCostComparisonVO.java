package com.house.team.stats.vo;

public class MgmtCostComparisonVO {
    
    private String ageGroup;          // 노후도구분 (노후, 중견, 신축)
    private int apartmentCount;       // 분석대상아파트수
    private double repairCost;        // 수선비 (세대당 연평균)
    private double facilityCost;      // 시설유지비 (세대당 연평균)
    private double securityCost;      // 경비비 (세대당 연평균)
    private double laborCost;         // 인건비 (세대당 연평균)
    private double cleanCost;         // 청소비 (세대당 연평균)
    
    // 기본 생성자
    public MgmtCostComparisonVO() {
    }

    // 전체 생성자
    public MgmtCostComparisonVO(String ageGroup, int apartmentCount, double repairCost, 
                               double facilityCost, double securityCost, double laborCost, double cleanCost) {
        this.ageGroup = ageGroup;
        this.apartmentCount = apartmentCount;
        this.repairCost = repairCost;
        this.facilityCost = facilityCost;
        this.securityCost = securityCost;
        this.laborCost = laborCost;
        this.cleanCost = cleanCost;
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

    public double getRepairCost() {
        return repairCost;
    }

    public void setRepairCost(double repairCost) {
        this.repairCost = repairCost;
    }

    public double getFacilityCost() {
        return facilityCost;
    }

    public void setFacilityCost(double facilityCost) {
        this.facilityCost = facilityCost;
    }

    public double getSecurityCost() {
        return securityCost;
    }

    public void setSecurityCost(double securityCost) {
        this.securityCost = securityCost;
    }

    public double getLaborCost() {
        return laborCost;
    }

    public void setLaborCost(double laborCost) {
        this.laborCost = laborCost;
    }

    public double getCleanCost() {
        return cleanCost;
    }

    public void setCleanCost(double cleanCost) {
        this.cleanCost = cleanCost;
    }

    @Override
    public String toString() {
        return "MgmtCostComparisonVO [ageGroup=" + ageGroup + ", apartmentCount=" + apartmentCount + 
               ", repairCost=" + repairCost + ", facilityCost=" + facilityCost + 
               ", securityCost=" + securityCost + ", laborCost=" + laborCost + 
               ", cleanCost=" + cleanCost + "]";
    }
}