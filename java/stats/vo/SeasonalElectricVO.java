package com.house.team.stats.vo;

public class SeasonalElectricVO {
    
    private String ageCategory;                     // 연식 카테고리 (신축/중견/노후)
    private String season;                          // 계절 (여름철/겨울철)
    private int avgElectricPubPerHouse;            // 세대당 평균 공용 전기료
    private int avgElectricPrivPerHouse;           // 세대당 평균 전용 전기료
    
    // 기본 생성자
    public SeasonalElectricVO() {
        
    }
    
    // 전체 생성자
    public SeasonalElectricVO(String ageCategory, String season, 
                             int avgElectricPubPerHouse, int avgElectricPrivPerHouse) {
        this.ageCategory = ageCategory;
        this.season = season;
        this.avgElectricPubPerHouse = avgElectricPubPerHouse;
        this.avgElectricPrivPerHouse = avgElectricPrivPerHouse;
    }
    
    // Getter & Setter
    public String getAgeCategory() {
        return ageCategory;
    }
    
    public void setAgeCategory(String ageCategory) {
        this.ageCategory = ageCategory;
    }
    
    public String getSeason() {
        return season;
    }
    
    public void setSeason(String season) {
        this.season = season;
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
    
    @Override
    public String toString() {
        return "SeasonalElectricVO [ageCategory=" + ageCategory + ", season=" + season 
                + ", avgElectricPubPerHouse=" + avgElectricPubPerHouse 
                + ", avgElectricPrivPerHouse=" + avgElectricPrivPerHouse + "]";
    }
}