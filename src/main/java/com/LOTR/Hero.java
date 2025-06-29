package com.LOTR;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Hero {
	
	public Hero() {
		super();
	}
public Hero(int HeroID) {
		super();
		this.HeroID = HeroID;
	}
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	
	private int HeroID; 
	
	
	private int teamID;
	
	private String HeroName;
	
	@Override
	public String toString() {
		return "Hero [HeroID=" + HeroID + ", teamID=" + teamID + ", HeroName=" + HeroName + ", ImageUrl="
				+ ImageUrl + "]";
	}

	

	public int getHeroID() {
		return HeroID;
	}

	public void setHeroID(int HeroID) {
		this.HeroID = HeroID;
	}

	

	public String getHeroName() {
		return HeroName;
	}

	public void setHeroName(String heroName) {
		HeroName = heroName;
	}

	public String getImageUrl() {
		return ImageUrl;
	}

	public void setImageUrl(String imageUrl) {
		ImageUrl = imageUrl;
	}

	private String ImageUrl;

}
