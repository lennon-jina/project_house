package com.house.team.stats.vo;

import java.util.Date;

public class MgmtInfoVO {
	
	private String cmpxCd;              // 단지코드
    private String occYm;               // 발생년월
    private double pubMgmtTot;          // 공용관리비계
    private double laborCost;           // 인건비
    private double officeCost;          // 제사무비
    private double taxCost;             // 제세공과금
    private double uniformCost;         // 피복비
    private double trainingCost;        // 교육훈련비
    private double carMaintCost;        // 차량유지비
    private double etcCost;             // 그밖의부대비용
    private double cleanCost;           // 청소비
    private double securityCost;        // 경비비
    private double disinfectCost;       // 소독비
    private double elevatorCost;        // 승강기유지비
    private double networkCost;         // 지능형네트워크유지비
    private double repairCost;          // 수선비
    private double facilityCost;        // 시설유지비
    private double safetyChkCost;       // 안전점검비
    private double disasterPrevCost;    // 재해예방비
    private double mgmtFeeCost;         // 위탁관리수수료
    private double indivUseTot;         // 개별사용료계
    private double heatPub;             // 난방비(공용)
    private double heatPriv;            // 난방비(전용)
    private double hotWaterPub;         // 급탕비(공용)
    private double hotWaterPriv;        // 급탕비(전용)
    private double gasPub;              // 가스사용료(공용)
    private double gasPriv;             // 가스사용료(전용)
    private double electricPub;         // 전기료(공용)
    private double electricPriv;        // 전기료(전용)
    private double waterPub;            // 수도료(공용)
    private double waterPriv;           // 수도료(전용)
    private double tvFee;               // TV수신료
    private double septicFee;           // 정화조오물수수료
    private double wasteFee;            // 생활폐기물수수료
    private double residentOpFee;       // 입대의운영비
    private double buildingIns;         // 건물보험료
    private double cncOp;               // 선관위운영비
    private double etcFee;              // 기타
    private double rsvChg;              // 장충금 월부과액
    private double rsvUse;              // 장충금 월사용액
    private double rsvTot;              // 장충금 총적립금액
    private double rsvRt;               // 장충금 적립률
    private double mscInc;              // 잡수입
    private double mthInc;              // 월수입금액
    private double rsCntrb;             // 입주자기여수익
    private double cmCntrb;             // 공동기여수익
    private Date crtDt;                 // 생성일시
    private Date updDt;                 // 수정일시
    
    
    private String cmpxNm;          // 아파트명 (조인에서 가져옴)
    private int unitTot;            // 총 세대수 (조인에서 가져옴)
    private double mgmtPerUnit;     // 세대당 관리비 (계산된 값)
    private double mainAreaUnit;    // 주요 면적 (조인에서 가져옴)
    private double mgmtPerArea;     // 평당 관리비 (계산된 값)
    private int buildingAge;        // 건물 연식 (계산된 값)
    private String ageCategory;     // 연식 카테고리 (계산된 값)
    
    // 기본 생성자
    public MgmtInfoVO() {
    	
    }
    
 // Getter & Setter
    public String getCmpxCd() {
        return cmpxCd;
    }
    
    public void setCmpxCd(String cmpxCd) {
        this.cmpxCd = cmpxCd;
    }
    
    public String getOccYm() {
        return occYm;
    }
    
    public void setOccYm(String occYm) {
        this.occYm = occYm;
    }
    
    public double getPubMgmtTot() {
        return pubMgmtTot;
    }
    
    public void setPubMgmtTot(double pubMgmtTot) {
        this.pubMgmtTot = pubMgmtTot;
    }
    
    public double getLaborCost() {
        return laborCost;
    }
    
    public void setLaborCost(double laborCost) {
        this.laborCost = laborCost;
    }
    
    public double getOfficeCost() {
        return officeCost;
    }
    
    public void setOfficeCost(double officeCost) {
        this.officeCost = officeCost;
    }
    
    public double getTaxCost() {
        return taxCost;
    }
    
    public void setTaxCost(double taxCost) {
        this.taxCost = taxCost;
    }
    
    public double getUniformCost() {
        return uniformCost;
    }
    
    public void setUniformCost(double uniformCost) {
        this.uniformCost = uniformCost;
    }
    
    public double getTrainingCost() {
        return trainingCost;
    }
    
    public void setTrainingCost(double trainingCost) {
        this.trainingCost = trainingCost;
    }
    
    public double getCarMaintCost() {
        return carMaintCost;
    }
    
    public void setCarMaintCost(double carMaintCost) {
        this.carMaintCost = carMaintCost;
    }
    
    public double getEtcCost() {
        return etcCost;
    }
    
