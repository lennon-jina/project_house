package com.house.team.stats.vo;

public class AREAInfoVO {
	
	private String cmpxCd;          // 단지코드
    private double mgtArea;         // 관리비부과면적
    private double areaSum;         // 주거전용면적(단지합계)
    private double areaUnit;        // 주거전용면적(세부)
    private int unitCnt;            // 세대수
    
    // 기본 생성자
    public AREAInfoVO() {
    	
    }
    
    // 생성자
    public AREAInfoVO(String cmpxCd, double mgtArea, double areaSum, double areaUnit, int unitCnt) {
        this.cmpxCd = cmpxCd;
        this.mgtArea = mgtArea;
        this.areaSum = areaSum;
        this.areaUnit = areaUnit;
        this.unitCnt = unitCnt;
    }
    
    // Getter & Setter
    public String getCmpxCd() {
        return cmpxCd;
    }
    
    public void setCmpxCd(String cmpxCd) {
        this.cmpxCd = cmpxCd;
    }
    
    public double getMgtArea() {
        return mgtArea;
    }
    
    public void setMgtArea(double mgtArea) {
        this.mgtArea = mgtArea;
    }
    
    public double getAreaSum() {
        return areaSum;
    }
    
    public void setAreaSum(double areaSum) {
        this.areaSum = areaSum;
    }
    
    public double getAreaUnit() {
        return areaUnit;
    }
    
    public void setAreaUnit(double areaUnit) {
        this.areaUnit = areaUnit;
    }
    
    public int getUnitCnt() {
        return unitCnt;
    }
    
    public void setUnitCnt(int unitCnt) {
        this.unitCnt = unitCnt;
    }

	@Override
	public String toString() {
		return "AREAInfoVO [cmpxCd=" + cmpxCd + ", mgtArea=" + mgtArea + ", areaSum=" + areaSum + ", areaUnit="
				+ areaUnit + ", unitCnt=" + unitCnt + "]";
	}
    
}
