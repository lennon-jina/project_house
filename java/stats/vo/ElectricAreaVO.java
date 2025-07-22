package com.house.team.stats.vo;

public class ElectricAreaVO {
    
    private int analysisYear;                       // 분석 연도
    private String ageCategory;                     // 아파트 연식 그룹 (신축, 중견, 노후)
    private double avgElectricPubPerSqm;           // 연면적당 평균 공용 전기료
    private int totalComplexCount;                  // 해당 그룹의 총 단지 수
    private int dataMonthsCount;                   // 데이터가 있는 월 수
    
    // 기본 생성자
    public ElectricAreaVO() {
        
    }
    
    // 전체 생성자
    public ElectricAreaVO(int analysisYear, String ageCategory, 
                                   double avgElectricPubPerSqm, int totalComplexCount, 
                                   int dataMonthsCount) {
        this.analysisYear = analysisYear;
        this.ageCategory = ageCategory;
        this.avgElectricPubPerSqm = avgElectricPubPerSqm;
        this.totalComplexCount = totalComplexCount;
        this.dataMonthsCount = dataMonthsCount;
    }
    
    // Getter & Setter
    public int getAnalysisYear() {
        return analysisYear;
    }
    
    public void setAnalysisYear(int analysisYear) {
        this.analysisYear = analysisYear;
    }
    
    public String getAgeCategory() {
        return ageCategory;
    }
    
    public void setAgeCategory(String ageCategory) {
        this.ageCategory = ageCategory;
    }
    
    public double getAvgElectricPubPerSqm() {
        return avgElectricPubPerSqm;
    }
    
    public void setAvgElectricPubPerSqm(double avgElectricPubPerSqm) {
        this.avgElectricPubPerSqm = avgElectricPubPerSqm;
    }
    
    public int getTotalComplexCount() {
        return totalComplexCount;
    }
    
    public void setTotalComplexCount(int totalComplexCount) {
        this.totalComplexCount = totalComplexCount;
    }
    
    public int getDataMonthsCount() {
        return dataMonthsCount;
    }
    
    public void setDataMonthsCount(int dataMonthsCount) {
        this.dataMonthsCount = dataMonthsCount;
    }
    
    @Override
    public String toString() {
        return "ElectricAreaVO [analysisYear=" + analysisYear + ", ageCategory=" + ageCategory 
                + ", avgElectricPubPerSqm=" + avgElectricPubPerSqm + ", totalComplexCount=" + totalComplexCount 
                + ", dataMonthsCount=" + dataMonthsCount + "]";
    }
}