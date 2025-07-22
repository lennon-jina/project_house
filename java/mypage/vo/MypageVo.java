package com.house.team.mypage.vo;

import java.math.BigDecimal;
import java.util.Date;

public class MypageVo {

    // 기존 단지 정보
    private String cmpxCd;   // 단지 코드
    private String cmpxNm;   // 아파트 이름
    private Date apprDt;     // 사용승인일
    private int unitTot;     // 세대수

    // 관리비 관련 항목
    private BigDecimal mgmtFeeTotal;
    private BigDecimal cleaningFee;
    private BigDecimal securityFee;
    private BigDecimal disinfectionFee;
    private BigDecimal elevatorMaintFee;
    private BigDecimal repairFee;
    private BigDecimal heatingFeePublic;
    private BigDecimal heatingFeePrivate;
    private BigDecimal gasUsagePublic;
    private BigDecimal gasUsagePrivate;
    private BigDecimal elecUsagePublic;
    private BigDecimal elecUsagePrivate;
    private BigDecimal waterUsagePublic;
    private BigDecimal waterUsagePrivate;
    
    private BigDecimal laborCost;           // 인건비
    private BigDecimal officeCost;          // 제사무비
    private BigDecimal taxCost;             // 제세공과금
    private BigDecimal uniformCost;         // 피복비
    private BigDecimal trainingCost;        // 교육훈련비
    private BigDecimal carMaintCost;        // 차량유지비
    private BigDecimal etcCost;             // 그밖의부대비용
    private BigDecimal networkCost;         // 지능형네트워크유지비
    private BigDecimal facilityCost;        // 시설유지비
    private BigDecimal safetyChkCost;       // 안전점검비
    private BigDecimal disasterPrevCost;    // 재해예방비
    private BigDecimal mgmtFeeCost;
    
	public BigDecimal getLaborCost() {
		return laborCost;
	}

	public void setLaborCost(BigDecimal laborCost) {
		this.laborCost = laborCost;
	}

	public BigDecimal getOfficeCost() {
		return officeCost;
	}

	public void setOfficeCost(BigDecimal officeCost) {
		this.officeCost = officeCost;
	}

	public BigDecimal getTaxCost() {
		return taxCost;
	}

	public void setTaxCost(BigDecimal taxCost) {
		this.taxCost = taxCost;
	}

	public BigDecimal getUniformCost() {
		return uniformCost;
	}

	public void setUniformCost(BigDecimal uniformCost) {
		this.uniformCost = uniformCost;
	}

	public BigDecimal getTrainingCost() {
		return trainingCost;
	}

	public void setTrainingCost(BigDecimal trainingCost) {
		this.trainingCost = trainingCost;
	}

	public BigDecimal getCarMaintCost() {
		return carMaintCost;
	}

	public void setCarMaintCost(BigDecimal carMaintCost) {
		this.carMaintCost = carMaintCost;
	}

	public BigDecimal getEtcCost() {
		return etcCost;
	}

	public void setEtcCost(BigDecimal etcCost) {
		this.etcCost = etcCost;
	}

	public BigDecimal getNetworkCost() {
		return networkCost;
	}

	public void setNetworkCost(BigDecimal networkCost) {
		this.networkCost = networkCost;
	}

	public BigDecimal getFacilityCost() {
		return facilityCost;
	}

	public void setFacilityCost(BigDecimal facilityCost) {
		this.facilityCost = facilityCost;
	}

	public BigDecimal getSafetyChkCost() {
		return safetyChkCost;
	}

	public void setSafetyChkCost(BigDecimal safetyChkCost) {
		this.safetyChkCost = safetyChkCost;
	}

	public BigDecimal getDisasterPrevCost() {
		return disasterPrevCost;
	}

	public void setDisasterPrevCost(BigDecimal disasterPrevCost) {
		this.disasterPrevCost = disasterPrevCost;
	}

	public BigDecimal getMgmtFeeCost() {
		return mgmtFeeCost;
	}

	public void setMgmtFeeCost(BigDecimal mgmtFeeCost) {
		this.mgmtFeeCost = mgmtFeeCost;
	}

	private String expYearMonth; // 년월

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

    public Date getApprDt() {
        return apprDt;
    }

    public void setApprDt(Date apprDt) {
        this.apprDt = apprDt;
    }

    public int getUnitTot() {
        return unitTot;
    }

    public void setUnitTot(int unitTot) {
        this.unitTot = unitTot;
    }

