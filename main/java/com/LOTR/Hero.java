package com.LOTR;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient; // For fields not mapped to DB

import com.fasterxml.jackson.annotation.JsonBackReference; // To prevent infinite recursion in JSON
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.HashSet;
import java.util.Set;

@SuppressWarnings("unused")
@Entity

@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "heroID")
public class Hero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int heroID; 

    // Many-to-One relationship with Team
    // Many Heroes can belong to one Team
    @ManyToOne
    @JoinColumn(name = "team_id") // This is the foreign key column in the 'hero' table
    @JsonBackReference("team-heroes") 
    private Team team;

    // Many-to-Many relationship with Quest
    // Many Heroes can participate in many Quests
    @ManyToMany
    @JoinTable(
        name = "hero_quests", // Name of the join table
        joinColumns = @JoinColumn(name = "hero_id"), 
        inverseJoinColumns = @JoinColumn(name = "quest_id") 
    )
    private Set<Quest> quests = new HashSet<>(); 

    private String heroName; 
    private String imageUrl; 

    // Default constructor
    public Hero() {
        super();
    }

    
    public Hero(int heroID) {
        super();
        this.heroID = heroID;
    }

    // --- Getters and Setters ---

    public int getHeroID() {
        return heroID;
    }

    public void setHeroID(int heroID) {
        this.heroID = heroID;
    }

    public String getHeroName() {
        return heroName;
    }

    public void setHeroName(String heroName) {
        this.heroName = heroName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Set<Quest> getQuests() {
        return quests;
    }

    public void setQuests(Set<Quest> quests) {
        this.quests = quests;
    }

    // Helper methods for Many-to-Many relationship management
    public void addQuest(Quest quest) {
        this.quests.add(quest);
        quest.getHeroes().add(this); 
    }

    public void removeQuest(Quest quest) {
        this.quests.remove(quest);
        quest.getHeroes().remove(this); 
    }

    @Override
    public String toString() {
        return "Hero [heroID=" + heroID + ", heroName=" + heroName + ", imageUrl=" + imageUrl +
               (team != null ? ", team=" + team.getTeamName() : "") + "]";
    }
}