    public void setEtcCost(double etcCost) {
        this.etcCost = etcCost;
    }
    
    public double getCleanCost() {
        return cleanCost;
    }
    
    public void setCleanCost(double cleanCost) {
        this.cleanCost = cleanCost;
    }
    
    public double getSecurityCost() {
        return securityCost;
    }
    
    public void setSecurityCost(double securityCost) {
        this.securityCost = securityCost;
    }
    
    public double getDisinfectCost() {
        return disinfectCost;
    }
    
    public void setDisinfectCost(double disinfectCost) {
        this.disinfectCost = disinfectCost;
    }
    
    public double getElevatorCost() {
        return elevatorCost;
    }
    
    public void setElevatorCost(double elevatorCost) {
        this.elevatorCost = elevatorCost;
    }
    
    public double getNetworkCost() {
        return networkCost;
    }
    
    public void setNetworkCost(double networkCost) {
        this.networkCost = networkCost;
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
    
    public double getSafetyChkCost() {
        return safetyChkCost;
    }
    
    public void setSafetyChkCost(double safetyChkCost) {
        this.safetyChkCost = safetyChkCost;
    }
    
    public double getDisasterPrevCost() {
        return disasterPrevCost;
    }
    
    public void setDisasterPrevCost(double disasterPrevCost) {
        this.disasterPrevCost = disasterPrevCost;
    }
    
    public double getMgmtFeeCost() {
        return mgmtFeeCost;
    }
    
    public void setMgmtFeeCost(double mgmtFeeCost) {
        this.mgmtFeeCost = mgmtFeeCost;
    }
    
    public double getIndivUseTot() {
        return indivUseTot;
    }
    
    public void setIndivUseTot(double indivUseTot) {
        this.indivUseTot = indivUseTot;
    }
    
    public double getHeatPub() {
        return heatPub;
    }
    
    public void setHeatPub(double heatPub) {
        this.heatPub = heatPub;
    }
    
    public double getHeatPriv() {
        return heatPriv;
    }
    
    public void setHeatPriv(double heatPriv) {
        this.heatPriv = heatPriv;
    }
    
    public double getHotWaterPub() {
        return hotWaterPub;
    }
    
    public void setHotWaterPub(double hotWaterPub) {
        this.hotWaterPub = hotWaterPub;
    }
    
    public double getHotWaterPriv() {
        return hotWaterPriv;
    }
    
    public void setHotWaterPriv(double hotWaterPriv) {
        this.hotWaterPriv = hotWaterPriv;
    }
    
    public double getGasPub() {
        return gasPub;
    }
    
    public void setGasPub(double gasPub) {
        this.gasPub = gasPub;
    }
    
    public double getGasPriv() {
        return gasPriv;
    }
    
    public void setGasPriv(double gasPriv) {
        this.gasPriv = gasPriv;
    }
    
    public double getElectricPub() {
        return electricPub;
    }
    
    public void setElectricPub(double electricPub) {
        this.electricPub = electricPub;
    }
    
    public double getElectricPriv() {
        return electricPriv;
    }
    
    public void setElectricPriv(double electricPriv) {
        this.electricPriv = electricPriv;
    }
    
    public double getWaterPub() {
        return waterPub;
    }
    
    public void setWaterPub(double waterPub) {
        this.waterPub = waterPub;
    }
    
    public double getWaterPriv() {
        return waterPriv;
    }
    
    public void setWaterPriv(double waterPriv) {
        this.waterPriv = waterPriv;
    }
    
    public double getTvFee() {
        return tvFee;
    }
    
    public void setTvFee(double tvFee) {
        this.tvFee = tvFee;
    }
    
    public double getSepticFee() {
        return septicFee;
    }
    
    public void setSepticFee(double septicFee) {
        this.septicFee = septicFee;
    }
    
    public double getWasteFee() {
        return wasteFee;
    }
    
    public void setWasteFee(double wasteFee) {
        this.wasteFee = wasteFee;
    }
    
    public double getResidentOpFee() {
        return residentOpFee;
    }
    
    public void setResidentOpFee(double residentOpFee) {
        this.residentOpFee = residentOpFee;
    }
    
    public double getBuildingIns() {
        return buildingIns;
    }
    
    public void setBuildingIns(double buildingIns) {
        this.buildingIns = buildingIns;
    }
    
    public double getCncOp() {
        return cncOp;
    }
    
    public void setCncOp(double cncOp) {
        this.cncOp = cncOp;
    }
    
    public double getEtcFee() {
        return etcFee;
    }
    
    public void setEtcFee(double etcFee) {
        this.etcFee = etcFee;
    }
    
    public double getRsvChg() {
        return rsvChg;
    }
    
    public void setRsvChg(double rsvChg) {
        this.rsvChg = rsvChg;
    }
    
    public double getRsvUse() {
        return rsvUse;
    }
    
    public void setRsvUse(double rsvUse) {
        this.rsvUse = rsvUse;
    }
    
    public double getRsvTot() {
        return rsvTot;
    }
    
    public void setRsvTot(double rsvTot) {
        this.rsvTot = rsvTot;
    }
    
    public double getRsvRt() {
        return rsvRt;
    }
    
    public void setRsvRt(double rsvRt) {
        this.rsvRt = rsvRt;
    }
    
    public double getMscInc() {
        return mscInc;
    }
    
    public void setMscInc(double mscInc) {
        this.mscInc = mscInc;
    }
    
    public double getMthInc() {
        return mthInc;
    }
    
    public void setMthInc(double mthInc) {
        this.mthInc = mthInc;
    }
    
    public double getRsCntrb() {
        return rsCntrb;
    }
    
    public void setRsCntrb(double rsCntrb) {
        this.rsCntrb = rsCntrb;
    }
    
    public double getCmCntrb() {
        return cmCntrb;
    }
    
    public void setCmCntrb(double cmCntrb) {
        this.cmCntrb = cmCntrb;
    }
    
    public Date getCrtDt() {
        return crtDt;
    }
    
    public void setCrtDt(Date crtDt) {
        this.crtDt = crtDt;
    }
    
    public Date getUpdDt() {
        return updDt;
    }
    
    public void setUpdDt(Date updDt) {
        this.updDt = updDt;
    }
    
    
    public String getCmpxNm() {
        return cmpxNm;
    }

    public void setCmpxNm(String cmpxNm) {
        this.cmpxNm = cmpxNm;
    }

    public int getUnitTot() {
        return unitTot;
    }

    public void setUnitTot(int unitTot) {
        this.unitTot = unitTot;
    }

    public double getMgmtPerUnit() {
        return mgmtPerUnit;
    }

    public void setMgmtPerUnit(double mgmtPerUnit) {
        this.mgmtPerUnit = mgmtPerUnit;
    }

    public double getMainAreaUnit() {
        return mainAreaUnit;
    }

    public void setMainAreaUnit(double mainAreaUnit) {
        this.mainAreaUnit = mainAreaUnit;
    }

    public double getMgmtPerArea() {
        return mgmtPerArea;
    }

    public void setMgmtPerArea(double mgmtPerArea) {
        this.mgmtPerArea = mgmtPerArea;
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
    
    
    

	@Override
	public String toString() {
		return "MgmtInfoVO [cmpxCd=" + cmpxCd + ", occYm=" + occYm + ", pubMgmtTot=" + pubMgmtTot + ", laborCost="
				+ laborCost + ", officeCost=" + officeCost + ", taxCost=" + taxCost + ", uniformCost=" + uniformCost
				+ ", trainingCost=" + trainingCost + ", carMaintCost=" + carMaintCost + ", etcCost=" + etcCost
				+ ", cleanCost=" + cleanCost + ", securityCost=" + securityCost + ", disinfectCost=" + disinfectCost
				+ ", elevatorCost=" + elevatorCost + ", networkCost=" + networkCost + ", repairCost=" + repairCost
				+ ", facilityCost=" + facilityCost + ", safetyChkCost=" + safetyChkCost + ", disasterPrevCost="
				+ disasterPrevCost + ", mgmtFeeCost=" + mgmtFeeCost + ", indivUseTot=" + indivUseTot + ", heatPub="
				+ heatPub + ", heatPriv=" + heatPriv + ", hotWaterPub=" + hotWaterPub + ", hotWaterPriv=" + hotWaterPriv
				+ ", gasPub=" + gasPub + ", gasPriv=" + gasPriv + ", electricPub=" + electricPub + ", electricPriv="
				+ electricPriv + ", waterPub=" + waterPub + ", waterPriv=" + waterPriv + ", tvFee=" + tvFee
				+ ", septicFee=" + septicFee + ", wasteFee=" + wasteFee + ", residentOpFee=" + residentOpFee
				+ ", buildingIns=" + buildingIns + ", cncOp=" + cncOp + ", etcFee=" + etcFee + ", rsvChg=" + rsvChg
				+ ", rsvUse=" + rsvUse + ", rsvTot=" + rsvTot + ", rsvRt=" + rsvRt + ", mscInc=" + mscInc + ", mthInc="
				+ mthInc + ", rsCntrb=" + rsCntrb + ", cmCntrb=" + cmCntrb + ", crtDt=" + crtDt + ", updDt=" + updDt
				+ "]";
	}
    
}
