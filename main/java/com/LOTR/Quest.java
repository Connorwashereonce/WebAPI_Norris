package com.LOTR;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.HashSet;
import java.util.Set;

@SuppressWarnings("unused")
@Entity

@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "questID")
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questID;

    private String questName;
    private String questDescription; // A new field for quest details

    // Many-to-Many relationship with Hero
    // Many Quests can have many Heroes
    // mappedBy indicates the field in the Hero entity that owns the relationship.
    // This side is the "inverse" side, meaning Hero is the owning side.
    @ManyToMany(mappedBy = "quests")
    private Set<Hero> heroes = new HashSet<>(); 

    // Default constructor
    public Quest() {
        super();
    }

   
    public Quest(int questID) {
        this.questID = questID;
    }

    // --- Getters and Setters ---

    public int getQuestID() {
        return questID;
    }

    public void setQuestID(int questID) {
        this.questID = questID;
    }

    public String getQuestName() {
        return questName;
    }

    public void setQuestName(String questName) {
        this.questName = questName;
    }

    public String getQuestDescription() {
        return questDescription;
    }

    public void setQuestDescription(String questDescription) {
        this.questDescription = questDescription;
    }

    public Set<Hero> getHeroes() {
        return heroes;
    }

    public void setHeroes(Set<Hero> heroes) {
        this.heroes = heroes;
    }

    // Helper methods for Many-to-Many relationship management
    public void addHero(Hero hero) {
        this.heroes.add(hero);
        hero.getQuests().add(this); 
    }

    public void removeHero(Hero hero) {
        this.heroes.remove(hero);
        hero.getQuests().remove(this); 
    }

    @Override
    public String toString() {
        return "Quest [questID=" + questID + ", questName=" + questName + ", questDescription=" + questDescription + "]";
    }
}
