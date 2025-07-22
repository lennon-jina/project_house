package com.house.team.board.service;

import java.io.StringReader;
import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;

import com.house.team.board.vo.PoliciesVO;

@Service
public class PoliciesService {
	private final String serviceKey = "gy6t4OyUYC96OMfSy1fu5h%2FBiwsaD3qDEu6df6IMEWQImz%2Bt6jE4%2F3iULAUm4xpkIHj1JumwIWThfId8J%2B3qvg%3D%3D";
	
	public List<PoliciesVO> fetchPolicyNews(int page, int pageSize, LocalDate startDate, LocalDate endDate) {
	    List<PoliciesVO> results = new ArrayList<>();
	    Set<String> seenUrls = new HashSet<>();
	    
	    String apiUrl = String.format("https://apis.data.go.kr/1371000/policyNewsService/policyNewsList" +
	            "?serviceKey=%s&startDate=%s&endDate=%s&numOfRows=100&pageNo=1", serviceKey,
	            startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
	            endDate.format(DateTimeFormatter.BASIC_ISO_DATE));
	    
	    // 프로젝트 관련 키워드 리스트
	    String[] keywords = {
	    	// 건물/주거 관련
	    	"건물", "아파트", "주택", "단지", "공동주택", "노후건물", "빌라", "오피스텔", "상가", "리모델링", "재건축", "재개발", "도시재생",
	    	    
	    	// 관리비/유지보수 관련
	    	"관리비", "공용 전기", "전기료", "전기요금", "수도요금", "가스요금", "수리", "보수", "보수공사", "유지관리", "수선충당금", "정비사업", "주거환경개선", "점검", "하자보수",
	    	    
	    	// 에너지 효율 관련
	    	"에너지", "에너지 절약", "절감", "에너지 효율", "고효율", "단열재", "단열", "창호", "보일러", "히트펌프", "냉난방", "열손실", "제로에너지", "패시브하우스", "태양광", "신재생에너지",
	    	    
	    	// 정책/지원 관련
	    	"정부 지원", "지원사업", "지원금", "보조금", "지자체 지원", "에너지바우처", "사업자 모집", "시범사업", "공모사업", "인센티브", "정책자금", "그린리모델링", "그린뉴딜",
	    	    
	    	// 환경 및 안전
	    	"환경", "친환경", "탄소중립", "기후변화", "미세먼지", "실내공기질", "화재안전", "내진설계", "안전진단", "건축물안전", "건축물관리법", "화재 예방"
	    	};
	    
	    try {
	        RestTemplate restTemplate = new RestTemplate();
	        URI uri = new URI(apiUrl);
	        String xmlResponse = restTemplate.getForObject(uri, String.class);
	        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	        DocumentBuilder builder = factory.newDocumentBuilder();
	        Document doc = builder.parse(new InputSource(new StringReader(xmlResponse)));
	        
	        NodeList items = doc.getElementsByTagName("NewsItem");
	        
	        for(int i=0; i<items.getLength(); i++) {
	            Element el = (Element) items.item(i);
	            String title = getTagValue(el, "Title");
	            String content = getTagValue(el, "DataContents");
	            String date = getTagValue(el, "ApproveDate");
	            String imgUrl = getTagValue(el, "OriginalimgUrl");
	            String newsUrl = getTagValue(el, "OriginalUrl");
	            
	            content = content.replaceAll("(?i)<br\\s*/?>", "\n").replaceAll("\n+", "\n").trim();

	            // 소문자 변환해서 대소문자 구분 없이 키워드 포함 여부 체크
	            String lowerTitle = title.toLowerCase();
	            String lowerContent = content.toLowerCase();
	            
	            boolean matches = false;
	            for (String kw : keywords) {
	                String lowerKw = kw.toLowerCase();
	                if (lowerTitle.contains(lowerKw) || lowerContent.contains(lowerKw)) {
	                    matches = true;
	                    System.out.println("키워드 일치: [" + kw + "] - 뉴스 제목: " + title);
	                    break;
	                }
	            }
	            if (!matches) {
	                System.out.println("필터링됨(키워드 없음): 뉴스 제목: " + title);
	                continue;
	            }

	            // 중복 제거 (URL 기준)
	            if (newsUrl != null && seenUrls.contains(newsUrl)) {
	                System.out.println("중복 제거됨(URL 기준): " + title);
	                continue;
	            }
	            seenUrls.add(newsUrl);
	            
	            PoliciesVO policies = new PoliciesVO();
	            policies.setTitle(title);
	            policies.setContent(content);
	            policies.setDate(date);
	            policies.setImgUrl((imgUrl == null || imgUrl.isEmpty()) ? "/img/news/1.png" : imgUrl);
	            policies.setNewsUrl(newsUrl);
	            
	            results.add(policies);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    
	    int fromIndex = (page - 1) * pageSize;
	    int toIndex = Math.min(fromIndex + pageSize, results.size());
	    
	    if (fromIndex > results.size()) {
	        return new ArrayList<>();
	    }
	    
	    return results.subList(fromIndex, toIndex);
	}
	
	private String getTagValue(Element element, String tag) {
		NodeList nodes = element.getElementsByTagName(tag);
		if(nodes.getLength() > 0) {
			return nodes.item(0).getTextContent();
		}
		return "";
	}
	
	public int countFilterPolicyNews(LocalDate startDate, LocalDate endDate) {
		List<PoliciesVO> result = fetchPolicyNews(1, Integer.MAX_VALUE, startDate, endDate);
		return result.size();
	}
	
	public List<PoliciesVO> searchPolicies(String keyword, LocalDate startDate, LocalDate endDate) {
		List<PoliciesVO> all = fetchPolicyNews(1, Integer.MAX_VALUE, startDate, endDate);
		
		keyword = keyword.toLowerCase();
		
		List<PoliciesVO> filtered = new ArrayList<>();
		for (PoliciesVO policy : all) {
			if (policy.getTitle().toLowerCase().contains(keyword) ||
				policy.getContent().toLowerCase().contains(keyword)) {
				filtered.add(policy);
			}
		}
		return filtered;
	}
	
	public List<PoliciesVO> fetchRecentPolicies(int limit) {
    	LocalDate startDate = LocalDate.now().minusDays(3);
    	LocalDate endDate = LocalDate.now().minusDays(1);
    	return fetchPolicyNews(1, limit, startDate, endDate);
	}
}
