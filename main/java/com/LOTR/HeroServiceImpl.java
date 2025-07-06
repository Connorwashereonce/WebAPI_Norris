package com.LOTR;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // For managing transactions

import java.util.List;
import java.util.Optional;

@Service 
public class HeroServiceImpl implements HeroService {

    private final HeroRepository heroRepository;
    private final TeamRepository teamRepository; // Need this for assigning heroes to teams
    private final QuestRepository questRepository; // Need this for assigning heroes to quests

    
    public HeroServiceImpl(HeroRepository heroRepository, TeamRepository teamRepository, QuestRepository questRepository) {
        this.heroRepository = heroRepository;
        this.teamRepository = teamRepository;
        this.questRepository = questRepository;
    }

    @Override
    public Hero createHero(Hero hero) {
        // If a team is provided in the hero object, ensure it's a managed entity
        if (hero.getTeam() != null && hero.getTeam().getTeamID() != 0) {
            Team existingTeam = teamRepository.findById(hero.getTeam().getTeamID())
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + hero.getTeam().getTeamID()));
            hero.setTeam(existingTeam);
        }
        return heroRepository.save(hero);
    }

    @Override
    public List<Hero> getAllHeroes() {
        return heroRepository.findAll();
    }

    @Override
    public Optional<Hero> getHeroById(int id) {
        return heroRepository.findById(id);
    }

    @Override
    public Hero updateHero(int id, Hero heroDetails) {
        return heroRepository.findById(id)
                .map(hero -> {
                    hero.setHeroName(heroDetails.getHeroName());
                    hero.setImageUrl(heroDetails.getImageUrl());
                    
                    if (heroDetails.getTeam() != null && heroDetails.getTeam().getTeamID() != 0) {
                        Team existingTeam = teamRepository.findById(heroDetails.getTeam().getTeamID())
                            .orElseThrow(() -> new RuntimeException("Team not found with ID: " + heroDetails.getTeam().getTeamID()));
                        hero.setTeam(existingTeam);
                    } else if (heroDetails.getTeam() == null) {
                        hero.setTeam(null);
                    }
                    return heroRepository.save(hero);
                })
                .orElseThrow(() -> new RuntimeException("Hero not found with ID: " + id));
    }

    @Override
    public void deleteHero(int id) {
        heroRepository.deleteById(id);
    }

    @Override
    @Transactional // Ensures the entire operation is a single transaction
    public Hero assignHeroToTeam(int heroId, int teamId) {
        Hero hero = heroRepository.findById(heroId)
                .orElseThrow(() -> new RuntimeException("Hero not found with ID: " + heroId));
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + teamId));

        hero.setTeam(team); 
        team.addHero(hero); 
        return heroRepository.save(hero); 
    }

    @Override
    @Transactional
    public Hero assignHeroToQuest(int heroId, int questId) {
        Hero hero = heroRepository.findById(heroId)
                .orElseThrow(() -> new RuntimeException("Hero not found with ID: " + heroId));
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found with ID: " + questId));

        hero.addQuest(quest);
        return heroRepository.save(hero);
    }

    @Override
    @Transactional
    public Hero removeHeroFromQuest(int heroId, int questId) {
        Hero hero = heroRepository.findById(heroId)
                .orElseThrow(() -> new RuntimeException("Hero not found with ID: " + heroId));
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found with ID: " + questId));

        hero.removeQuest(quest);
        return heroRepository.save(hero);
    }
}
