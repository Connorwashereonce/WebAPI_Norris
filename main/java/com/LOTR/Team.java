package com.LOTR;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonManagedReference; // To prevent infinite recursion in JSON

import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int teamID;

    private String teamName;
    private String motto; // A new field for the team's motto

    // One-to-Many relationship with Hero
    // One Team can have many Heroes
  
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("team-heroes")
    private List<Hero> heroes = new ArrayList<>();

    // Default constructor
    public Team() {
        super();
    }

    // Constructor with ID
    public Team(int teamID) {
        this.teamID = teamID;
    }

    // --- Getters and Setters ---

    public int getTeamID() {
        return teamID;
    }

    public void setTeamID(int teamID) {
        this.teamID = teamID;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getMotto() {
        return motto;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public List<Hero> getHeroes() {
        return heroes;
    }

    public void setHeroes(List<Hero> heroes) {
        this.heroes = heroes;
    }

    // Helper method to add a hero to the team
    public void addHero(Hero hero) {
        heroes.add(hero);
        hero.setTeam(this); 
    }

    // Helper method to remove a hero from the team
    public void removeHero(Hero hero) {
        heroes.remove(hero);
        hero.setTeam(null); 
    }

    @Override
    public String toString() {
        return "Team [teamID=" + teamID + ", teamName=" + teamName + ", motto=" + motto + "]";
    }
}
