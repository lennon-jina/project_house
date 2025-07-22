package com.house.team.stats.vo;

public class MgmtCompositionVO {
    
    private String ageGroup;                    // 노후도 그룹 (신축/중견/노후)
    private double laborCostPct;                // 인건비 비중
    private double officeCostPct;               // 제사무비 비중
    private double taxCostPct;                  // 제세공과금 비중
    private double etcCostPct;                  // 그밖의부대비용 비중
    private double cleanCostPct;                // 청소비 비중
    private double securityCostPct;             // 경비비 비중
    private double disinfectCostPct;            // 소독비 비중
    private double elevatorCostPct;             // 승강기유지비 비중
    private double repairCostPct;               // 수선비 비중
    private double facilityCostPct;             // 시설유지비 비중
    private double residentOpFeePct;            // 입대의운영비 비중
    private double buildingInsPct;              // 건물보험료 비중
    
    // 기본 생성자
    public MgmtCompositionVO() {
        
    }
    
    // Getter & Setter
    public String getAgeGroup() {
        return ageGroup;
    }
    
    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }
    
    public double getLaborCostPct() {
        return laborCostPct;
    }
    
    public void setLaborCostPct(double laborCostPct) {
        this.laborCostPct = laborCostPct;
    }
    
    public double getOfficeCostPct() {
        return officeCostPct;
    }
    
    public void setOfficeCostPct(double officeCostPct) {
        this.officeCostPct = officeCostPct;
    }
    
    public double getTaxCostPct() {
        return taxCostPct;
    }
    
    public void setTaxCostPct(double taxCostPct) {
        this.taxCostPct = taxCostPct;
    }
    
    public double getEtcCostPct() {
        return etcCostPct;
    }
    
    public void setEtcCostPct(double etcCostPct) {
        this.etcCostPct = etcCostPct;
    }
    
    public double getCleanCostPct() {
        return cleanCostPct;
    }
    
    public void setCleanCostPct(double cleanCostPct) {
        this.cleanCostPct = cleanCostPct;
    }
    
    public double getSecurityCostPct() {
        return securityCostPct;
    }
    
    public void setSecurityCostPct(double securityCostPct) {
        this.securityCostPct = securityCostPct;
    }
    
    public double getDisinfectCostPct() {
        return disinfectCostPct;
    }
    
    public void setDisinfectCostPct(double disinfectCostPct) {
        this.disinfectCostPct = disinfectCostPct;
    }
    
    public double getElevatorCostPct() {
        return elevatorCostPct;
    }
    
    public void setElevatorCostPct(double elevatorCostPct) {
        this.elevatorCostPct = elevatorCostPct;
    }
    
    public double getRepairCostPct() {
        return repairCostPct;
    }
    
    public void setRepairCostPct(double repairCostPct) {
        this.repairCostPct = repairCostPct;
    }
    
    public double getFacilityCostPct() {
        return facilityCostPct;
    }
    
    public void setFacilityCostPct(double facilityCostPct) {
        this.facilityCostPct = facilityCostPct;
    }
    
    public double getResidentOpFeePct() {
        return residentOpFeePct;
    }
    
    public void setResidentOpFeePct(double residentOpFeePct) {
        this.residentOpFeePct = residentOpFeePct;
    }
    
    public double getBuildingInsPct() {
        return buildingInsPct;
    }
    
    public void setBuildingInsPct(double buildingInsPct) {
        this.buildingInsPct = buildingInsPct;
    }
    
    @Override
    public String toString() {
        return "MgmtCompositionVO [ageGroup=" + ageGroup + ", laborCostPct=" + laborCostPct 
                + ", cleanCostPct=" + cleanCostPct + ", securityCostPct=" + securityCostPct + "]";
    }
}