    public BigDecimal getMgmtFeeTotal() {
        return mgmtFeeTotal;
    }

    public void setMgmtFeeTotal(BigDecimal mgmtFeeTotal) {
        this.mgmtFeeTotal = mgmtFeeTotal;
    }

    public BigDecimal getCleaningFee() {
        return cleaningFee;
    }

    public void setCleaningFee(BigDecimal cleaningFee) {
        this.cleaningFee = cleaningFee;
    }

    public BigDecimal getSecurityFee() {
        return securityFee;
    }

    public void setSecurityFee(BigDecimal securityFee) {
        this.securityFee = securityFee;
    }

    public BigDecimal getDisinfectionFee() {
        return disinfectionFee;
    }

    public void setDisinfectionFee(BigDecimal disinfectionFee) {
        this.disinfectionFee = disinfectionFee;
    }

    public BigDecimal getElevatorMaintFee() {
        return elevatorMaintFee;
    }

    public void setElevatorMaintFee(BigDecimal elevatorMaintFee) {
        this.elevatorMaintFee = elevatorMaintFee;
    }

    public BigDecimal getRepairFee() {
        return repairFee;
    }

    public void setRepairFee(BigDecimal repairFee) {
        this.repairFee = repairFee;
    }

    public BigDecimal getHeatingFeePublic() {
        return heatingFeePublic;
    }

    public void setHeatingFeePublic(BigDecimal heatingFeePublic) {
        this.heatingFeePublic = heatingFeePublic;
    }

    public BigDecimal getHeatingFeePrivate() {
        return heatingFeePrivate;
    }

    public void setHeatingFeePrivate(BigDecimal heatingFeePrivate) {
        this.heatingFeePrivate = heatingFeePrivate;
    }

    public BigDecimal getGasUsagePublic() {
        return gasUsagePublic;
    }

    public void setGasUsagePublic(BigDecimal gasUsagePublic) {
        this.gasUsagePublic = gasUsagePublic;
    }

    public BigDecimal getGasUsagePrivate() {
        return gasUsagePrivate;
    }

    public void setGasUsagePrivate(BigDecimal gasUsagePrivate) {
        this.gasUsagePrivate = gasUsagePrivate;
    }

    public BigDecimal getElecUsagePublic() {
        return elecUsagePublic;
    }

    public void setElecUsagePublic(BigDecimal elecUsagePublic) {
        this.elecUsagePublic = elecUsagePublic;
    }

    public BigDecimal getElecUsagePrivate() {
        return elecUsagePrivate;
    }

    public void setElecUsagePrivate(BigDecimal elecUsagePrivate) {
        this.elecUsagePrivate = elecUsagePrivate;
    }

    public BigDecimal getWaterUsagePublic() {
        return waterUsagePublic;
    }

    public void setWaterUsagePublic(BigDecimal waterUsagePublic) {
        this.waterUsagePublic = waterUsagePublic;
    }

    public BigDecimal getWaterUsagePrivate() {
        return waterUsagePrivate;
    }

    public void setWaterUsagePrivate(BigDecimal waterUsagePrivate) {
        this.waterUsagePrivate = waterUsagePrivate;
    }

    public String getExpYearMonth() {
        return expYearMonth;
    }

    public void setExpYearMonth(String expYearMonth) {
        this.expYearMonth = expYearMonth;
    }

    @Override
    public String toString() {
        return "MypageVo{" +
                "cmpxCd='" + cmpxCd + '\'' +
                ", cmpxNm='" + cmpxNm + '\'' +
                ", apprDt=" + apprDt +
                ", unitTot=" + unitTot +
                ", mgmtFeeTotal=" + mgmtFeeTotal +
                ", cleaningFee=" + cleaningFee +
                ", securityFee=" + securityFee +
                ", disinfectionFee=" + disinfectionFee +
                ", elevatorMaintFee=" + elevatorMaintFee +
                ", repairFee=" + repairFee +
                ", heatingFeePublic=" + heatingFeePublic +
                ", heatingFeePrivate=" + heatingFeePrivate +
                ", gasUsagePublic=" + gasUsagePublic +
                ", gasUsagePrivate=" + gasUsagePrivate +
                ", elecUsagePublic=" + elecUsagePublic +
                ", elecUsagePrivate=" + elecUsagePrivate +
                ", waterUsagePublic=" + waterUsagePublic +
                ", waterUsagePrivate=" + waterUsagePrivate +
                ", expYearMonth='" + expYearMonth + '\'' +
                '}';
    }
}
