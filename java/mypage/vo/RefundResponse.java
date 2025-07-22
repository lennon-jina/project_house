package com.house.team.mypage.vo;

import java.util.List;

public class RefundResponse {
	private int totalAmount;
	private List<RefundDetail> details;
	
	public int getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(int totalAmount) {
		this.totalAmount = totalAmount;
	}
	public List<RefundDetail> getDetails() {
		return details;
	}
	public void setDetails(List<RefundDetail> details) {
		this.details = details;
	}
	
	
}
